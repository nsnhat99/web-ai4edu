const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { sql } = require('@vercel/postgres');
const { put, del, list } = require('@vercel/blob');
const { appendRow, createResumableUpload, makeFilePublic } = require('./lib/google');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- PUBLIC SUBMISSION ENDPOINTS (Google Sheets + Drive) ---
// File upload bypasses this server: FE gets a resumable session URL and PUTs directly to Drive.

app.post('/api/drive/init-upload', async (req, res) => {
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

app.post('/api/public/papers', async (req, res) => {
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

app.post('/api/public/registrations', async (req, res) => {
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

// Multer config for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word files are allowed!'));
    }
  }
});

app.get('/api/test-db', async (req, res) => {
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
  try {
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username};`;
    const user = rows[0];
    if (user && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Database error during login', details: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await sql`SELECT id, username, role, email FROM users;`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', details: error.message });
  }
});

// --- REGISTRATIONS ---
app.get('/api/registrations', async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM registrations ORDER BY id DESC;`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch registrations', details: error.message });
  }
});

app.post('/api/registrations', async (req, res) => {
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

app.post('/api/announcements', async (req, res) => {
  const { title, content, imageUrl, contentImages } = req.body;
  const date = new Intl.DateTimeFormat('en-GB').format(new Date());
  try {
    const { rows } = await sql`
      INSERT INTO announcements (title, content, "imageUrl", date, "contentImages")
      VALUES (${title}, ${content}, ${imageUrl}, ${date}, ${JSON.stringify(contentImages || [])}::jsonb)
      RETURNING *;
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement', details: error.message });
  }
});

app.put('/api/announcements/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, content, imageUrl, contentImages } = req.body;
  try {
    const { rows } = await sql`
      UPDATE announcements
      SET 
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        "imageUrl" = COALESCE(${imageUrl}, "imageUrl"),
        "contentImages" = COALESCE(${contentImages ? JSON.stringify(contentImages) : null}::jsonb, "contentImages")
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

app.delete('/api/announcements/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
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
app.get('/api/papers', async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM papers ORDER BY id DESC;`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch papers', details: error.message });
  }
});

app.get('/api/papers/:id', async (req, res) => {
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

app.post('/api/papers', async (req, res) => {
  const {
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
      INSERT INTO papers ("authorName", organization, "paperTitle", topic, "abstractStatus", "fullTextStatus", "reviewStatus", "presentationStatus")
      VALUES (
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

app.put('/api/papers/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { authorName, organization, paperTitle, abstractStatus, fullTextStatus, reviewStatus, presentationStatus } = req.body;
  try {
    const { rows } = await sql`
      UPDATE papers
      SET 
        "authorName" = COALESCE(${authorName}, "authorName"),
        organization = COALESCE(${organization}, organization),
        "paperTitle" = COALESCE(${paperTitle}, "paperTitle"),
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

app.delete('/api/papers/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows } = await sql`SELECT "fullTextUrl" FROM papers WHERE id = ${id};`;
    if (rows.length === 0) {
      return res.status(404).json({ message: "Paper not found" });
    }
    const paper = rows[0];
    if (paper.fullTextUrl) {
      try { await del(paper.fullTextUrl); } catch (err) { console.error('Error deleting fulltext file:', err); }
    }
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

// --- FILE UPLOAD ENDPOINTS ---
app.post('/api/papers/:id/upload-fulltext', upload.single('file'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const { rows: paperRows } = await sql`SELECT id, "fullTextUrl" FROM papers WHERE id = ${id};`;
    if (paperRows.length === 0) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    if (paperRows[0].fullTextUrl) {
      try { await del(paperRows[0].fullTextUrl); } catch (err) { console.error('Error deleting old fulltext:', err); }
    }
    const fileName = `${id}-fulltext-${Date.now()}-${req.file.originalname}`;
    const blob = await put(`papers/${fileName}`, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });
    const { rows } = await sql`
      UPDATE papers
      SET 
        "fullTextUrl" = ${blob.url},
        "fullTextFileName" = ${req.file.originalname},
        "fullTextStatus" = 'Duyệt'
      WHERE id = ${id}
      RETURNING *;
    `;
    res.json({ message: 'Full text uploaded successfully', paper: rows[0], fileUrl: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload full text', details: error.message });
  }
});

app.delete('/api/papers/:id/delete-fulltext', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows: paperRows } = await sql`SELECT "fullTextUrl" FROM papers WHERE id = ${id};`;
    if (paperRows.length === 0) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    if (paperRows[0].fullTextUrl) {
      await del(paperRows[0].fullTextUrl);
    }
    const { rows } = await sql`
      UPDATE papers
      SET "fullTextUrl" = NULL, "fullTextFileName" = NULL, "fullTextStatus" = 'Đang chờ duyệt'
      WHERE id = ${id}
      RETURNING *;
    `;
    res.json({ message: 'Full text deleted successfully', paper: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete full text', details: error.message });
  }
});

app.get('/api/papers/files/list', async (req, res) => {
  try {
    const { blobs } = await list({ prefix: 'papers/' });
    res.json({
      count: blobs.length,
      files: blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to list files', details: error.message });
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

app.put('/api/site-content', async (req, res) => {
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
