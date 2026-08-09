/** Shapes the profile forms send to the server actions. */

export interface PhotographerInput {
  name: string;
  avatar_url: string | null;
  cover_url: string | null;
  tagline: string | null;
  bio: string | null;
  school: string | null;
  grad_year: string | number | null;
  location: string | null;
  website: string | null;
  instagram: string | null;
}

export interface NonprofitInput {
  org_name: string;
  avatar_url: string | null;
  cover_url: string | null;
  mission: string | null;
  contact_name: string | null;
  website: string | null;
  location: string | null;
  ein: string | null;
}

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };
