require('dotenv').config();
const { sql } = require('@vercel/postgres');
const { put } = require('@vercel/blob');

const isDataUrl = (s) => typeof s === 'string' && s.startsWith('data:');

const parseDataUrl = (dataUrl) => {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], buffer: Buffer.from(match[2], 'base64') };
};

async function uploadDataUrl(dataUrl, hint) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return dataUrl;
  const ext = (parsed.mime.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
  const blob = await put(`images/migrated-${hint}-${Date.now()}.${ext}`, parsed.buffer, {
    access: 'public',
    contentType: parsed.mime,
  });
  return blob.url;
}

async function migrateAnnouncements() {
  const { rows } = await sql`SELECT id, "imageUrl", "contentImages" FROM announcements`;
  for (const row of rows) {
    let imageUrl = row.imageUrl;
    if (isDataUrl(imageUrl)) {
      imageUrl = await uploadDataUrl(imageUrl, `ann-${row.id}-cover`);
      console.log(`[ann ${row.id}] imageUrl -> ${imageUrl}`);
    }
    const oldList = Array.isArray(row.contentImages) ? row.contentImages : [];
    const newList = [];
    for (let i = 0; i < oldList.length; i++) {
      if (isDataUrl(oldList[i])) {
        const url = await uploadDataUrl(oldList[i], `ann-${row.id}-${i}`);
        console.log(`[ann ${row.id}] contentImages[${i}] -> ${url}`);
        newList.push(url);
      } else {
        newList.push(oldList[i]);
      }
    }
    await sql`UPDATE announcements SET "imageUrl" = ${imageUrl}, "contentImages" = ${JSON.stringify(newList)}::jsonb WHERE id = ${row.id}`;
  }
}

async function migrateSiteContent() {
  const { rows } = await sql`SELECT content FROM site_content WHERE id = 1`;
  if (rows.length === 0) return;
  const c = rows[0].content;

  if (Array.isArray(c.keynoteSpeakers)) {
    for (const s of c.keynoteSpeakers) {
      if (isDataUrl(s.imageUrl)) {
        s.imageUrl = await uploadDataUrl(s.imageUrl, `speaker-${s.id}`);
        console.log(`[speaker ${s.id}] -> ${s.imageUrl}`);
      }
    }
  }

  for (const key of ['sponsors', 'coOrganizers']) {
    if (Array.isArray(c[key])) {
      for (const item of c[key]) {
        if (isDataUrl(item.logoUrl)) {
          item.logoUrl = await uploadDataUrl(item.logoUrl, `${key}-${item.id}`);
          console.log(`[${key} ${item.id}] -> ${item.logoUrl}`);
        }
      }
    }
  }

  if (isDataUrl(c.eventBannerImage)) {
    c.eventBannerImage = await uploadDataUrl(c.eventBannerImage, 'banner');
    console.log(`[banner] -> ${c.eventBannerImage}`);
  }

  await sql`UPDATE site_content SET content = ${JSON.stringify(c)}::jsonb WHERE id = 1`;
}

(async () => {
  console.log('Bắt đầu migrate base64 -> Blob...');
  await migrateAnnouncements();
  await migrateSiteContent();
  console.log('Hoàn tất.');
})().catch(err => {
  console.error('Migrate thất bại:', err);
  process.exit(1);
});
