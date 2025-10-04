import CryptoJS from 'crypto-js';

// Generate a random encryption key (in production, this should be derived from user's master password)
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(256/8).toString();
}

// Encrypt text using AES
export function encrypt(text: string, key: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

// Decrypt text using AES
export function decrypt(encryptedText: string, key: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Generate a key from user's password (for production use)
export function deriveKeyFromPassword(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
}

// Generate a random salt
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128/8).toString();
}
