import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Nonprofit, Photographer, Role, SessionProfile } from "@/lib/types";

/** Where each role lands after signing in. */
export const HOME_PATH: Record<Role, string> = {
  photographer: "/app",
  nonprofit: "/browse",
};

export const ONBOARDING_PATH = "/onboarding";
export const LOGIN_PATH = "/login";

/**
 * The signed-in user, or null. Cached per request so multiple callers in one
 * render don't each hit the auth server.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
});

/**
 * Looks a user up in both profile tables with an explicit client.
 * Exported so a server action can reuse the client that just authenticated,
 * rather than relying on cookie read-after-write.
 */
export async function findProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<SessionProfile | null> {
  const [photographer, nonprofit] = await Promise.all([
    supabase
      .from("photographers")
      .select("*")
      .eq("id", userId)
      .maybeSingle<Photographer>(),
    supabase
      .from("nonprofits")
      .select("*")
      .eq("id", userId)
      .maybeSingle<Nonprofit>(),
  ]);

  if (photographer.data) {
    return { role: "photographer", profile: photographer.data };
  }
  if (nonprofit.data) {
    return { role: "nonprofit", profile: nonprofit.data };
  }
  return null;
}

/** Path a user with this profile state should land on. */
export function homePathFor(session: SessionProfile | null): string {
  return session ? HOME_PATH[session.role] : ONBOARDING_PATH;
}

/**
 * The signed-in user's role + profile, or null when they still need
 * onboarding. Cached per request.
 */
export const getSessionProfile = cache(
  async (): Promise<SessionProfile | null> => {
    const user = await getUser();
    if (!user) return null;
    return findProfile(createClient(), user.id);
  },
);

/** Path this user should land on right now. */
export async function resolveHomePath(): Promise<string> {
  const user = await getUser();
  if (!user) return LOGIN_PATH;
  return homePathFor(await getSessionProfile());
}

/** Use in server components that require a signed-in user. */
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

/** Use in server components that require a completed profile. */
export async function requireProfile(): Promise<SessionProfile> {
  await requireUser();
  const session = await getSessionProfile();
  if (!session) redirect(ONBOARDING_PATH);
  return session;
}

/** Require a specific role; sends the wrong role to their own home. */
export async function requireRole<R extends Role>(
  role: R,
): Promise<Extract<SessionProfile, { role: R }>> {
  const session = await requireProfile();
  if (session.role !== role) redirect(HOME_PATH[session.role]);
  return session as Extract<SessionProfile, { role: R }>;
}
