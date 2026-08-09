import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Photo,
  PhotographerHours,
  UsageRequest,
  UsageRequestStatus,
} from "@/lib/types";

export { USE_TYPES, isUseType, type UseType } from "@/lib/requests/use-types";

export interface RequestPhotographer {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface RequestNonprofit {
  id: string;
  org_name: string | null;
  email: string | null;
  avatar_url: string | null;
  verified: boolean;
}

export interface RequestPhoto
  extends Pick<Photo, "id" | "title" | "image_path" | "photographer_id"> {
  photographer: RequestPhotographer | null;
}

/** A usage request joined with everything a page needs to render it. */
export interface UsageRequestDetail extends UsageRequest {
  photo: RequestPhoto | null;
  nonprofit: RequestNonprofit | null;
}

const SELECT_DETAIL = `
  *,
  photo:photos(
    id, title, image_path, photographer_id,
    photographer:photographers(id, name, email, avatar_url)
  ),
  nonprofit:nonprofits(id, org_name, email, avatar_url, verified)
` as const;

/** Supabase types embedded relations as objects but can return arrays. */
function first<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function normalise(row: unknown): UsageRequestDetail {
  const request = row as UsageRequestDetail & {
    photo: (RequestPhoto & { photographer: unknown }) | RequestPhoto[] | null;
    nonprofit: RequestNonprofit | RequestNonprofit[] | null;
  };
  const photo = first(request.photo);

  return {
    ...request,
    photo: photo
      ? { ...photo, photographer: first(photo.photographer as never) }
      : null,
    nonprofit: first(request.nonprofit),
  };
}

/** Requests this nonprofit has made, newest first. */
export async function listRequestsForNonprofit(
  nonprofitId: string,
): Promise<UsageRequestDetail[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("usage_requests")
    .select(SELECT_DETAIL)
    .eq("nonprofit_id", nonprofitId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load requests: ${error.message}`);
  return (data ?? []).map(normalise);
}

/**
 * Requests on this photographer's photos. RLS lets the photo owner read
 * these, so no extra filtering is needed beyond the join.
 */
export async function listRequestsForPhotographer(
  photographerId: string,
  status?: UsageRequestStatus,
): Promise<UsageRequestDetail[]> {
  const supabase = createClient();
  // `!inner` makes the join filter the outer rows; the filter uses the alias.
  let query = supabase
    .from("usage_requests")
    .select(SELECT_DETAIL.replace("photo:photos(", "photo:photos!inner("))
    .eq("photo.photographer_id", photographerId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load requests: ${error.message}`);
  return (data ?? []).map(normalise);
}

/** Existing request for this photo + nonprofit pair, if there is one. */
export async function findRequest(
  photoId: string,
  nonprofitId: string,
): Promise<UsageRequest | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("usage_requests")
    .select("*")
    .eq("photo_id", photoId)
    .eq("nonprofit_id", nonprofitId)
    .maybeSingle<UsageRequest>();
  return data ?? null;
}

/** Photo ids this nonprofit has already requested. */
export async function listRequestedPhotoIds(
  nonprofitId: string,
): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("usage_requests")
    .select("photo_id")
    .eq("nonprofit_id", nonprofitId);
  return (data ?? []).map((row) => (row as { photo_id: string }).photo_id);
}

/** Totals from the photographer_hours view. */
export async function getPhotographerHours(
  photographerId: string,
): Promise<{ totalHours: number; photosUsed: number }> {
  const supabase = createClient();
  const { data } = await supabase
    .from("photographer_hours")
    .select("*")
    .eq("photographer_id", photographerId)
    .maybeSingle<PhotographerHours>();

  return {
    totalHours: Number(data?.total_hours ?? 0),
    photosUsed: Number(data?.photos_used ?? 0),
  };
}

/* ---------------------------------------------------------------- saves -- */

export interface SavedPhoto {
  photo_id: string;
  created_at: string;
  photo: RequestPhoto | null;
}

/** Photo ids on this user's shortlist. */
export async function listSavedPhotoIds(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("photo_saves")
    .select("photo_id")
    .eq("user_id", userId);
  return (data ?? []).map((row) => (row as { photo_id: string }).photo_id);
}

/** The shortlist itself, with enough photo data to render cards. */
export async function listSavedPhotos(userId: string): Promise<SavedPhoto[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photo_saves")
    .select(
      `
      photo_id,
      created_at,
      photo:photos(
        id, title, image_path, photographer_id,
        photographer:photographers(id, name, email, avatar_url)
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load saves: ${error.message}`);

  return (data ?? []).map((row) => {
    const save = row as unknown as {
      photo_id: string;
      created_at: string;
      photo: (RequestPhoto & { photographer: unknown }) | RequestPhoto[] | null;
    };
    const photo = first(save.photo);
    return {
      photo_id: save.photo_id,
      created_at: save.created_at,
      photo: photo
        ? { ...photo, photographer: first(photo.photographer as never) }
        : null,
    };
  });
}
