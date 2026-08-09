/**
 * Public environment values, validated once at import time so a missing key
 * fails loudly at boot instead of as a confusing runtime error later.
 *
 * SUPABASE_SERVICE_ROLE_KEY is intentionally NOT read here — it is server-only
 * and must never end up in a module that a client component can import.
 */

function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to .env / your Vercel project settings.`,
    );
  }
  return value;
}

export const env = {
  supabaseUrl: required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  supabaseAnonKey: required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
} as const;
