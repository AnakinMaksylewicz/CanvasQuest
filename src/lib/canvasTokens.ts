import { pool } from "@/src/lib/db";
import { decryptToken, encryptToken } from "@/src/lib/crypto";

export async function storeCanvasToken(
  userId: number,
  plaintextToken: string
): Promise<void> {
  const encryptedToken = encryptToken(plaintextToken);

  await pool.query(
    `
    INSERT INTO canvas_tokens (user_id, encrypted_token, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET encrypted_token = EXCLUDED.encrypted_token, updated_at = NOW()
    `, [userId, encryptedToken]
  );
}

export async function getEncryptedCanvasToken(userId: number): Promise<string | null> {
  const result = await pool.query( "SELECT encrypted_token FROM canvas_tokens WHERE user_id = $1 LIMIT 1", [userId]);

  return result.rows[0]?.encrypted_token ?? null;
}

export async function getDecryptedCanvasToken(userId: number): Promise<string | null> {
  const encryptedToken = await getEncryptedCanvasToken(userId);
  if (!encryptedToken) { return null; }
  return decryptToken(encryptedToken);
}
