import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Ada Lovelace" -> "AL". Used for avatar fallbacks. */
export function initials(value?: string | null, max = 2) {
  if (!value) return "";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
