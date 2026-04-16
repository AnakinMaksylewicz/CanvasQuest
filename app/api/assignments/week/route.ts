import {NextResponse} from "next/server";
import {pool} from "@/src/lib/db";
import {getDemoUserId} from "@/src/lib/demoUser";
import { buildGamificationState } from "@/src/lib/gamification";
//ONCE WE IMPLEMENT AUTH, we will need to get current user


function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day == 0 ? -6 : 1 - day;

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
    try{
        
        //When auth is implemented, we replace this with whatever function gets the current user's ID, but for now we just get the demo user ID
        const userId = await getDemoUserId();

        if (userId === null) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { monday, sunday } = getWeekBounds();

        //This query selects all assignments for the user that are due within the current week, earliest due date to latest
        const assignmentsResult = await pool.query(
            `
            SELECT
            id,
            title,
            course_name,
            due_at,
            is_completed,
            source,
            canvas_assignment_id,
            points_possible,
            xp_value
            FROM assignments
            WHERE user_id = $1
            AND due_at >= $2
            AND due_at <= $3
            ORDER BY due_at ASC
            `,
            [userId, monday.toISOString(), sunday.toISOString()]
        );

        const progress = await getWeeklyProgress(userId, monday, sunday);
        const gamification = await getUserGamificationState(userId);
        return NextResponse.json({
            assignments: assignmentsResult.rows,
            progress: progress,
            gamification: gamification
        });
    }
    catch(error){
        console.error("GET /api/assignments/week error: ", error);
        return NextResponse.json({ error: "Failed to load weekly assignments" }, { status: 500 });
    }
}