import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Cookie-free anon client for the crawlable pages.
 *
 * The public_* views are readable by the `anon` role, so these pages need no
 * session at all — and staying off `cookies()` is what lets them be statically
 * generated and revalidated rather than rendered per request.
 */
export function createPublicClient() {
  return createSupabaseClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
