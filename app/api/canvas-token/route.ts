import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/src/lib/auth";
import { storeCanvasToken } from "@/src/lib/canvasTokens";

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const body = await request.json();
    const token = String(body?.token ?? "").trim();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await storeCanvasToken(user.id, token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("POST /api/canvas-token error:", error);
    return NextResponse.json({ error: "Failed to save Canvas token" }, { status: 500 });
  }
}
