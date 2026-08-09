/** Shared input normalisation for profile forms. */

/** Trim, collapse empties to null, and cap length. */
export function cleanText(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

/** Accepts "site.com" or "https://site.com"; returns null when unusable. */
export function normalizeUrl(value: unknown): string | null {
  const text = cleanText(value, 300);
  if (!text) return null;
  const withScheme = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes(".")) return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** Accepts "@name", "name", or a full instagram URL. Stores the handle. */
export function normalizeInstagram(value: unknown): string | null {
  const text = cleanText(value, 100);
  if (!text) return null;
  const handle = text
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/+$/, "")
    .replace(/^@/, "")
    .trim();
  return /^[A-Za-z0-9._]{1,30}$/.test(handle) ? handle : null;
}

/** Graduation year within a sensible window, else null. */
export function parseGradYear(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const year = Number(value);
  if (!Number.isInteger(year)) return null;
  const now = new Date().getFullYear();
  if (year < 1950 || year > now + 10) return null;
  return year;
}

/** EIN as XX-XXXXXXX when it has 9 digits; otherwise the raw text. */
export function normalizeEin(value: unknown): string | null {
  const text = cleanText(value, 20);
  if (!text) return null;
  const digits = text.replace(/\D/g, "");
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return text;
}
