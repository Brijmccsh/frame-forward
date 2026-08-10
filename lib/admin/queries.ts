import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Nonprofit, Photographer, ProfileStatus, Role } from "@/lib/types";

/** One row in the review queue, flattened so the UI doesn't branch on role. */
export interface Application {
  id: string;
  role: Role;
  status: ProfileStatus;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  /** Tagline for photographers, mission for nonprofits. */
  summary: string | null;
  /** School + class year, or contact name + location. */
  detail: string | null;
  location: string | null;
  website: string | null;
  createdAt: string;
}

export interface ApplicationCounts {
  photographer: Record<ProfileStatus, number>;
  nonprofit: Record<ProfileStatus, number>;
}

const empty = (): Record<ProfileStatus, number> => ({
  pending: 0,
  approved: 0,
  denied: 0,
});

function fromPhotographer(row: Photographer): Application {
  const detail = [row.school, row.grad_year ? `Class of ${row.grad_year}` : null]
    .filter(Boolean)
    .join(" · ");

  return {
    id: row.id,
    role: "photographer",
    status: row.status,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url,
    summary: row.tagline || row.bio,
    detail: detail || null,
    location: row.location,
    website: row.website,
    createdAt: row.created_at,
  };
}

function fromNonprofit(row: Nonprofit): Application {
  return {
    id: row.id,
    role: "nonprofit",
    status: row.status,
    name: row.org_name,
    email: row.email,
    avatarUrl: row.avatar_url,
    summary: row.mission,
    detail: [row.contact_name, row.ein ? `EIN ${row.ein}` : null]
      .filter(Boolean)
      .join(" · ") || null,
    location: row.location,
    website: row.website,
    createdAt: row.created_at,
  };
}

/**
 * Applications for one role and status, oldest first — the queue should be
 * first-in-first-reviewed.
 */
export async function listApplications(
  role: Role,
  status: ProfileStatus,
): Promise<Application[]> {
  const supabase = createClient();
  const table = role === "photographer" ? "photographers" : "nonprofits";

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load applications: ${error.message}`);

  return role === "photographer"
    ? (data as Photographer[]).map(fromPhotographer)
    : (data as Nonprofit[]).map(fromNonprofit);
}

/** Tab and filter counts, in one round trip per table. */
export async function getApplicationCounts(): Promise<ApplicationCounts> {
  const supabase = createClient();

  const [photographers, nonprofits] = await Promise.all([
    supabase.from("photographers").select("status"),
    supabase.from("nonprofits").select("status"),
  ]);

  const counts: ApplicationCounts = {
    photographer: empty(),
    nonprofit: empty(),
  };

  const tally = (
    rows: Array<{ status: ProfileStatus }> | null,
    into: Record<ProfileStatus, number>,
  ) => {
    (rows ?? []).forEach((row) => {
      if (row.status in into) into[row.status] += 1;
    });
  };

  tally(photographers.data as Array<{ status: ProfileStatus }> | null, counts.photographer);
  tally(nonprofits.data as Array<{ status: ProfileStatus }> | null, counts.nonprofit);

  return counts;
}
