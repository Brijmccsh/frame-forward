import { NextResponse, type NextRequest } from "next/server";
import { lookupRole, updateSession } from "@/lib/supabase/middleware";
import { ROLE_COOKIE, isRole, roleCookieOptions } from "@/lib/auth/role-cookie";
import { isAdminEmail } from "@/lib/auth/admin";
import type { Role } from "@/lib/types";

const LOGIN_PATH = "/login";
const ONBOARDING_PATH = "/onboarding";
const PENDING_PATH = "/pending";
const ADMIN_PATH = "/admin/applications";
/** Server route that resolves the right home for the signed-in user. */
const HOME_RESOLVER_PATH = "/home";

/** Routes that require a signed-in user. */
const PROTECTED_PREFIXES = [
  "/app",
  "/browse",
  "/profile",
  "/requests",
  ONBOARDING_PATH,
  PENDING_PATH,
  "/admin",
  // Profile pages read tables whose RLS requires a signed-in user, so a
  // signed-out visitor would only ever see an empty page.
  "/u",
];

/** Sections that belong to exactly one role. */
const ROLE_ONLY: Array<{ prefix: string; role: Role; fallback: string }> = [
  { prefix: "/app", role: "photographer", fallback: "/browse" },
  { prefix: "/requests", role: "nonprofit", fallback: "/app/requests" },
];

const matches = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some((prefix) => matches(pathname, prefix));

/**
 * Handles signed-out redirects, admin access and wrong-role routing.
 *
 * Deliberately does NOT check application status: status changes when the
 * founder approves someone, so caching it in a cookie would lock an approved
 * user out until they cleared it, and querying it here would cost a round trip
 * on every request. `requireProfile()` in the (app) layout owns that check —
 * it already loads the profile row and still redirects with a real 307.
 */
export async function middleware(request: NextRequest) {
  const session = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  const redirectTo = (path: string, keepSearch = false) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = keepSearch ? search : "";
    return session.applyCookies(NextResponse.redirect(url));
  };

  // Signed out: bounce protected routes to login, remembering the target.
  if (!session.user) {
    if (!isProtected(pathname)) return session.response;
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return session.applyCookies(NextResponse.redirect(url));
  }

  // Signed in on the login page or the marketing page — skip straight to
  // wherever they belong. /home resolves role, application status and admin in
  // one place, so this stays correct for pending and denied users too.
  if (pathname === LOGIN_PATH) return redirectTo(HOME_RESOLVER_PATH, true);
  if (pathname === "/") return redirectTo(HOME_RESOLVER_PATH);

  const admin = isAdminEmail(session.user.email);

  // The review queue is admin-only.
  if (matches(pathname, "/admin")) {
    return admin ? session.response : redirectTo(HOME_RESOLVER_PATH);
  }

  if (!isProtected(pathname)) return session.response;

  // Role comes from a cookie so the common case costs no queries. Users who
  // haven't onboarded have no cookie, so they're re-checked each time.
  const cached = request.cookies.get(ROLE_COOKIE)?.value;
  let role: Role | null = isRole(cached) ? cached : null;
  let shouldSetCookie = false;

  if (!role) {
    role = await lookupRole(session.supabase, session.user.id);
    shouldSetCookie = role !== null;
  }

  // An admin with no profile of their own belongs in the queue, not onboarding —
  // except on /u/[id], which they need to vet an applicant from the queue.
  if (!role) {
    if (admin) {
      const allowed = pathname === ADMIN_PATH || matches(pathname, "/u");
      return allowed ? session.response : redirectTo(ADMIN_PATH);
    }
    return pathname === ONBOARDING_PATH
      ? session.response
      : redirectTo(ONBOARDING_PATH);
  }

  // Already onboarded; nothing to do on the onboarding page. Where they go
  // next depends on their status, so let the resolver decide.
  if (pathname === ONBOARDING_PATH) {
    const target = redirectTo(HOME_RESOLVER_PATH);
    target.cookies.set(ROLE_COOKIE, role, roleCookieOptions);
    return target;
  }

  // /pending is reachable by anyone with a profile — the page itself sends
  // approved users onward, since only it knows the current status.
  if (pathname === PENDING_PATH) {
    const response = session.response;
    if (shouldSetCookie) {
      response.cookies.set(ROLE_COOKIE, role, roleCookieOptions);
    }
    return response;
  }

  const wrongSection = ROLE_ONLY.find(
    (section) => matches(pathname, section.prefix) && section.role !== role,
  );
  if (wrongSection) {
    const target = redirectTo(wrongSection.fallback);
    if (shouldSetCookie) target.cookies.set(ROLE_COOKIE, role, roleCookieOptions);
    return target;
  }

  const response = session.response;
  if (shouldSetCookie) response.cookies.set(ROLE_COOKIE, role, roleCookieOptions);
  return response;
}

export const config = {
  matcher: [
    /*
     * Every path except static assets and image files:
     * - _next/static, _next/image, favicon.ico
     * - common image/font extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
