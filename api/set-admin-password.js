require('dotenv').config();
const { db } = require('@vercel/postgres');
const { hashPassword } = require('./lib/auth');

// Đặt lại mật khẩu (đã hash) cho một tài khoản đang có trong bảng users.
// Dùng khi DB được seed bằng bản cũ còn lưu mật khẩu plaintext, hoặc khi cần đổi mật khẩu.
//
//   npm run set-admin-password -- <username> <password>
//
// Mật khẩu truyền qua argv nên sẽ nằm trong history của shell — đổi xong nên xoá history
// hoặc dùng biến môi trường ADMIN_PASSWORD thay cho tham số thứ hai.

async function main() {
    const [username, passwordArg] = process.argv.slice(2);
    const password = passwordArg || process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.error('Cách dùng: npm run set-admin-password -- <username> <password>');
        console.error('Hoặc đặt ADMIN_PASSWORD trong .env rồi: npm run set-admin-password -- <username>');
        process.exit(1);
    }

    const hashed = hashPassword(password);
    const client = await db.connect();
    try {
        const { rows } = await client.sql`
            UPDATE users SET password = ${hashed}
            WHERE username = ${username}
            RETURNING id, username, role;
        `;
        if (rows.length === 0) {
            console.error(`Không tìm thấy tài khoản "${username}".`);
            process.exit(1);
        }
        console.log(`✅ Đã đặt lại mật khẩu cho "${rows[0].username}" (role: ${rows[0].role}).`);
    } finally {
        await client.end();
    }
}

main().catch((err) => {
    console.error('Đặt lại mật khẩu thất bại:', err.message);
    process.exit(1);
});
