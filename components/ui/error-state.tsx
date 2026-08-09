"use client";

import * as React from "react";
import { Button } from "./button";

/**
 * Shared body for route error boundaries. Keeps the tone friendly — the
 * audience is students, not engineers — while still offering a retry.
 */
export function ErrorState({
  title = "Something went sideways",
  description = "That's on us, not you. Give it another go — and if it keeps happening, try reloading the page.",
  error,
  reset,
}: {
  title?: string;
  description?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  React.useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
      <span
        aria-hidden
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-pill bg-surface-2 text-3xl"
      >
        🫠
      </span>
      <h1 className="font-head text-2xl font-bold text-text">{title}</h1>
      <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted">
        {description}
      </p>

      {reset ? (
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      ) : null}

      {error?.digest ? (
        <p className="mt-6 text-2xs text-muted/70">
          Reference: <code>{error.digest}</code>
        </p>
      ) : null}
    </div>
  );
}
