const crypto = require('crypto');

// Hash mật khẩu bằng scrypt và ký session token bằng HMAC-SHA256 — đều là module
// `crypto` có sẵn của Node, không thêm dependency.

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 tiếng, đủ một buổi làm việc của admin
const HASH_PREFIX = 'scrypt';

/** Lấy secret ký token. Thiếu env là lỗi cấu hình, phải dừng chứ không được fallback. */
const getAuthSecret = () => {
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('AUTH_SECRET chưa được cấu hình hoặc ngắn hơn 32 ký tự. Sinh bằng: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }
    return secret;
};

/** Trả về chuỗi dạng `scrypt$<salt hex>$<hash hex>` để lưu vào cột users.password. */
const hashPassword = (password) => {
    if (!password || password.length < 8) {
        throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
    }
    const salt = crypto.randomBytes(SALT_BYTES);
    const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
    return `${HASH_PREFIX}$${salt.toString('hex')}$${hash.toString('hex')}`;
};

/**
 * So khớp mật khẩu với giá trị đã lưu. Trả về false cho mọi dữ liệu không đúng
 * định dạng hash — kể cả mật khẩu plaintext của bản seed cũ, để không ai đăng nhập
 * được bằng bản ghi chưa migrate (xem `npm run set-admin-password`).
 */
const verifyPassword = (password, stored) => {
    if (typeof stored !== 'string' || !stored.startsWith(`${HASH_PREFIX}$`)) {
        return false;
    }
    const [, saltHex, hashHex] = stored.split('$');
    if (!saltHex || !hashHex) return false;

    const expected = Buffer.from(hashHex, 'hex');
    if (expected.length !== SCRYPT_KEYLEN) return false;

    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), SCRYPT_KEYLEN);
    return crypto.timingSafeEqual(expected, actual);
};

const base64url = (buffer) => buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromBase64url = (value) => Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

const sign = (payloadPart) =>
    base64url(crypto.createHmac('sha256', getAuthSecret()).update(payloadPart).digest());

/** Token dạng `<payload base64url>.<hmac base64url>`, hết hạn sau SESSION_TTL_SECONDS. */
const createSessionToken = (user) => {
    const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
    const payloadPart = base64url(Buffer.from(JSON.stringify(payload)));
    return `${payloadPart}.${sign(payloadPart)}`;
};

/** Trả về payload nếu token hợp lệ và chưa hết hạn, ngược lại trả null. */
const verifySessionToken = (token) => {
    if (typeof token !== 'string' || !token.includes('.')) return null;

    const [payloadPart, signaturePart] = token.split('.');
    if (!payloadPart || !signaturePart) return null;

    const expected = fromBase64url(sign(payloadPart));
    const actual = fromBase64url(signaturePart);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
        return null;
    }

    try {
        const payload = JSON.parse(fromBase64url(payloadPart).toString());
        if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
};

module.exports = {
    SESSION_TTL_SECONDS,
    getAuthSecret,
    hashPassword,
    verifyPassword,
    createSessionToken,
    verifySessionToken,
};
