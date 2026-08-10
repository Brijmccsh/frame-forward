/**
 * Row shapes for the existing Supabase schema.
 * These mirror the database exactly — the DB is the source of truth and is
 * never recreated from here.
 */

export type Role = "photographer" | "nonprofit";

/** Application state. New sign-ups start as "pending". */
export type ProfileStatus = "pending" | "approved" | "denied";

export interface Photographer {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  tagline: string | null;
  bio: string | null;
  school: string | null;
  grad_year: number | null;
  location: string | null;
  website: string | null;
  instagram: string | null;
  status: ProfileStatus;
  created_at: string;
}

export interface Nonprofit {
  id: string;
  org_name: string | null;
  email: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  mission: string | null;
  contact_name: string | null;
  website: string | null;
  location: string | null;
  ein: string | null;
  verified: boolean;
  status: ProfileStatus;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  emoji: string | null;
  sort_order: number;
}

export interface Settings {
  id: number;
  hours_per_photo: number;
}

export interface Photo {
  id: string;
  photographer_id: string;
  category_id: number | null;
  title: string | null;
  caption: string | null;
  image_path: string;
  is_published: boolean;
  created_at: string;
}

export interface PhotoSave {
  user_id: string;
  photo_id: string;
  created_at: string;
}

export type UsageRequestStatus = "requested" | "used";

export interface UsageRequest {
  id: string;
  photo_id: string;
  nonprofit_id: string;
  status: UsageRequestStatus;
  use_type: string | null;
  hours_awarded: number | null;
  created_at: string;
  used_at: string | null;
}

export interface PhotographerHours {
  photographer_id: string;
  total_hours: number | null;
  photos_used: number | null;
}

/** The signed-in user's role plus their profile row. */
export type SessionProfile =
  | { role: "photographer"; profile: Photographer }
  | { role: "nonprofit"; profile: Nonprofit };
