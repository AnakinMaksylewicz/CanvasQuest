import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/src/lib/db";
import { verifyPassword } from "@/src/lib/passwords";
import { setLoginSession } from "@/src/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const userResult = await pool.query(
      "SELECT id, email, password_hash, created_at FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = userResult.rows[0];
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await setLoginSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 });
  }
}
