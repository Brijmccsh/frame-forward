"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH, findProfile, homePathFor } from "@/lib/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function friendlyAuthError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("rate limit") || text.includes("only request this after")) {
    return "Too many attempts. Wait a minute, then try again.";
  }
  if (text.includes("expired")) {
    return "That code expired. Send yourself a fresh one.";
  }
  if (text.includes("invalid") || text.includes("token")) {
    return "That code doesn't look right. Double-check and try again.";
  }
  if (text.includes("signups not allowed")) {
    return "New sign-ups are currently disabled for this email.";
  }
  return message;
}

/** Step 1 — email the user a 6-digit code. */
export async function requestLoginCode(
  emailInput: string,
): Promise<ActionResult> {
  const email = emailInput.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  return { ok: true };
}

/**
 * Step 2 — verify the code. On success this sets the auth cookies and
 * redirects to the user's home (or onboarding if they have no profile yet).
 */
export async function verifyLoginCode(
  emailInput: string,
  tokenInput: string,
  next?: string,
): Promise<ActionResult> {
  const email = emailInput.trim().toLowerCase();
  const token = tokenInput.replace(/\D/g, "");

  if (token.length !== 6) {
    return { ok: false, error: "Enter the 6-digit code from your email." };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  if (!data.user) {
    return { ok: false, error: "Could not sign you in. Try again." };
  }

  // Reuse the client that just authenticated so the lookup runs as this user.
  const session = await findProfile(supabase, data.user.id);
  const home = homePathFor(session);

  // Honour ?next= only for in-app paths, and never over onboarding.
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") && session
      ? next
      : null;

  revalidatePath("/", "layout");
  redirect(safeNext ?? home);
}

export async function signOut(): Promise<never> {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(LOGIN_PATH);
}
