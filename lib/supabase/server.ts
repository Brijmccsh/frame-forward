import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Supabase client for server components, server actions and route handlers.
 * Uses the anon key — RLS in the database is the authority on what a user
 * can read or write.
 *
 * Cookie writes throw when called from a server component render; that is
 * expected and safe to swallow because middleware refreshes the session on
 * every request.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a server component — middleware handles the refresh.
        }
      },
    },
  });
}
