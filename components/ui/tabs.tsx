"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** Optional trailing count, e.g. number of pending requests. */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled value. Omit for uncontrolled with `defaultValue`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  /** Accessible name for the tab list. */
  label?: string;
  children?: (value: string) => React.ReactNode;
}

/** WAI-ARIA tabs with roving focus and arrow-key navigation. */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  label = "Sections",
  children,
}: TabsProps) {
  const [internal, setInternal] = React.useState(
    defaultValue ?? items[0]?.value ?? "",
  );
  const active = value ?? internal;
  const baseId = React.useId();
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const index = items.findIndex((item) => item.value === active);
    const last = items.length - 1;
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % items.length
        : event.key === "ArrowLeft"
          ? (index - 1 + items.length) % items.length
          : event.key === "Home"
            ? 0
            : last;

    const next = items[nextIndex];
    if (!next) return;
    select(next.value);
    refs.current[next.value]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-pill border border-border bg-surface-2 p-1"
      >
        {items.map((item) => {
          const selected = item.value === active;
          return (
            <button
              key={item.value}
              ref={(node) => {
                refs.current[item.value] = node;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${item.value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.value)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-200 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "bg-surface text-text shadow-sm"
                  : "text-muted hover:text-text",
              )}
            >
              {item.label}
              {typeof item.count === "number" ? (
                <span
                  className={cn(
                    "rounded-pill px-1.5 py-0.5 text-2xs tabular-nums",
                    selected
                      ? "bg-primary/20 text-primary-ink"
                      : "bg-border/70 text-muted",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {children ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
          className="mt-6 focus-visible:outline-none"
        >
          {children(active)}
        </div>
      ) : null}
    </div>
  );
}
