import "server-only";

import { cache } from "react";
import { createPublicClient as createClient } from "@/lib/supabase/public";
import { publicUrlFor } from "@/lib/storage";
import { toSlug } from "@/lib/seo/slug";

/**
 * Read-only queries for the crawlable pages.
 *
 * These hit the `public_*` views, which expose only approved photographers and
 * published photos — and never an email address. The signed-in app keeps using
 * its own queries under RLS; nothing here touches that path.
 */

export interface PublicPhotographer {
  id: string;
  slug: string;
  name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  instagram: string | null;
  created_at: string;
}

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface PublicPhoto {
  id: string;
  slug: string;
  title: string | null;
  caption: string | null;
  image_path: string;
  imageUrl: string;
  created_at: string;
  category: PublicCategory | null;
  photographer: PublicPhotographer | null;
}

const PHOTOGRAPHER_COLUMNS =
  "id, name, avatar_url, cover_url, tagline, bio, location, website, instagram, created_at";

function toPublicPhotographer(row: Record<string, unknown>): PublicPhotographer {
  const id = String(row.id);
  return {
    id,
    slug: toSlug(row.name as string | null, id),
    name: (row.name as string) ?? null,
    avatar_url: (row.avatar_url as string) ?? null,
    cover_url: (row.cover_url as string) ?? null,
    tagline: (row.tagline as string) ?? null,
    bio: (row.bio as string) ?? null,
    location: (row.location as string) ?? null,
    website: (row.website as string) ?? null,
    instagram: (row.instagram as string) ?? null,
    created_at: String(row.created_at),
  };
}

function toPublicPhoto(
  row: Record<string, unknown>,
  categories: Map<number, PublicCategory>,
  photographers: Map<string, PublicPhotographer>,
): PublicPhoto {
  const id = String(row.id);
  const imagePath = String(row.image_path);
  return {
    id,
    slug: toSlug(row.title as string | null, id),
    title: (row.title as string) ?? null,
    caption: (row.caption as string) ?? null,
    image_path: imagePath,
    imageUrl: publicUrlFor("photos", imagePath),
    created_at: String(row.created_at),
    category: categories.get(Number(row.category_id)) ?? null,
    photographer: photographers.get(String(row.photographer_id)) ?? null,
  };
}

export const listPublicCategories = cache(async (): Promise<PublicCategory[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("public_categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });
  return (data ?? []) as PublicCategory[];
});

export const getPublicCategory = cache(
  async (slug: string): Promise<PublicCategory | null> => {
    const all = await listPublicCategories();
    return all.find((category) => category.slug === slug) ?? null;
  },
);

const photographerIndex = cache(
  async (): Promise<Map<string, PublicPhotographer>> => {
    const supabase = createClient();
    const { data } = await supabase
      .from("public_photographers")
      .select(PHOTOGRAPHER_COLUMNS);
    const map = new Map<string, PublicPhotographer>();
    (data ?? []).forEach((row) => {
      const photographer = toPublicPhotographer(row as Record<string, unknown>);
      map.set(photographer.id, photographer);
    });
    return map;
  },
);

const categoryIndex = cache(async (): Promise<Map<number, PublicCategory>> => {
  const categories = await listPublicCategories();
  return new Map(categories.map((category) => [category.id, category]));
});

export interface PublicPhotoPage {
  photos: PublicPhoto[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export const PUBLIC_PAGE_SIZE = 24;

export async function listPublicPhotos({
  categoryId,
  photographerId,
  page = 1,
  pageSize = PUBLIC_PAGE_SIZE,
}: {
  categoryId?: number;
  photographerId?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PublicPhotoPage> {
  const supabase = createClient();
  const safePage = Math.max(1, Math.floor(page));
  const from = (safePage - 1) * pageSize;

  let builder = supabase
    .from("public_photos")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (categoryId) builder = builder.eq("category_id", categoryId);
  if (photographerId) builder = builder.eq("photographer_id", photographerId);

  const [{ data, count }, categories, photographers] = await Promise.all([
    builder,
    categoryIndex(),
    photographerIndex(),
  ]);

  const total = count ?? 0;
  return {
    photos: (data ?? []).map((row) =>
      toPublicPhoto(row as Record<string, unknown>, categories, photographers),
    ),
    total,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export const listPublicPhotographers = cache(
  async (): Promise<PublicPhotographer[]> => {
    const index = await photographerIndex();
    return Array.from(index.values()).sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? ""),
    );
  },
);

/** Resolves `maya-chen-63072251` back to a photographer. */
export async function getPublicPhotographerBySlug(
  slug: string,
): Promise<PublicPhotographer | null> {
  const all = await listPublicPhotographers();
  return (
    all.find((photographer) => photographer.slug === slug) ??
    all.find((photographer) => photographer.id.startsWith(slug)) ??
    null
  );
}

export async function getPublicPhotoBySlug(
  slug: string,
): Promise<PublicPhoto | null> {
  const short = slug.match(/([0-9a-f]{8})$/i)?.[1];
  if (!short) return null;

  const supabase = createClient();
  const { data } = await supabase.from("public_photos").select("*");
  const [categories, photographers] = await Promise.all([
    categoryIndex(),
    photographerIndex(),
  ]);

  const row = (data ?? []).find((candidate) =>
    String((candidate as Record<string, unknown>).id)
      .replace(/-/g, "")
      .startsWith(short.toLowerCase()),
  );
  if (!row) return null;
  return toPublicPhoto(row as Record<string, unknown>, categories, photographers);
}

/** Everything the sitemap needs, in one pass. */
export async function listAllPublicForSitemap() {
  const supabase = createClient();
  const [{ data: photos }, photographers, categories] = await Promise.all([
    supabase.from("public_photos").select("id, title, created_at"),
    listPublicPhotographers(),
    listPublicCategories(),
  ]);

  return {
    photos: (photos ?? []).map((row) => {
      const record = row as Record<string, unknown>;
      const id = String(record.id);
      return {
        slug: toSlug(record.title as string | null, id),
        updatedAt: new Date(String(record.created_at)),
      };
    }),
    photographers,
    categories,
  };
}
