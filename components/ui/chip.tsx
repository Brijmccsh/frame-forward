import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const chipClasses = (selected: boolean) =>
  cn(
    "inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    selected
      ? "border-transparent bg-primary text-primary-fg shadow-sm"
      : "border-border bg-surface text-muted hover:-translate-y-0.5 hover:border-primary/50 hover:text-text hover:shadow-sm",
  );

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
}

/** Selectable pill — used for category filters. */
export function Chip({
  selected = false,
  icon,
  className,
  children,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(chipClasses(selected), className)}
      {...props}
    >
      {icon ? (
        <span aria-hidden className="flex items-center">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}

export interface ChipLinkProps extends LinkProps {
  selected?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Same look as `Chip`, but navigates — for URL-driven filters. */
export function ChipLink({
  selected = false,
  icon,
  className,
  children,
  ...props
}: ChipLinkProps) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={cn(chipClasses(selected), className)}
      {...props}
    >
      {icon ? (
        <span aria-hidden className="flex items-center">
          {icon}
        </span>
      ) : null}
      {children}
    </Link>
  );
}
