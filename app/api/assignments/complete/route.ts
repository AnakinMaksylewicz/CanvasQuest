import {NextRequest, NextResponse} from "next/server";
import {pool} from "@/src/lib/db";

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();
        const {id} = body;

        if(!id) {
            return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
        }

        const result = await pool.query(
            `
            UPDATE assignments
            SET
            is_completed = NOT is_completed,
            completed_at = CASE
                WHEN is_completed = false THEN NOW()
                ELSE NULL
            END
            WHERE id = $1
            RETURNING id, is_completed, completed_at
            `,
            [id]
        );

        if (result.rows.length == 0) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Assignment updated", assignment: result.rows[0] });
    }
    catch (error) {
        console.error("POST /api/assignments/complete error: ", error);
        return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
    }
}