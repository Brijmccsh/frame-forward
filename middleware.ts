import { NextResponse, type NextRequest } from "next/server";
import { lookupRole, updateSession } from "@/lib/supabase/middleware";
import { ROLE_COOKIE, isRole, roleCookieOptions } from "@/lib/auth/role-cookie";
import type { Role } from "@/lib/types";

const LOGIN_PATH = "/login";
const ONBOARDING_PATH = "/onboarding";
/** Server route that resolves the right home for the signed-in user. */
const HOME_RESOLVER_PATH = "/home";

const HOME_PATH: Record<Role, string> = {
  photographer: "/app",
  nonprofit: "/browse",
};

/** Routes that require a signed-in user. */
const PROTECTED_PREFIXES = [
  "/app",
  "/browse",
  "/profile",
  "/requests",
  ONBOARDING_PATH,
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

  // Signed in on the login page — send them wherever they belong.
  if (pathname === LOGIN_PATH) return redirectTo(HOME_RESOLVER_PATH, true);

  const needsRole = isProtected(pathname);
  if (!needsRole) return session.response;

  // Role comes from a cookie so the common case costs no queries. Users who
  // haven't onboarded have no cookie, so they're re-checked each time.
  const cached = request.cookies.get(ROLE_COOKIE)?.value;
  let role: Role | null = isRole(cached) ? cached : null;
  let shouldSetCookie = false;

  if (!role) {
    role = await lookupRole(session.supabase, session.user.id);
    shouldSetCookie = role !== null;
  }

  // No profile yet — onboarding is the only place they can go.
  if (!role) {
    return pathname === ONBOARDING_PATH
      ? session.response
      : redirectTo(ONBOARDING_PATH);
  }

  // Already onboarded; nothing to do on the onboarding page.
  if (pathname === ONBOARDING_PATH) {
    const target = redirectTo(HOME_PATH[role]);
    target.cookies.set(ROLE_COOKIE, role, roleCookieOptions);
    return target;
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
