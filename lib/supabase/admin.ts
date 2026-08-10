import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Service-role client. Bypasses RLS, so it must never be imported by anything
 * a client component can reach — the `server-only` import above enforces that
 * at build time.
 *
 * Used in exactly one place: writing `status` when the founder approves or
 * denies an application. The database's `freeze_status` trigger only exempts
 * `service_role`, which is why this exists at all; every other write in the app
 * goes through the user's own session under RLS.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY — required to review applications.",
    );
  }

  return createSupabaseClient(env.supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
