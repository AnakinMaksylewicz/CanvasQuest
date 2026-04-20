import { pool } from "@/src/lib/db";
import { readSessionUserId } from "@/src/lib/session";

export type CurrentUser = {id: number; email: string; created_at?: string; };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const sessionUserId = await readSessionUserId();

  if (sessionUserId === null) { return null; }
  const result = await pool.query("SELECT id, email, created_at FROM users WHERE id = $1 LIMIT 1", [sessionUserId]);

  if (result.rows.length === 0) { return null; }
  return result.rows[0] as CurrentUser;
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) { throw new Error("UNAUTHORIZED"); }
  return user;
}
