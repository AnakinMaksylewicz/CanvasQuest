//this file seeds the database with mock assignment data for testing purposes.
//When we get the authentication and session management working, we either remove this
//or keep it only for demo mode
require("dotenv").config();
const {Pool} = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const filePath = path.join(__dirname, "..", "mock", "mock-assignments.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const userEmail = "demo@canvasquest.local";
  const passwordHash = "demo_hash_not_real";

  const userResult = await pool.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id
    `,
    [userEmail, passwordHash]
  );

  const userId = userResult.rows[0].id;

  await pool.query(
    `
    INSERT INTO user_progress (user_id, xp_total, level, streak_count)
    VALUES ($1, 0, 1, 0)
    ON CONFLICT (user_id) DO NOTHING
    `,
    [userId]
  );

  for (const a of data.assignments) {
    await pool.query(
      `
      INSERT INTO assignments
      (id, user_id, source, canvas_assignment_id, course_name, title, due_at, is_completed, points_possible, xp_value)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        course_name = EXCLUDED.course_name,
        due_at = EXCLUDED.due_at,
        is_completed = EXCLUDED.is_completed,
        points_possible = EXCLUDED.points_possible,
        xp_value = EXCLUDED.xp_value
      `,
      [
        a.id,
        userId,
        a.source,
        a.canvas_assignment_id,
        a.course_name,
        a.title,
        a.due_at,
        a.is_completed,
        a.points_possible,
        a.xp_value,
      ]
    );
  }

  console.log("Seed complete.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});