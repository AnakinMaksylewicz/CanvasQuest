import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";
import { buildGamificationState } from "@/src/lib/gamification";
import { requireCurrentUser } from "@/src/lib/auth";

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

async function getWeeklyProgress(userId: number, monday: Date, sunday: Date) {
  const progressResult = await pool.query(
    `
    SELECT COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE is_completed = true)::int AS completed
    FROM assignments
    WHERE user_id = $1 AND due_at >= $2 AND due_at <= $3
    `,
    [userId, monday.toISOString(), sunday.toISOString()]
  );

  return progressResult.rows[0];
}

async function getUserGamificationState(userId: number) {
  const progressResult = await pool.query(
    `
    SELECT xp_total, level
    FROM user_progress
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  if (progressResult.rows.length === 0) {
    return buildGamificationState(0);
  }

  return buildGamificationState(progressResult.rows[0].xp_total);
}

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const { monday, sunday } = getWeekBounds();

    const assignmentsResult = await pool.query(
      `
      SELECT id, title, course_name, due_at, is_completed, source,
             canvas_assignment_id, points_possible, xp_value
      FROM assignments
      WHERE user_id = $1 AND due_at >= $2 AND due_at <= $3
      ORDER BY due_at ASC
      `,
      [user.id, monday.toISOString(), sunday.toISOString()]
    );

    const progress = await getWeeklyProgress(user.id, monday, sunday);
    const gamification = await getUserGamificationState(user.id);

    return NextResponse.json({
      assignments: assignmentsResult.rows,
      progress,
      gamification,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("GET /api/assignments/week error:", error);
    return NextResponse.json(
      { error: "Failed to load weekly assignments" },
      { status: 500 }
    );
  }
}
