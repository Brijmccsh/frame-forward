/**
 * The ways a nonprofit can report using a photo.
 * Kept free of server-only imports so client components can use it too.
 */
export const USE_TYPES = [
  "Social post",
  "Newsletter",
  "Website",
  "Flyer",
  "Campaign",
] as const;

export type UseType = (typeof USE_TYPES)[number];

export const isUseType = (value: unknown): value is UseType =>
  typeof value === "string" && (USE_TYPES as readonly string[]).includes(value);
