"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page flex min-h-dvh items-center justify-center py-16">
      <div className="w-full max-w-lg">
        <ErrorState error={error} reset={reset} />
      </div>
    </div>
  );
}
