import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Routes that require a signed-in user. */
const PROTECTED_PREFIXES = [
  "/app",
  "/browse",
  "/profile",
  "/requests",
  "/onboarding",
  // Profile pages read tables whose RLS requires a signed-in user, so a
  // signed-out visitor would only ever see an empty page.
  "/u",
];

const LOGIN_PATH = "/login";
/** Server route that resolves the right home for the signed-in user. */
const HOME_RESOLVER_PATH = "/home";

const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  if (!user && isProtected(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    // Remember where they were headed so we can finish the trip after login.
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (user && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = HOME_RESOLVER_PATH;
    url.search = search;
    return NextResponse.redirect(url);
  }

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
