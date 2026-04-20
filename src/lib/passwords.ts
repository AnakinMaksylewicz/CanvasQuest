import crypto from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(crypto.scrypt);

export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length < 8) { throw new Error("Password must be at least 8 characters long"); }

  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, expectedHashHex] = storedHash.split(":");
  if (!salt || !expectedHashHex) { return false; }

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const expectedHash = Buffer.from(expectedHashHex, "hex");

  if (derivedKey.length !== expectedHash.length) { return false; }
  return crypto.timingSafeEqual(derivedKey, expectedHash);
}
