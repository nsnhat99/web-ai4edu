require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { sql } = require('@vercel/postgres');
const { put, del } = require('@vercel/blob');
const { appendRow, createResumableUpload, makeFilePublic } = require('./lib/google');
const {
  SESSION_TTL_SECONDS,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} = require('./lib/auth');

const app = express();

const SESSION_COOKIE = 'ai4edu_session';

// Middleware
// credentials: true để browser gửi cookie session. Không dùng origin '*' vì kèm
// credentials thì spec cấm; site và API cùng origin trên Vercel nên phản chiếu origin.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));

// --- SESSION ---
// Tự đọc cookie từ header thay vì thêm cookie-parser: chỉ cần đúng một cookie.
const readSessionCookie = (req) => {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === SESSION_COOKIE) return decodeURIComponent(rest.join('='));
  }
  return null;
};

const buildSessionCookie = (token, maxAgeSeconds) => {
  const attributes = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    // Lax chứ không Strict: chặn được POST từ site khác (CSRF) nhưng vẫn giữ
    // đăng nhập khi admin mở link tới trang quản trị từ email.
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === 'production') attributes.push('Secure');
  return attributes.join('; ');
};

/** Chặn mọi thao tác ghi và dữ liệu nội bộ. Không có middleware này thì API ai cũng gọi được. */
const requireAdmin = (req, res, next) => {
  const session = verifySessionToken(readSessionCookie(req));
  if (!session || session.role !== 'admin') {
    return res.status(401).json({ message: 'Cần đăng nhập bằng tài khoản admin' });
  }
  req.session = session;
  next();
};

// --- PUBLIC SUBMISSION ENDPOINTS (Google Sheets + Drive) ---
// File upload bypasses this server: FE gets a resumable session URL and PUTs directly to Drive.

app.post('/api/drive/init-upload', requireAdmin, async (req, res) => {
  const { fileName, mimeType } = req.body || {};
  if (!fileName || !mimeType) {
    return res.status(400).json({ message: 'fileName and mimeType are required' });
  }
  try {
    const { sessionUrl } = await createResumableUpload({ fileName, mimeType });
    res.json({ sessionUrl });
  } catch (error) {
    console.error('init-upload error:', error);
    res.status(500).json({ message: 'Failed to init Drive upload', details: error.message });
  }
});

app.post('/api/public/papers', requireAdmin, async (req, res) => {
  const {
    authorName, organization, email, phone, paperTitle, topic,
    fileId, fileName,
  } = req.body || {};
  if (!authorName || !organization || !email || !paperTitle || !fileId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const meta = await makeFilePublic(fileId);
    const driveUrl = meta.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
    const timestamp = new Date().toISOString();
    await appendRow('Papers', [
      timestamp, authorName, organization, email, phone || '',
      paperTitle, String(topic || ''), fileName || '', driveUrl,
      'Duyệt', 'Đang chờ duyệt', 'Đang chờ duyệt', 'Không trình bày',
    ]);
    res.status(201).json({ ok: true, driveUrl });
  } catch (error) {
    console.error('public/papers error:', error);
    res.status(500).json({ message: 'Failed to submit paper', details: error.message });
  }
});

app.post('/api/public/registrations', requireAdmin, async (req, res) => {
  const {
    tab, name, organization, email, phone,
    paperTitle, topic, delegateType, activities,
    bankAccount, taxCode,
    fileId, fileName,
  } = req.body || {};
  if (!tab || !name || !organization || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    let driveUrl = '';
    if (fileId) {
      const meta = await makeFilePublic(fileId);
      driveUrl = meta.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
    }
    const timestamp = new Date().toISOString();
    await appendRow('Registrations', [
      timestamp, tab, name, organization, email, phone || '',
      paperTitle || '', String(topic || ''),
      delegateType || '', Array.isArray(activities) ? activities.join(', ') : (activities || ''),
      bankAccount || '', taxCode || '',
      fileName || '', driveUrl,
    ]);
    res.status(201).json({ ok: true, driveUrl });
  } catch (error) {
    console.error('public/registrations error:', error);
    res.status(500).json({ message: 'Failed to submit registration', details: error.message });
  }
});

app.post('/api/public/contacts', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const timestamp = new Date().toISOString();
    await appendRow('Contacts', [timestamp, name, email, subject || '', message]);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('public/contacts error:', error);
    res.status(500).json({ message: 'Failed to submit contact', details: error.message });
  }
});

// Multer config for image uploads.
// 4MB: aligned with Vercel serverless function body cap (~4.5MB).
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh'));
  }
});

const isVercelBlobUrl = (urlStr) => {
  try {
    const u = new URL(urlStr);
    return u.hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
};

// --- GENERIC IMAGE UPLOAD ---
app.post('/api/uploads/image', requireAdmin, (req, res, next) => {
  imageUpload.single('file')(req, res, (err) => {
    if (err) {
      const code = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(code).json({ message: err.message || 'Upload thất bại' });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Thiếu file' });
  try {
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blob = await put(`images/${Date.now()}-${safeName}`, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });
    res.json({ url: blob.url });
  } catch (error) {
    res.status(500).json({ message: 'Upload thất bại', details: error.message });
  }
});

app.delete('/api/uploads/image', requireAdmin, async (req, res) => {
  const url = (req.query.url || req.body?.url || '').toString();
  if (!url) return res.status(400).json({ message: 'Thiếu url' });
  if (!isVercelBlobUrl(url)) {
    return res.status(400).json({ message: 'URL không thuộc Vercel Blob' });
  }
  try {
    await del(url);
    res.json({ ok: true });
  } catch (error) {
    res.status(200).json({ ok: false, details: error.message });
  }
});

app.get('/api/test-db', requireAdmin, async (req, res) => {
  try {
    const { rows } = await sql`SELECT NOW();`;
    res.json({ message: 'Database connected', time: rows[0].now });
  } catch (error) {
    res.status(500).json({ message: 'Database error', details: error.message });
  }
});

// --- AUTH & USERS ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Thiếu tên đăng nhập hoặc mật khẩu' });
  }
  try {
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username};`;
    const user = rows[0];
    // Không tách riêng "sai tên" và "sai mật khẩu" để không tiết lộ user nào tồn tại.
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const { password: _password, ...userWithoutPassword } = user;
    res.setHeader('Set-Cookie', buildSessionCookie(createSessionToken(user), SESSION_TTL_SECONDS));
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Database error during login', details: error.message });
  }
});

app.post('/api/logout', (req, res) => {
  res.setHeader('Set-Cookie', buildSessionCookie('', 0));
  res.status(204).end();
});

/** Cho FE phục hồi phiên sau khi refresh trang. 401 nghĩa là chưa đăng nhập, không phải lỗi. */
app.get('/api/me', async (req, res) => {
  const session = verifySessionToken(readSessionCookie(req));
  if (!session) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  try {
    const { rows } = await sql`SELECT id, username, role, email FROM users WHERE id = ${session.sub};`;
    if (rows.length === 0) {
      res.setHeader('Set-Cookie', buildSessionCookie('', 0));
      return res.status(401).json({ message: 'Tài khoản không còn tồn tại' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Database error', details: error.message });
  }
});

app.get('/api/users', requireAdmin, async (req, res) => {
  try {
    const { rows } = await sql`SELECT id, username, role, email FROM users;`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', details: error.message });
  }
});

// --- REGISTRATIONS ---
app.get('/api/registrations', requireAdmin, async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM registrations ORDER BY id DESC;`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch registrations', details: error.message });
  }
});

app.post('/api/registrations', requireAdmin, async (req, res) => {
  const { name, organization, email, phone, withPaper } = req.body;
  try {
    const { rows } = await sql`
      INSERT INTO registrations (name, organization, email, phone, "withPaper")
      VALUES (${name}, ${organization}, ${email}, ${phone}, ${withPaper})
      RETURNING *;
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create registration', details: error.message });
  }
});

// --- ANNOUNCEMENTS ---
app.get('/api/announcements', async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM announcements ORDER BY id DESC;`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcements', details: error.message });
  }
});

app.post('/api/announcements', requireAdmin, async (req, res) => {
  const { title, content, imageUrl, contentImages, externalLink, date: dateInput } = req.body;
  const date = dateInput && String(dateInput).trim() !== ''
    ? dateInput
    : new Intl.DateTimeFormat('en-GB').format(new Date());
  try {
    const { rows } = await sql`
      INSERT INTO announcements (title, content, "imageUrl", date, "contentImages", "externalLink")
      VALUES (${title}, ${content}, ${imageUrl}, ${date}, ${JSON.stringify(contentImages || [])}::jsonb, ${externalLink || null})
      RETURNING *;
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement', details: error.message });
  }
});

app.put('/api/announcements/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, content, imageUrl, contentImages, externalLink, date } = req.body;
  try {
    const { rows } = await sql`
      UPDATE announcements
      SET
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        date = COALESCE(${date}, date),
        "imageUrl" = COALESCE(${imageUrl}, "imageUrl"),
        "contentImages" = COALESCE(${contentImages ? JSON.stringify(contentImages) : null}::jsonb, "contentImages"),
        "externalLink" = COALESCE(${externalLink}, "externalLink")
      WHERE id = ${id}
      RETURNING *;
    `;
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Announcement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update announcement', details: error.message });
  }
});

app.delete('/api/announcements/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows: existing } = await sql`SELECT "imageUrl", "contentImages" FROM announcements WHERE id = ${id};`;
    if (existing.length > 0) {
      const urls = [];
      if (existing[0].imageUrl) urls.push(existing[0].imageUrl);
      if (Array.isArray(existing[0].contentImages)) urls.push(...existing[0].contentImages);
      for (const url of urls) {
        if (typeof url === 'string' && /^https?:\/\//.test(url) && !url.startsWith('data:')) {
          try { await del(url); } catch (err) { console.error('Error deleting announcement blob:', err); }
        }
      }
    }
    const result = await sql`DELETE FROM announcements WHERE id = ${id};`;
    if (result.rowCount > 0) {
      res.status(200).json({ id: id });
    } else {
      res.status(404).json({ message: "Announcement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete announcement', details: error.message });
  }
});

// --- PAPERS ---
// Trang Kết quả duyệt bài là công khai nên endpoint này không cần đăng nhập. Liệt kê
// cột tường minh thay vì SELECT *: cột "fullTextUrl" trỏ tới file trên Drive/Blob,
// SELECT * sẽ đẩy link đó ra response cho mọi khách.
app.get('/api/papers', async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT id, "paperCode", "authorName", organization, "paperTitle", topic,
             "abstractStatus", "fullTextStatus", "reviewStatus", "presentationStatus"
      FROM papers ORDER BY id DESC;
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch papers', details: error.message });
  }
});

app.get('/api/papers/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows } = await sql`SELECT * FROM papers WHERE id = ${id};`;
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Paper not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch paper', details: error.message });
  }
});

app.post('/api/papers', requireAdmin, async (req, res) => {
  const {
    paperCode,
    authorName,
    organization,
    paperTitle,
    topic,
    abstractStatus,
    fullTextStatus,
    reviewStatus,
    presentationStatus,
  } = req.body;
  try {
    const { rows } = await sql`
      INSERT INTO papers ("paperCode", "authorName", organization, "paperTitle", topic, "abstractStatus", "fullTextStatus", "reviewStatus", "presentationStatus")
      VALUES (
        ${paperCode || null},
        ${authorName},
        ${organization},
        ${paperTitle},
        ${parseInt(topic, 10)},
        ${abstractStatus || 'Duyệt'},
        ${fullTextStatus || 'Đang chờ duyệt'},
        ${reviewStatus || 'Đang chờ duyệt'},
        ${presentationStatus || 'Không trình bày'}
      )
      RETURNING *;
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create paper', details: error.message });
  }
});

app.put('/api/papers/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { paperCode, authorName, organization, paperTitle, topic, abstractStatus, fullTextStatus, reviewStatus, presentationStatus } = req.body;
  const topicValue = topic == null || topic === '' ? null : parseInt(topic, 10);
  try {
    const { rows } = await sql`
      UPDATE papers
      SET
        "paperCode" = COALESCE(${paperCode}, "paperCode"),
        "authorName" = COALESCE(${authorName}, "authorName"),
        organization = COALESCE(${organization}, organization),
        "paperTitle" = COALESCE(${paperTitle}, "paperTitle"),
        topic = COALESCE(${topicValue}, topic),
        "abstractStatus" = COALESCE(${abstractStatus}, "abstractStatus"),
        "fullTextStatus" = COALESCE(${fullTextStatus}, "fullTextStatus"),
        "reviewStatus" = COALESCE(${reviewStatus}, "reviewStatus"),
        "presentationStatus" = COALESCE(${presentationStatus}, "presentationStatus")
      WHERE id = ${id}
      RETURNING *;
    `;
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Paper not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update paper', details: error.message });
  }
});

app.delete('/api/papers/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await sql`DELETE FROM papers WHERE id = ${id};`;
    if (result.rowCount > 0) {
      res.status(200).json({ id: id });
    } else {
      res.status(404).json({ message: "Paper not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete paper', details: error.message });
  }
});

// --- SITE CONTENT ---
app.get('/api/site-content', async (req, res) => {
  try {
    const { rows } = await sql`SELECT content FROM site_content WHERE id = 1;`;
    if (rows.length > 0) {
      res.json(rows[0].content);
    } else {
      res.status(404).json({ message: "Site content not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch site content', details: error.message });
  }
});

app.put('/api/site-content', requireAdmin, async (req, res) => {
  const partialContent = req.body;
  try {
    const { rows } = await sql`
      UPDATE site_content
      SET content = content || ${JSON.stringify(partialContent)}::jsonb
      WHERE id = 1
      RETURNING content;
    `;
    if (rows.length > 0) {
      res.json(rows[0].content);
    } else {
      res.status(404).json({ message: "Site content not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update site content', details: error.message });
  }
});

app.get("/api/hello", (req, res) => {
  return res.send("Hello from AI4EDU 2026 API");
});

// Export the app for Vercel
module.exports = app;
