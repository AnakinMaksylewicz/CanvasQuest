import {NextRequest, NextResponse} from "next/server";
import {pool} from "@/src/lib/db";
import {getDemoUserId} from "@/src/lib/demoUser";
import { buildGamificationState, calculateLevel } from "@/src/lib/gamification";

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
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE is_completed = true)::int AS completed
    FROM assignments
    WHERE user_id = $1
      AND due_at >= $2
      AND due_at <= $3
    `,
    [userId, monday.toISOString(), sunday.toISOString()]
  );

  return progressResult.rows[0];
}

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();
        const {id} = body;

        if(!id) {
            return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
        }

        const userId = await getDemoUserId();
        
        if (userId === null) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const assignmentResult = await pool.query(
            `
            SELECT id, is_completed, xp_value
            FROM assignments
            WHERE id = $1 AND user_id = $2
            LIMIT 1
            `,
            [id, userId]
        );

        if (assignmentResult.rows.length == 0) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const assignmentBeforeUpdate = assignmentResult.rows[0];
        const wasCompleted = assignmentBeforeUpdate.is_completed;
        const xpValue = assignmentBeforeUpdate.xp_value;
        const xpChange = wasCompleted ? -xpValue : xpValue; // If already completed, un-completing should remove XP

        const updateAssignmentResult = await pool.query(
            `
            UPDATE assignments
                SET is_completed = NOT is_completed,
                completed_at = CASE WHEN is_completed = false THEN NOW() ELSE NULL 
                END
            WHERE id = $1 AND user_id = $2
            RETURNING id, is_completed, completed_at, xp_value
            `,
            [id, userId]
        );

        const currentProgressResult = await pool.query(
            `
            SELECT xp_total
            FROM user_progress
            WHERE user_id = $1
            LIMIT 1
            `,
            [userId]
        );

        const currentXpTotal = currentProgressResult.rows[0]?.xp_total ?? 0;
        const newXpTotal = Math.max(0, currentXpTotal + xpChange);
        const newLevel = calculateLevel(newXpTotal);

        await pool.query(
            `
            INSERT INTO user_progress (user_id, xp_total, level, streak_count, last_active_date)
            VALUES ($1, $2, $3, 0, CURRENT_DATE)
            ON CONFLICT (user_id) DO UPDATE SET
                xp_total = EXCLUDED.xp_total,
                level = EXCLUDED.level,
                last_active_date = CURRENT_DATE
            `,
            [userId, newXpTotal, newLevel]
        );

        const {monday, sunday} = getWeekBounds();
        const weeklyProgress = await getWeeklyProgress(userId, monday, sunday);
        const gamification = buildGamificationState(newXpTotal);

        return NextResponse.json({ 
            message: "Assignment updated", 
            assignment: updateAssignmentResult.rows[0], 
            progress: weeklyProgress,
            gamification: gamification
        });
    }
    catch (error) {
        console.error("POST /api/assignments/complete error: ", error);
        return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
    }
}