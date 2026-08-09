import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Refreshes the Supabase auth session on every matched request and returns
 * both the (possibly cookie-updated) response and the current user, so callers
 * can make routing decisions without a second round trip.
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

  return { response, user };
}
