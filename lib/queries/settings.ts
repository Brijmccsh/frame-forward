import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";

const FALLBACK_HOURS = 3;

/**
 * App settings row (id = 1). Hours per photo come from here, never from a
 * constant in the code.
 */
export const getSettings = cache(async (): Promise<Settings> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle<Settings>();

  if (error || !data) return { id: 1, hours_per_photo: FALLBACK_HOURS };
  return data;
});

export const getHoursPerPhoto = cache(async (): Promise<number> => {
  const settings = await getSettings();
  return Number(settings.hours_per_photo ?? FALLBACK_HOURS);
});
