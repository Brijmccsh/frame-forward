import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { findProfile } from "@/lib/auth";
import type { Photo, SessionProfile } from "@/lib/types";

/**
 * Any user's profile by id — resolves whether they're a photographer or a
 * nonprofit. Returns null when the id doesn't exist (or RLS hides it).
 */
export const getProfileById = cache(
  async (id: string): Promise<SessionProfile | null> => {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    return findProfile(createClient(), id);
  },
);

/** Published photos for a photographer, newest first. */
export const getPublishedPhotos = cache(
  async (photographerId: string, limit = 60): Promise<Photo[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("photographer_id", photographerId)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data ?? []) as Photo[];
  },
);
