import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Compact page numbers with ellipses — always shows first, last, current and
 * its neighbours, so the control stays the same width at any page count.
 */
function pageWindow(current: number, count: number): Array<number | "gap"> {
  if (count <= 7) {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, count, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < count) pages.add(current + 1);
  if (current <= 3) pages.add(2).add(3).add(4);
  if (current >= count - 2) pages.add(count - 1).add(count - 2).add(count - 3);

  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= count)
    .sort((a, b) => a - b);

  const out: Array<number | "gap"> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) out.push("gap");
    out.push(page);
  });
  return out;
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  /** Builds the href for a page number, preserving other filters. */
  hrefFor: (page: number) => string;
  className?: string;
  /** What's being counted, e.g. "photo". */
  noun?: string;
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  hrefFor,
  className,
  noun = "photo",
}: PaginationProps) {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  const arrow =
    "inline-flex h-9 items-center gap-1 rounded-pill border border-border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col items-center justify-between gap-4 sm:flex-row",
        className,
      )}
    >
      <p className="text-sm text-muted" aria-live="polite">
        Showing{" "}
        <span className="font-semibold text-text">
          {first}–{last}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-text">{total}</span>{" "}
        {noun}
        {total === 1 ? "" : "s"}
      </p>

      {pageCount > 1 ? (
        <div className="flex items-center gap-1.5">
          {page > 1 ? (
            <Link
              href={hrefFor(page - 1)}
              rel="prev"
              className={cn(arrow, "text-text hover:border-primary/50")}
            >
              <ChevronLeft aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          ) : (
            <span className={cn(arrow, "cursor-not-allowed text-muted/50")}>
              <ChevronLeft aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </span>
          )}

          <ul className="flex items-center gap-1">
            {pageWindow(page, pageCount).map((entry, index) =>
              entry === "gap" ? (
                <li
                  key={`gap-${index}`}
                  aria-hidden
                  className="px-1 text-sm text-muted"
                >
                  …
                </li>
              ) : (
                <li key={entry}>
                  <Link
                    href={hrefFor(entry)}
                    aria-current={entry === page ? "page" : undefined}
                    aria-label={`Page ${entry}`}
                    className={cn(
                      "inline-flex h-9 min-w-9 items-center justify-center rounded-pill px-2.5 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      entry === page
                        ? "bg-primary text-primary-fg shadow-sm"
                        : "border border-border text-muted hover:border-primary/50 hover:text-text",
                    )}
                  >
                    {entry}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {page < pageCount ? (
            <Link
              href={hrefFor(page + 1)}
              rel="next"
              className={cn(arrow, "text-text hover:border-primary/50")}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight aria-hidden className="h-4 w-4" />
            </Link>
          ) : (
            <span className={cn(arrow, "cursor-not-allowed text-muted/50")}>
              <span className="hidden sm:inline">Next</span>
              <ChevronRight aria-hidden className="h-4 w-4" />
            </span>
          )}
        </div>
      ) : null}
    </nav>
  );
}
