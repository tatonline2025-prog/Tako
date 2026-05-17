import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "tako_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type AdminRole = "admin" | "manager";

type AdminIdentity = {
  username: string;
  role: AdminRole;
};

type AdminCredential = {
  username: string;
  password: string;
  role: AdminRole;
};

function getAdminCredentials() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "tako-admin-session-secret-default";
  const users: AdminCredential[] = [];

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";

  users.push({
    username: adminUsername,
    password: adminPassword,
    role: "admin",
  });

  if (process.env.MANAGER_USERNAME && process.env.MANAGER_PASSWORD) {
    users.push({
      username: process.env.MANAGER_USERNAME,
      password: process.env.MANAGER_PASSWORD,
      role: "manager",
    });
  }

  return { sessionSecret, users };
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
  const hasUsername = Boolean(process.env.ADMIN_USERNAME || "admin");
  const hasPassword = Boolean(process.env.ADMIN_PASSWORD || "admin");
  const hasSecret = Boolean(process.env.ADMIN_SESSION_SECRET);
  return hasUsername && hasPassword && hasSecret;
}

export function getAdminConfigurationStatus() {
  const missing: string[] = [];

  if (!process.env.ADMIN_USERNAME) {
    missing.push("ADMIN_USERNAME");
  }

  if (!process.env.ADMIN_PASSWORD) {
    missing.push("ADMIN_PASSWORD");
  }

  if (!process.env.ADMIN_SESSION_SECRET) {
    missing.push("ADMIN_SESSION_SECRET");
  }

  if ((process.env.MANAGER_USERNAME && !process.env.MANAGER_PASSWORD) || (!process.env.MANAGER_USERNAME && process.env.MANAGER_PASSWORD)) {
    missing.push("MANAGER_USERNAME|MANAGER_PASSWORD");
  }

  return {
    configured: missing.length === 0,
    missing,
  };
}

export function verifyAdminCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();

  if (!credentials) {
    return null;
  }

  const account = credentials.users.find((candidate) =>
    safeEqual(username, candidate.username),
  );

  if (!account) {
    return null;
  }

  if (!safeEqual(password, account.password)) {
    return null;
  }

  return {
    role: account.role,
    username: account.username,
  } as AdminIdentity;
}

export function createAdminSessionToken(identity: AdminIdentity) {
  const credentials = getAdminCredentials();

  if (!credentials) {
    throw new Error("Admin credentials are not configured.");
  }

  const issuedAt = Date.now().toString();
  const payload = `${identity.username}:${identity.role}:${issuedAt}`;
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
    const segments = decoded.split(":");
    let username = "";
    let role: AdminRole = "admin";
    let issuedAt = "";
    let signature = "";

    // Backward compatibility: old token format was username:issuedAt:signature.
    if (segments.length === 3) {
      [username, issuedAt, signature] = segments;
    } else if (segments.length === 4) {
      [username, role, issuedAt, signature] = segments as [
        string,
        AdminRole,
        string,
        string,
      ];
    }

    if (!username || !issuedAt || !signature || (role !== "admin" && role !== "manager")) {
      return null;
    }

    const payload = segments.length === 3
      ? `${username}:${issuedAt}`
      : `${username}:${role}:${issuedAt}`;
    const expectedSignature = signPayload(payload, credentials.sessionSecret);

    if (!safeEqual(signature, expectedSignature)) {
      return null;
    }

    const age = Date.now() - Number(issuedAt);

    if (Number.isNaN(age) || age > ADMIN_SESSION_MAX_AGE * 1000) {
      return null;
    }

    return {
      role,
      username,
    };
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

export async function hasAdminRole(roles: AdminRole[]) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return false;
  }

  return roles.includes(admin.role);
}

export function getAdminSessionCookieOptions(maxAge: number = 60 * 60 * 12) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function normalizeRedirectPath(
  redirectTo: string | undefined,
  fallback = "/quan-tri",
) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}