import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Role } from "@/lib/types";

/**
 * Refreshes the Supabase auth session on every matched request and returns
 * the (possibly cookie-updated) response, the current user, and a client the
 * caller can reuse.
 *
 * Important: always return the `response` object produced here — it carries
 * the refreshed auth cookies.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not remove: this call is what refreshes an expired session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    user,
    supabase,
    /** The live response — read it after any cookie writes. */
    get response() {
      return response;
    },
    /** Copy refreshed auth cookies onto a redirect response. */
    applyCookies(target: NextResponse) {
      response.cookies.getAll().forEach((cookie) => {
        const { name, value, ...options } = cookie;
        target.cookies.set(name, value, options as CookieOptions);
      });
      return target;
    },
  };
}

/** One-off role lookup, used only when the role cookie is missing. */
export async function lookupRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<Role | null> {
  const [photographer, nonprofit] = await Promise.all([
    supabase.from("photographers").select("id").eq("id", userId).maybeSingle(),
    supabase.from("nonprofits").select("id").eq("id", userId).maybeSingle(),
  ]);

  if (photographer.data) return "photographer";
  if (nonprofit.data) return "nonprofit";
  return null;
}
