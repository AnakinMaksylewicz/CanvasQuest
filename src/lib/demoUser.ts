import { pool } from "@/src/lib/db";

const DEMO_USER_EMAIL = "demo@canvasquest.local";

export async function getDemoUserId(): Promise<number | null> {
  const userResult = await pool.query(
    "SELECT id FROM users WHERE email = $1 LIMIT 1",
    [DEMO_USER_EMAIL]
  );

  if (userResult.rows.length === 0) {
    return null;
  }

  return userResult.rows[0].id;
}

export { DEMO_USER_EMAIL };
