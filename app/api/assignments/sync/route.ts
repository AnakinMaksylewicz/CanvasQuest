import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/src/lib/db";
import { fetchCanvasAssignments } from "@/src/lib/canvas";
import { decryptToken } from "@/src/lib/crypto"; 
import { requireCurrentUser } from "@/src/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // get authenticated user
    const user = await requireCurrentUser();
    const userId = user.id;

    //Grab the encrypted token from the canvas_tokens table for this user
    const tokenRes = await pool.query(
      "SELECT encrypted_token FROM canvas_tokens WHERE user_id = $1",
      [userId]
    );

    if (tokenRes.rows.length === 0) {
      return NextResponse.json({ error: "No Canvas token found. Please connect first." }, { status: 400 });
    }

    const encryptedToken = tokenRes.rows[0].encrypted_token;
    const decryptedToken = decryptToken(encryptedToken);

    const rawAssignments = await fetchCanvasAssignments(decryptedToken);

    for (const a of rawAssignments) {
      // Generate a unique ID for the database
      const newId = crypto.randomUUID(); 

      await pool.query(
        `INSERT INTO assignments 
          (id, user_id, source, canvas_assignment_id, course_name, title, due_at, xp_value, is_completed)
         VALUES ($1, $2, 'canvas', $3, $4, $5, $6, $7, false)
         ON CONFLICT (user_id, canvas_assignment_id) 
         DO UPDATE SET
            title = EXCLUDED.title,
            due_at = EXCLUDED.due_at,
            xp_value = EXCLUDED.xp_value
         WHERE assignments.is_completed = false`,
        [newId, userId, a.id, a.course_name, a.title, a.due_at, a.xp_value]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Sync complete!", 
      count: rawAssignments.length
    });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}