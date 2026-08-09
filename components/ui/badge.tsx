import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted border-border",
  primary: "bg-primary/15 text-primary-ink border-primary/25",
  accent: "bg-accent/15 text-accent-ink border-accent/25",
  success: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-300",
  warning: "bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-300",
  danger: "bg-danger/15 text-danger border-danger/25",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Small leading dot — good for statuses. */
  dot?: boolean;
}

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span aria-hidden className="h-1.5 w-1.5 rounded-pill bg-current" />
      ) : null}
      {children}
    </span>
  );
}
