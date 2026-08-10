import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Search box for the gallery.
 *
 * A plain GET form on purpose: the results are server-rendered, so submitting
 * navigates to a shareable URL and works without any client JS. The active
 * category rides along in a hidden field so searching doesn't drop the filter.
 */
export function PhotoSearch({
  query,
  categorySlug,
  total,
}: {
  query: string | null;
  categorySlug: string | null;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <form
        action="/browse"
        method="get"
        role="search"
        className="flex w-full max-w-xl items-center gap-2"
      >
        {categorySlug ? (
          <input type="hidden" name="category" value={categorySlug} />
        ) : null}

        <div className="relative flex-1">
          <label htmlFor="photo-search" className="sr-only">
            Search photos by title or caption
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            id="photo-search"
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search by title or caption…"
            maxLength={80}
            className="w-full rounded-pill border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text shadow-xs transition-colors placeholder:text-muted/70 focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {query ? (
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>
            {total} result{total === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-text">
              &ldquo;{query}&rdquo;
            </span>
          </span>
          <Link
            href={categorySlug ? `/browse?category=${categorySlug}` : "/browse"}
            className="inline-flex items-center gap-1 rounded-pill border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary/50 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden className="h-3 w-3" />
            Clear search
          </Link>
        </p>
      ) : null}
    </div>
  );
}
