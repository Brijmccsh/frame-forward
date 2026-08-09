"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Supabase client for client components. Safe to call repeatedly —
 * `createBrowserClient` returns the same underlying instance per browser
 * context, so auth state stays in sync across components.
 */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
