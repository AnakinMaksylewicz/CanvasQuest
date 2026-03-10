/**
 * Encrypts a Canvas API token
 *
 * plaintext - raw Canvas API token given by user
 * returns an encrypted string for database storage
 *
 * Key source: process.env.TOKEN_ENCRYPTION_KEY
 *
 * Notes:
 * - Planned implementation will use AES-GCM via Node's crypto module
 * - Never log plaintext tokens
 */
export function encryptToken(plaintext: string): string {
  throw new Error("encryptToken not implemented yet");
}

/**
 * Decrypts an encrypted Canvas API token 
 *
 * ciphertext - The encrypted token string stored in the database
 * returns the original plaintext Canvas API token
 *
 * Key source: process.env.TOKEN_ENCRYPTION_KEY
 *
 * Notes:
 * - Decryption only server-side
 * - Never return decrypted tokens to client
 */
export function decryptToken(ciphertext: string): string {
  throw new Error("decryptToken not implemented yet");
}