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

const LEVEL_THRESHOLDS = [0, 100, 200, 350];

function calculateLevel(xpTotal) {
  if (xpTotal >= LEVEL_THRESHOLDS[3]) return 4;
  if (xpTotal >= LEVEL_THRESHOLDS[2]) return 3;
  if (xpTotal >= LEVEL_THRESHOLDS[1]) return 2;
  return 1;
}

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

  for (const a of data.assignments) {
    await pool.query(
      `
      INSERT INTO assignments
      (id, user_id, source, canvas_assignment_id, course_name, title, due_at, is_completed, completed_at, points_possible, xp_value)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        course_name = EXCLUDED.course_name,
        due_at = EXCLUDED.due_at,
        is_completed = EXCLUDED.is_completed,
        completed_at = EXCLUDED.completed_at,
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
        a.is_completed ? new Date().toISOString() : null,
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