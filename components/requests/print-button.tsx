"use client";

import { Button } from "@/components/ui/button";

/** Opens the browser print dialog — "Save as PDF" produces the download. */
export function PrintButton() {
  return (
    <Button onClick={() => window.print()}>
      <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
        <path
          d="M6 7.5V3h8v4.5M6 14H4.5A1.5 1.5 0 013 12.5v-3A1.5 1.5 0 014.5 8h11A1.5 1.5 0 0117 9.5v3a1.5 1.5 0 01-1.5 1.5H14M6 12h8v5H6v-5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Print / Save as PDF
    </Button>
  );
}
