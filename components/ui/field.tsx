"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared label / hint / error scaffolding for form controls.
 * Wire it up with `useFieldIds` so ids and aria attributes stay in sync.
 */
export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function useFieldIds(id: string | undefined, hasHint: boolean, hasError: boolean) {
  const generated = React.useId();
  const fieldId = id ?? generated;
  const hintId = hasHint ? `${fieldId}-hint` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return { fieldId, hintId, errorId, describedBy };
}

export function Field({
  label,
  hint,
  error,
  required,
  className,
  fieldId,
  hintId,
  errorId,
  children,
}: FieldProps & {
  fieldId: string;
  hintId?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="flex items-center gap-1 text-sm font-medium text-text"
        >
          {label}
          {required ? (
            <span aria-hidden className="text-primary">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared visual treatment for input-like controls. */
export const controlClasses =
  "w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text shadow-xs transition-colors duration-200 placeholder:text-muted/70 focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60";
