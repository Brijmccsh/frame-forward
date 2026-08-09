import type { ReactNode } from "react";
import { ImageOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Friendly placeholder for empty lists and not-yet-built sections. */
export function EmptyState({
  icon: Icon = ImageOff,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-pill bg-surface-2 text-muted"
      >
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="font-head text-xl font-semibold text-text">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
