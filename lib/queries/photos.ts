import "server-only";

import { createClient } from "@/lib/supabase/server";
import { publicUrlFor } from "@/lib/storage";
import { getCategoryBySlug } from "./categories";
import type { Category, Photo } from "@/lib/types";

/** Minimal photographer info shown on a photo card. */
export interface PhotoAuthor {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export interface PhotoWithRelations extends Photo {
  photographer: PhotoAuthor | null;
  category: Pick<Category, "id" | "name" | "slug" | "emoji"> | null;
}

const SELECT_WITH_RELATIONS = `
  *,
  photographer:photographers(id, name, avatar_url),
  category:categories(id, name, slug, emoji)
` as const;

/** Public URL for a stored photo object. */
export function photoUrl(photo: Pick<Photo, "image_path">) {
  return publicUrlFor("photos", photo.image_path);
}

/**
 * Supabase types an embedded one-to-one relation as an object, but returns
 * `null` when the row is missing. Normalise both shapes.
 */
function normalise(row: unknown): PhotoWithRelations {
  const photo = row as PhotoWithRelations & {
    photographer: PhotoAuthor | PhotoAuthor[] | null;
    category: PhotoWithRelations["category"] | PhotoWithRelations["category"][];
  };
  return {
    ...photo,
    photographer: Array.isArray(photo.photographer)
      ? (photo.photographer[0] ?? null)
      : photo.photographer,
    category: Array.isArray(photo.category)
      ? (photo.category[0] ?? null)
      : photo.category,
  };
}

export interface ListPublishedOptions {
  /** Category slug to filter by. Omit or pass null for everything. */
  categorySlug?: string | null;
  photographerId?: string;
  limit?: number;
  offset?: number;
}

/** Every published photo, newest first, optionally filtered by category. */
export async function listPublished({
  categorySlug,
  photographerId,
  limit = 60,
  offset = 0,
}: ListPublishedOptions = {}): Promise<PhotoWithRelations[]> {
  // Filter on the photos table itself — filtering an embedded relation would
  // only narrow the join, leaving the outer rows (and the page size) wrong.
  const category = categorySlug ? await getCategoryBySlug(categorySlug) : null;
  if (categorySlug && !category) return [];

  const supabase = createClient();
  let query = supabase
    .from("photos")
    .select(SELECT_WITH_RELATIONS)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq("category_id", category.id);
  if (photographerId) query = query.eq("photographer_id", photographerId);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load photos: ${error.message}`);
  return (data ?? []).map(normalise);
}

/** One photographer's photos. Drafts are included only for the owner. */
export async function listByPhotographer(
  photographerId: string,
  { includeUnpublished = false }: { includeUnpublished?: boolean } = {},
): Promise<PhotoWithRelations[]> {
  const supabase = createClient();
  let query = supabase
    .from("photos")
    .select(SELECT_WITH_RELATIONS)
    .eq("photographer_id", photographerId)
    .order("created_at", { ascending: false });

  if (!includeUnpublished) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load photos: ${error.message}`);
  return (data ?? []).map(normalise);
}

export async function getPhotoById(
  id: string,
): Promise<PhotoWithRelations | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .select(SELECT_WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return normalise(data);
}

export interface CreatePhotoFields {
  photographer_id: string;
  category_id: number | null;
  title: string;
  caption: string | null;
  image_path: string;
  is_published: boolean;
}

export async function create(fields: CreatePhotoFields): Promise<Photo> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .insert(fields)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Photo;
}

export interface UpdatePhotoFields {
  category_id?: number | null;
  title?: string;
  caption?: string | null;
  is_published?: boolean;
}

/** Update a photo. RLS restricts this to the owner. */
export async function update(
  id: string,
  fields: UpdatePhotoFields,
): Promise<Photo> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .update(fields)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Photo;
}

/** Delete a photo row and its object in the photos bucket. */
export async function remove(id: string): Promise<void> {
  const supabase = createClient();

  const { data: photo } = await supabase
    .from("photos")
    .select("image_path")
    .eq("id", id)
    .maybeSingle<Pick<Photo, "image_path">>();

  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Best effort: a leftover object is harmless, a failed delete is not.
  if (photo?.image_path) {
    await supabase.storage.from("photos").remove([photo.image_path]);
  }
}

/** Counts for the photographer's library header. */
export async function countsForPhotographer(photographerId: string) {
  const supabase = createClient();
  const [total, published] = await Promise.all([
    supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("photographer_id", photographerId),
    supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("photographer_id", photographerId)
      .eq("is_published", true),
  ]);

  return {
    total: total.count ?? 0,
    published: published.count ?? 0,
    drafts: (total.count ?? 0) - (published.count ?? 0),
  };
}
