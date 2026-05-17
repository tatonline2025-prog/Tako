import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "tako_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

type AdminIdentity = {
  username: string;
};

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "tako-admin-session-secret-default";

  return { username, password, sessionSecret };
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(payload: string, sessionSecret: string) {
  return createHmac("sha256", sessionSecret).update(payload).digest("hex");
}

export function isAdminConfigured() {
  return true;
}

export function getAdminConfigurationStatus() {
  return {
    configured: true,
    missing: [] as string[],
  };
}

export function verifyAdminCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();

  if (!credentials) {
    return false;
  }

  return (
    safeEqual(username, credentials.username) &&
    safeEqual(password, credentials.password)
  );
}

export function createAdminSessionToken(username: string) {
  const credentials = getAdminCredentials();

  if (!credentials) {
    throw new Error("Admin credentials are not configured.");
  }

  const issuedAt = Date.now().toString();
  const payload = `${username}:${issuedAt}`;
  const signature = signPayload(payload, credentials.sessionSecret);

  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function verifyAdminSessionToken(token?: string): AdminIdentity | null {
  if (!token) {
    return null;
  }

  const credentials = getAdminCredentials();

  if (!credentials) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [username, issuedAt, signature] = decoded.split(":");

    if (!username || !issuedAt || !signature) {
      return null;
    }

    const payload = `${username}:${issuedAt}`;
    const expectedSignature = signPayload(payload, credentials.sessionSecret);

    if (!safeEqual(signature, expectedSignature)) {
      return null;
    }

    const age = Date.now() - Number(issuedAt);

    if (Number.isNaN(age) || age > ADMIN_SESSION_MAX_AGE * 1000) {
      return null;
    }

    if (!safeEqual(username, credentials.username)) {
      return null;
    }

    return { username };
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAuthenticatedAdmin());
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function normalizeRedirectPath(
  redirectTo: string | undefined,
  fallback = "/quan-tri/lien-he",
) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}