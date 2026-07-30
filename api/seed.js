require('dotenv').config();
const { db } = require('@vercel/postgres');
const { hashPassword } = require('./lib/auth');
const {
  ANNOUNCEMENTS_DATA,
  DETAILED_PAPER_SUBMISSIONS_DATA,
  KEYNOTE_SPEAKERS_DATA,
  CONFERENCE_TOPICS_DATA,
  SPONSORS_DATA,
  CO_ORGANIZERS_DATA,
  NAV_LINKS
} = require('./constants');

const initialSiteContent = {
  eventBannerImage: 'https://picsum.photos/seed/ai4edu-event-banner/1600/500',
  keynoteSpeakers: KEYNOTE_SPEAKERS_DATA,
  conferenceTopics: CONFERENCE_TOPICS_DATA,
  sponsors: SPONSORS_DATA,
  coOrganizers: CO_ORGANIZERS_DATA,
  navLinks: NAV_LINKS,
  heroTitle: "HỘI THẢO QUỐC GIA",
  heroSubtitle: "AI và Giáo dục Phổ thông: Hành động vì sự chuyển đổi (AI4EDU 2026)",
  conferenceDate: "Tháng 9/2026",
  conferenceLocation: "Trường Đại học Thủ đô Hà Nội",
};

/**
 * Tài khoản admin lấy từ biến môi trường và lưu dạng hash. Cố ý KHÔNG có mật khẩu
 * mặc định: seed một tài khoản mà ai đọc repo cũng biết mật khẩu thì coi như không có
 * bảo mật. Thiếu env thì dừng seed với hướng dẫn cụ thể.
 */
const buildInitialAdmin = () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL || 'admin@daihocthudo.edu.vn';

  if (!username || !password) {
    throw new Error(
      'Bảng users đang rỗng nhưng thiếu ADMIN_USERNAME / ADMIN_PASSWORD trong biến môi trường.\n' +
      'Đặt hai biến này (mật khẩu tối thiểu 8 ký tự) rồi chạy lại. Muốn đổi mật khẩu của\n' +
      'tài khoản đã tồn tại thì dùng: npm run set-admin-password -- <username> <password>'
    );
  }

  return { username, password: hashPassword(password), role: 'admin', email };
};

const initialRegistrations = [];

async function seed(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('PostgreSQL extensions checked/created.');

    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `;
    console.log('Checked/Created "users" table.');

    await client.sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        organization TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        "withPaper" TEXT
      );
    `;
    console.log('Checked/Created "registrations" table.');

    await client.sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT,
        content TEXT,
        "imageUrl" TEXT,
        "contentImages" JSONB,
        "externalLink" TEXT
      );
    `;
    await client.sql`
      ALTER TABLE announcements ADD COLUMN IF NOT EXISTS "externalLink" TEXT;
    `;
    console.log('Checked/Created "announcements" table.');

    await client.sql`
      CREATE TABLE IF NOT EXISTS papers (
        id SERIAL PRIMARY KEY,
        "paperCode" TEXT,
        "authorName" TEXT NOT NULL,
        organization TEXT,
        "paperTitle" TEXT NOT NULL,
        topic INTEGER,
        "abstractStatus" TEXT,
        "fullTextStatus" TEXT,
        "reviewStatus" TEXT,
        "presentationStatus" TEXT,
        "fullTextUrl" TEXT,
        "fullTextFileName" TEXT
      );
    `;
    console.log('Checked/Created "papers" table.');

    try {
      await client.sql`ALTER TABLE papers ADD COLUMN IF NOT EXISTS "paperCode" TEXT;`;
      await client.sql`ALTER TABLE papers ADD COLUMN IF NOT EXISTS "fullTextUrl" TEXT;`;
      await client.sql`ALTER TABLE papers ADD COLUMN IF NOT EXISTS "fullTextFileName" TEXT;`;
      await client.sql`ALTER TABLE announcements ADD COLUMN IF NOT EXISTS "contentImages" JSONB;`;
      console.log('Added file columns to papers and announcements tables (if not exist).');
    } catch (error) {
      console.log('File columns already exist or error adding them:', error.message);
    }

    await client.sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id INTEGER PRIMARY KEY,
        content JSONB
      );
    `;
    console.log('Checked/Created "site_content" table.');

    // Only insert initial data if tables are empty
    const { rows: userCount } = await client.sql`SELECT COUNT(*) FROM users;`;
    if (parseInt(userCount[0].count) === 0) {
      const admin = buildInitialAdmin();
      await client.sql`
        INSERT INTO users (username, password, role, email)
        VALUES (${admin.username}, ${admin.password}, ${admin.role}, ${admin.email})
        ON CONFLICT (username) DO NOTHING;
      `;
      console.log(`Seeded "users" table with admin "${admin.username}".`);
    } else {
      console.log('Users table already has data, skipping seed.');
      // DB đã seed bằng bản cũ thì mật khẩu còn là plaintext -> verifyPassword luôn
      // trả false -> không ai đăng nhập được. Cảnh báo để chạy set-admin-password.
      const { rows: legacy } = await client.sql`
        SELECT username FROM users WHERE password NOT LIKE 'scrypt$%';
      `;
      if (legacy.length > 0) {
        console.warn(
          `\n⚠️  ${legacy.length} tài khoản còn mật khẩu chưa hash: ${legacy.map(u => u.username).join(', ')}.\n` +
          '   Các tài khoản này KHÔNG đăng nhập được. Đặt lại bằng:\n' +
          '   npm run set-admin-password -- <username> <password-moi>\n'
        );
      }
    }

    const { rows: regCount } = await client.sql`SELECT COUNT(*) FROM registrations;`;
    if (parseInt(regCount[0].count) === 0 && initialRegistrations.length > 0) {
      await Promise.all(
        initialRegistrations.map(reg =>
          client.sql`
            INSERT INTO registrations (id, name, organization, email, phone, "withPaper")
            VALUES (${reg.id}, ${reg.name}, ${reg.organization}, ${reg.email}, ${reg.phone}, ${reg.withPaper});
          `
        )
      );
      console.log('Seeded "registrations" table.');
    } else {
      console.log('Registrations table already has data or no initial data, skipping seed.');
    }

    const { rows: annCount } = await client.sql`SELECT COUNT(*) FROM announcements;`;
    if (parseInt(annCount[0].count) === 0) {
      await Promise.all(
        ANNOUNCEMENTS_DATA.map(ann =>
          client.sql`
            INSERT INTO announcements (id, title, date, content, "imageUrl", "contentImages")
            VALUES (${ann.id}, ${ann.title}, ${ann.date}, ${ann.content}, ${ann.imageUrl}, ${JSON.stringify(ann.contentImages || [])}::jsonb);
          `
        )
      );
      console.log('Seeded "announcements" table.');
    } else {
      console.log('Announcements table already has data, skipping seed.');
    }

    const { rows: paperCount } = await client.sql`SELECT COUNT(*) FROM papers;`;
    if (parseInt(paperCount[0].count) === 0 && DETAILED_PAPER_SUBMISSIONS_DATA.length > 0) {
      await Promise.all(
        DETAILED_PAPER_SUBMISSIONS_DATA.map(paper =>
          client.sql`
            INSERT INTO papers (id, "authorName", organization, "paperTitle", topic, "abstractStatus", "fullTextStatus", "reviewStatus", "presentationStatus")
            VALUES (${paper.id}, ${paper.authorName}, ${paper.organization}, ${paper.paperTitle}, ${paper.topic}, ${paper.abstractStatus}, ${paper.fullTextStatus}, ${paper.reviewStatus}, ${paper.presentationStatus});
          `
        )
      );
      console.log('Seeded "papers" table.');
    } else {
      console.log('Papers table already has data or no initial data, skipping seed.');
    }

    const { rows: contentCount } = await client.sql`SELECT COUNT(*) FROM site_content;`;
    if (parseInt(contentCount[0].count) === 0) {
      await client.sql`
        INSERT INTO site_content (id, content)
        VALUES (1, ${JSON.stringify(initialSiteContent)});
      `;
      console.log('Seeded "site_content" table.');
    } else {
      console.log('Site content already exists, skipping seed.');
    }

    // Bản seed này INSERT id tường minh vào cột SERIAL, mà Postgres không nhảy sequence
    // khi id được chỉ định -> sequence vẫn đứng ở 1 -> bản ghi đầu tiên tạo qua UI bị
    // lỗi trùng khóa chính. setval là idempotent, chạy vô điều kiện cho an toàn.
    await client.sql`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);`;
    await client.sql`SELECT setval('registrations_id_seq', COALESCE((SELECT MAX(id) FROM registrations), 0) + 1, false);`;
    await client.sql`SELECT setval('announcements_id_seq', COALESCE((SELECT MAX(id) FROM announcements), 0) + 1, false);`;
    await client.sql`SELECT setval('papers_id_seq', COALESCE((SELECT MAX(id) FROM papers), 0) + 1, false);`;
    console.log('Synced id sequences for users, registrations, announcements, papers.');

    console.log('\n✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  try {
    await seed(client);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
  process.exit(1);
});
