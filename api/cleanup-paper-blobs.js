require('dotenv').config();
const { sql } = require('@vercel/postgres');
const { list, del } = require('@vercel/blob');

(async () => {
  console.log('Liệt kê blob papers/*...');
  let cursor;
  let total = 0;
  do {
    const result = await list({ prefix: 'papers/', cursor });
    for (const blob of result.blobs) {
      await del(blob.url);
      console.log(`Đã xóa: ${blob.pathname}`);
      total++;
    }
    cursor = result.cursor;
  } while (cursor);
  console.log(`Tổng ${total} blob đã xóa.`);

  console.log('NULL fullTextUrl / fullTextFileName trong DB...');
  const r = await sql`UPDATE papers SET "fullTextUrl" = NULL, "fullTextFileName" = NULL WHERE "fullTextUrl" IS NOT NULL OR "fullTextFileName" IS NOT NULL`;
  console.log(`Đã NULL ${r.rowCount} row.`);
  console.log('Hoàn tất.');
})().catch(err => {
  console.error('Cleanup thất bại:', err);
  process.exit(1);
});
