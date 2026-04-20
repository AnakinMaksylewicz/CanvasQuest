import { NextResponse } from "next/server";
import { clearLoginSession } from "@/src/lib/session";

export async function POST() {
  try {
    await clearLoginSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
