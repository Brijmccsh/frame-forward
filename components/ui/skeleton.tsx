import type * as React from "react";
import { cn } from "@/lib/utils";

/** Shimmering placeholder used while server data streams in. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-2",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-black/5 after:to-transparent dark:after:via-white/5",
        className,
      )}
      {...props}
    />
  );
}
