import {NextResponse} from "next/server";
import {pool} from "@/src/lib/db";
import {getDemoUserId} from "@/src/lib/demoUser";
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

        //This query counts all assignments in the week as "total" and all completed assignments as "completed", then returns
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

        return NextResponse.json({
            assignments: assignmentsResult.rows,
            progress: progressResult.rows[0]
        });
    }
    catch(error){
        console.error("GET /api/assignments/week error: ", error);
        return NextResponse.json({ error: "Failed to load weekly assignments" }, { status: 500 });
    }
}