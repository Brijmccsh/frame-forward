"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HOME_PATH, findProfile, getUser } from "@/lib/auth";
import {
  cleanText,
  normalizeEin,
  normalizeInstagram,
  normalizeUrl,
  parseGradYear,
} from "@/lib/validation";
import type {
  NonprofitInput,
  PhotographerInput,
  ProfileActionResult,
} from "./types";

const NAME_MAX = 80;
const TAGLINE_MAX = 120;
const BIO_MAX = 1000;
const MISSION_MAX = 1000;

function friendlyDbError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("duplicate key") || text.includes("already exists")) {
    return "You already have a profile — try reloading the page.";
  }
  if (text.includes("row-level security")) {
    return "You don't have permission to save that.";
  }
  return "We couldn't save your profile. Please try again.";
}

function photographerFields(input: PhotographerInput) {
  return {
    name: cleanText(input.name, NAME_MAX),
    avatar_url: cleanText(input.avatar_url, 500),
    cover_url: cleanText(input.cover_url, 500),
    tagline: cleanText(input.tagline, TAGLINE_MAX),
    bio: cleanText(input.bio, BIO_MAX),
    school: cleanText(input.school, 120),
    grad_year: parseGradYear(input.grad_year),
    location: cleanText(input.location, 120),
    website: normalizeUrl(input.website),
    instagram: normalizeInstagram(input.instagram),
  };
}

function nonprofitFields(input: NonprofitInput) {
  return {
    org_name: cleanText(input.org_name, NAME_MAX),
    avatar_url: cleanText(input.avatar_url, 500),
    cover_url: cleanText(input.cover_url, 500),
    mission: cleanText(input.mission, MISSION_MAX),
    contact_name: cleanText(input.contact_name, NAME_MAX),
    website: normalizeUrl(input.website),
    location: cleanText(input.location, 120),
    ein: normalizeEin(input.ein),
  };
}

/** Creates the photographer profile for the signed-in user, then goes home. */
export async function createPhotographerProfile(
  input: PhotographerInput,
): Promise<ProfileActionResult> {
  const user = await getUser();
  if (!user) redirect("/login");

  const fields = photographerFields(input);
  if (!fields.name) {
    return { ok: false, error: "Add your name so nonprofits know who you are.", field: "name" };
  }

  const supabase = createClient();
  const existing = await findProfile(supabase, user.id);
  if (existing) redirect(HOME_PATH[existing.role]);

  const { error } = await supabase
    .from("photographers")
    .insert({ id: user.id, email: user.email, ...fields });

  if (error) return { ok: false, error: friendlyDbError(error.message) };

  revalidatePath("/", "layout");
  redirect(HOME_PATH.photographer);
}

/** Creates the nonprofit profile for the signed-in user, then goes home. */
export async function createNonprofitProfile(
  input: NonprofitInput,
): Promise<ProfileActionResult> {
  const user = await getUser();
  if (!user) redirect("/login");

  const fields = nonprofitFields(input);
  if (!fields.org_name) {
    return {
      ok: false,
      error: "Add your organization's name.",
      field: "org_name",
    };
  }

  const supabase = createClient();
  const existing = await findProfile(supabase, user.id);
  if (existing) redirect(HOME_PATH[existing.role]);

  const { error } = await supabase
    .from("nonprofits")
    .insert({ id: user.id, email: user.email, ...fields });

  if (error) return { ok: false, error: friendlyDbError(error.message) };

  revalidatePath("/", "layout");
  redirect(HOME_PATH.nonprofit);
}

export async function updatePhotographerProfile(
  input: PhotographerInput,
): Promise<ProfileActionResult> {
  const user = await getUser();
  if (!user) redirect("/login");

  const fields = photographerFields(input);
  if (!fields.name) {
    return { ok: false, error: "Your name can't be empty.", field: "name" };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("photographers")
    .update(fields)
    .eq("id", user.id);

  if (error) return { ok: false, error: friendlyDbError(error.message) };

  revalidatePath("/profile");
  revalidatePath(`/u/${user.id}`);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateNonprofitProfile(
  input: NonprofitInput,
): Promise<ProfileActionResult> {
  const user = await getUser();
  if (!user) redirect("/login");

  const fields = nonprofitFields(input);
  if (!fields.org_name) {
    return {
      ok: false,
      error: "Your organization name can't be empty.",
      field: "org_name",
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("nonprofits")
    .update(fields)
    .eq("id", user.id);

  if (error) return { ok: false, error: friendlyDbError(error.message) };

  revalidatePath("/profile");
  revalidatePath(`/u/${user.id}`);
  revalidatePath("/", "layout");
  return { ok: true };
}
