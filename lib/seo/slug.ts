/**
 * URL slugs for public pages.
 *
 * A photographer's name (or a photo's title) is put in the URL because that is
 * one of the strongest signals for "search a student's name, find their
 * profile". The row id is appended so the slug stays unique and resolvable
 * without adding a slug column to the database.
 *
 *   "Maya Chen" + 63072251-…  ->  maya-chen-63072251
 */

const SHORT_ID_LENGTH = 8;

export function kebab(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** `name-shortid`, falling back to the short id alone for unnamed rows. */
export function toSlug(name: string | null | undefined, id: string): string {
  const short = id.replace(/-/g, "").slice(0, SHORT_ID_LENGTH);
  const base = kebab(name);
  return base ? `${base}-${short}` : short;
}

/** Pulls the short id back out of a slug. Returns null when malformed. */
export function shortIdFromSlug(slug: string): string | null {
  const match = slug.match(/([0-9a-f]{8})$/i);
  return match ? match[1].toLowerCase() : null;
}
