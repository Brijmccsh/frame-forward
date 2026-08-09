import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Friendly placeholder for empty lists and not-yet-built sections. */
export function EmptyState({
  emoji = "✨",
  title,
  description,
  action,
  className,
}: {
  emoji?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed border-border bg-surface/60 px-6 py-14 text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-pill bg-surface-2 text-3xl"
      >
        {emoji}
      </span>
      <h2 className="font-head text-xl font-semibold text-text">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
