import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

/** All categories in their configured order. */
export const listCategories = cache(async (): Promise<Category[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Category[];
});

/** Look up one category by slug (used by the browse filter). */
export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    const categories = await listCategories();
    return categories.find((category) => category.slug === slug) ?? null;
  },
);
