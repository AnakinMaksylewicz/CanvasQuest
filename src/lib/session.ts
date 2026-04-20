import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "canvasquest_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.trim() === "" || secret === "change_me") { throw new Error("SESSION_SECRET is not configured"); }
  return secret;
}

function signPayload(payload: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

export function createSessionToken(userId: number): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}.${expiresAt}`;
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 3) { return null; }

  const [userIdString, expiresAtString, signature] = parts;
  const payload = `${userIdString}.${expiresAtString}`;
  const expectedSignature = signPayload(payload);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) { return null; }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) { return null; }

  const userId = Number.parseInt(userIdString, 10);
  const expiresAt = Number.parseInt(expiresAtString, 10);

  if (!Number.isInteger(userId) || !Number.isInteger(expiresAt)) { return null; }

  if (Date.now() > expiresAt) { return null; }
  return userId;
}

export async function setLoginSession(userId: number): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken(userId);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearLoginSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function readSessionUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) { return null; }
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
