"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProfileStatus, Role } from "@/lib/types";

export type ReviewResult = { ok: true } | { ok: false; error: string };

const ROLE_TABLE: Record<Role, string> = {
  photographer: "photographers",
  nonprofit: "nonprofits",
};

const isRole = (value: unknown): value is Role =>
  value === "photographer" || value === "nonprofit";

const isStatus = (value: unknown): value is ProfileStatus =>
  value === "pending" || value === "approved" || value === "denied";

/**
 * Approve, deny or re-open an application.
 *
 * This is the only code path that writes `status`. Authorisation is by the
 * signed-in user's email — `getUser()` validates the session against Supabase,
 * so it cannot be spoofed from the client.
 */
export async function reviewApplication(
  role: Role,
  profileId: string,
  status: ProfileStatus,
): Promise<ReviewResult> {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    return { ok: false, error: "You're not allowed to review applications." };
  }

  if (!isRole(role) || !isStatus(status)) {
    return { ok: false, error: "That review isn't valid." };
  }
  if (!/^[0-9a-f-]{36}$/i.test(profileId)) {
    return { ok: false, error: "That profile isn't valid." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(ROLE_TABLE[role])
    .update({ status })
    .eq("id", profileId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, error: `Could not save that review: ${error.message}` };
  }
  if (!data) {
    return { ok: false, error: "That profile no longer exists." };
  }

  revalidatePath("/admin/applications");
  // The applicant's own gate reads status live, so their next request picks it
  // up; these clear any cached render of pages that list them.
  revalidatePath("/browse");
  revalidatePath(`/u/${profileId}`);
  return { ok: true };
}
