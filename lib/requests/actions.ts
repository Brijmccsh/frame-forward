"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile, requireRole } from "@/lib/auth";
import { findRequest } from "@/lib/queries/requests";
import { isUseType } from "./use-types";

export interface PhotographerContact {
  name: string | null;
  email: string | null;
  photoTitle: string | null;
}

export type RequestActionResult =
  | { ok: true; contact: PhotographerContact; alreadyRequested: boolean }
  | { ok: false; error: string };

export type SimpleResult = { ok: true } | { ok: false; error: string };

function friendly(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("duplicate key")) {
    return "You've already requested this photo — check My requests.";
  }
  if (text.includes("row-level security")) {
    return "You don't have permission to do that.";
  }
  return message;
}

/**
 * Nonprofit asks to use a photo. Creates the request (or reuses an existing
 * one) and hands back the photographer's contact details to reveal.
 */
export async function requestPhoto(
  photoId: string,
): Promise<RequestActionResult> {
  const { profile } = await requireRole("nonprofit");
  const supabase = createClient();

  const { data: photo, error: photoError } = await supabase
    .from("photos")
    .select("id, title, photographer:photographers(name, email)")
    .eq("id", photoId)
    .maybeSingle<{
      id: string;
      title: string | null;
      photographer: { name: string | null; email: string | null } | null;
    }>();

  if (photoError || !photo) {
    return { ok: false, error: "That photo is no longer available." };
  }

  const contact: PhotographerContact = {
    name: photo.photographer?.name ?? null,
    email: photo.photographer?.email ?? null,
    photoTitle: photo.title,
  };

  // unique(photo_id, nonprofit_id) — a repeat request is not an error.
  const existing = await findRequest(photoId, profile.id);
  if (existing) {
    return { ok: true, contact, alreadyRequested: true };
  }

  const { error } = await supabase.from("usage_requests").insert({
    photo_id: photoId,
    nonprofit_id: profile.id,
    status: "requested",
  });

  if (error) return { ok: false, error: friendly(error.message) };

  revalidatePath("/requests");
  revalidatePath("/app/requests");
  return { ok: true, contact, alreadyRequested: false };
}

/**
 * Nonprofit confirms a photo was used. The DB trigger credits
 * `hours_awarded` from `settings` when the status flips to 'used'.
 */
export async function confirmUsage(
  requestId: string,
  useType: string,
): Promise<SimpleResult> {
  await requireRole("nonprofit");

  if (!isUseType(useType)) {
    return { ok: false, error: "Pick how you used the photo." };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("usage_requests")
    .update({
      status: "used",
      use_type: useType,
      used_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { ok: false, error: friendly(error.message) };

  revalidatePath("/requests");
  revalidatePath("/app/requests");
  return { ok: true };
}

/** Heart / un-heart a photo. Returns the new state. */
export async function toggleSavePhoto(
  photoId: string,
): Promise<{ ok: true; saved: boolean } | { ok: false; error: string }> {
  const session = await requireProfile();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("photo_saves")
    .select("photo_id")
    .eq("user_id", session.profile.id)
    .eq("photo_id", photoId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("photo_saves")
      .delete()
      .eq("user_id", session.profile.id)
      .eq("photo_id", photoId);
    if (error) return { ok: false, error: friendly(error.message) };
    revalidatePath("/requests");
    return { ok: true, saved: false };
  }

  const { error } = await supabase
    .from("photo_saves")
    .insert({ user_id: session.profile.id, photo_id: photoId });

  if (error) return { ok: false, error: friendly(error.message) };
  revalidatePath("/requests");
  return { ok: true, saved: true };
}
