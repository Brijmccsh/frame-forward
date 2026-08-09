/** Shared display formatting. */

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

export function formatDate(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = DATE_FORMAT,
) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", options);
}

export function formatLongDate(value: string | Date | null | undefined) {
  return formatDate(value, { month: "long", day: "numeric", year: "numeric" });
}

/** 3 -> "3", 3.5 -> "3.5" — keeps hour totals tidy. */
export function formatHours(value: number | null | undefined) {
  const hours = Number(value ?? 0);
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}
