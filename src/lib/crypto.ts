import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const secret = process.env.TOKEN_ENCRYPTION_KEY;

  if (!secret || secret.trim() === "" || secret === "change_me") {
    throw new Error("TOKEN_ENCRYPTION_KEY is not configured");
  }

  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

export function encryptToken(plaintext: string): string {
  if (typeof plaintext !== "string" || plaintext.length === 0) {
    throw new Error("Token plaintext is required");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptToken(ciphertext: string): string {
  if (typeof ciphertext !== "string" || ciphertext.length === 0) {
    throw new Error("Encrypted token is required");
  }

  const parts = ciphertext.split(":");
  if (parts.length !== 3) {
    throw new Error("Encrypted token format is invalid");
  }

  const [ivBase64, authTagBase64, encryptedBase64] = parts;

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivBase64, "base64")
  );
  decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
