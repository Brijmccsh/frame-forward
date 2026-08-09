import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatProps {
  label: string;
  value: ReactNode;
  hint?: string;
  emoji?: string;
  tone?: "default" | "primary" | "accent";
  className?: string;
}

const tones = {
  default: "",
  primary: "border-primary/30 bg-primary/5",
  accent: "border-accent/30 bg-accent/5",
};

/** Big Fraunces number with a quiet label — used across dashboards. */
export function Stat({
  label,
  value,
  hint,
  emoji,
  tone = "default",
  className,
}: StatProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-sm",
        tones[tone],
        className,
      )}
    >
      <div className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-wide text-muted">
        {emoji ? <span aria-hidden>{emoji}</span> : null}
        {label}
      </div>
      <p className="mt-2 font-head text-3xl font-bold tabular-nums text-text">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function StatRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>{children}</div>
  );
}
