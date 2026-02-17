import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12; // recommended for GCM

function getKey() {
    if (!process.env.ENCRYPTION_KEY) {
        throw new Error("ENCRYPTION_KEY not defined");
    }
    return Buffer.from(process.env.ENCRYPTION_KEY, "hex");
}

/**
 * Encrypt a string
 * @param {string} text - plaintext to encrypt
 * @returns {string} - base64 encoded token
 */
function encrypt(text) {
    const KEY = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGO, KEY, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    // Combine iv + tag + encrypted
    const payload = Buffer.concat([iv, tag, encrypted]);
    return payload.toString('base64');
}

/**
 * Decrypt a token
 * @param {string} token - base64 token from encrypt()
 * @returns {string} - decrypted plaintext
 */
function decrypt(token) {
    const KEY = getKey();
    const buffer = Buffer.from(token, 'base64');

    const iv = buffer.subarray(0, IV_LENGTH);
    const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + 16); // GCM tag is 16 bytes
    const encrypted = buffer.subarray(IV_LENGTH + 16);

    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}

export { encrypt, decrypt };
