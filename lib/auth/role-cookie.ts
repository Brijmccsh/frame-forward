import type { Role } from "@/lib/types";

/**
 * Caches the signed-in user's role so middleware can route wrong-role
 * requests with a real redirect, instead of letting the page render and
 * bounce afterwards.
 *
 * This is a routing hint, never a security boundary — RLS in the database
 * and `requireRole` in layouts remain the authority. A user's role never
 * changes after onboarding, so the value cannot go stale.
 *
 * Note: only ever holds a real role. Users who haven't onboarded get no
 * cookie at all, so middleware re-checks them until a profile exists —
 * that avoids a stale "no profile" value bouncing them forever.
 */
export const ROLE_COOKIE = "ff-role";

export const isRole = (value: unknown): value is Role =>
  value === "photographer" || value === "nonprofit";

export const roleCookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365,
} as const;
