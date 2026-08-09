import Image from "next/image";
import { cn, initials } from "@/lib/utils";

const sizes = {
  xs: { box: "h-6 w-6 text-2xs", px: 24 },
  sm: { box: "h-8 w-8 text-xs", px: 32 },
  md: { box: "h-10 w-10 text-sm", px: 40 },
  lg: { box: "h-14 w-14 text-base", px: 56 },
  xl: { box: "h-20 w-20 text-xl", px: 80 },
  "2xl": { box: "h-28 w-28 text-3xl", px: 112 },
};

export interface AvatarProps {
  src?: string | null;
  /** Used for the alt text and the initials fallback. */
  name?: string | null;
  size?: keyof typeof sizes;
  /** Squircle instead of a circle — nice for nonprofit logos. */
  rounded?: "full" | "md";
  className?: string;
  ring?: boolean;
}

export function Avatar({
  src,
  name,
  size = "md",
  rounded = "full",
  ring = false,
  className,
}: AvatarProps) {
  const { box, px } = sizes[size];
  const label = name?.trim() || "Profile";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface-2 font-body font-semibold uppercase tracking-wide text-muted",
        rounded === "full" ? "rounded-pill" : "rounded-md",
        ring && "ring-2 ring-surface",
        box,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          width={px * 2}
          height={px * 2}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden>{initials(name) || "·"}</span>
      )}
      {!src ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
