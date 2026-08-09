"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { cleanText } from "@/lib/validation";
import * as photos from "@/lib/queries/photos";

export type PhotoActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; field?: string };

const TITLE_MAX = 100;
const CAPTION_MAX = 500;

export interface CreatePhotoInput {
  image_path: string;
  category_id: number | string | null;
  title: string;
  caption: string | null;
  is_published: boolean;
}

function parseCategoryId(value: number | string | null): number | null {
  if (value === null || value === "") return null;
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
}

function fail(error: string, field?: string): PhotoActionResult {
  return { ok: false, error, field };
}

/** Publish (or save as draft) a photo the browser already uploaded. */
export async function createPhoto(
  input: CreatePhotoInput,
): Promise<PhotoActionResult> {
  const { profile } = await requireRole("photographer");

  const title = cleanText(input.title, TITLE_MAX);
  const imagePath = cleanText(input.image_path, 500);
  const categoryId = parseCategoryId(input.category_id);

  if (!imagePath) return fail("Add a photo first.", "image");
  if (!imagePath.startsWith(`${profile.id}/`)) {
    return fail("That upload doesn't belong to you.", "image");
  }
  if (!categoryId) return fail("Pick a category.", "category");
  if (!title) return fail("Give your photo a title.", "title");

  try {
    const photo = await photos.create({
      photographer_id: profile.id,
      category_id: categoryId,
      title,
      caption: cleanText(input.caption, CAPTION_MAX),
      image_path: imagePath,
      is_published: input.is_published,
    });

    revalidatePath("/app");
    revalidatePath("/browse");
    revalidatePath(`/u/${profile.id}`);
    return { ok: true, id: photo.id };
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Could not save that photo.",
    );
  }
}

export interface UpdatePhotoInput {
  id: string;
  category_id: number | string | null;
  title: string;
  caption: string | null;
}

export async function updatePhoto(
  input: UpdatePhotoInput,
): Promise<PhotoActionResult> {
  const { profile } = await requireRole("photographer");

  const title = cleanText(input.title, TITLE_MAX);
  const categoryId = parseCategoryId(input.category_id);
  if (!categoryId) return fail("Pick a category.", "category");
  if (!title) return fail("Give your photo a title.", "title");

  try {
    await photos.update(input.id, {
      category_id: categoryId,
      title,
      caption: cleanText(input.caption, CAPTION_MAX),
    });

    revalidatePath("/app");
    revalidatePath("/browse");
    revalidatePath(`/u/${profile.id}`);
    return { ok: true };
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Could not update that photo.",
    );
  }
}

export async function setPhotoPublished(
  id: string,
  isPublished: boolean,
): Promise<PhotoActionResult> {
  const { profile } = await requireRole("photographer");

  try {
    await photos.update(id, { is_published: isPublished });
    revalidatePath("/app");
    revalidatePath("/browse");
    revalidatePath(`/u/${profile.id}`);
    return { ok: true };
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Could not update that photo.",
    );
  }
}

export async function deletePhoto(id: string): Promise<PhotoActionResult> {
  const { profile } = await requireRole("photographer");

  try {
    await photos.remove(id);
    revalidatePath("/app");
    revalidatePath("/browse");
    revalidatePath(`/u/${profile.id}`);
    return { ok: true };
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Could not delete that photo.",
    );
  }
}

/** Used by the upload page's "publish and go to library" path. */
export async function goToLibrary(): Promise<never> {
  redirect("/app");
}
