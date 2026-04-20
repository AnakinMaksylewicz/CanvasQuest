import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/src/lib/db";
import { hashPassword } from "@/src/lib/passwords";
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

    const existingUserResult = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const createdUserResult = await pool.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at
      `,
      [email, passwordHash]
    );

    const createdUser = createdUserResult.rows[0];
    await setLoginSession(createdUser.id);

    return NextResponse.json(
      {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          created_at: createdUser.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
