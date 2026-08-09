import { ChipLink } from "@/components/ui/chip";
import type { Category } from "@/lib/types";

/**
 * URL-driven category filter. Uses links rather than state so the current
 * filter is shareable and survives a refresh.
 *
 * Small screens get a single swipeable row; from `sm` up the chips wrap onto
 * as many rows as they need, so nothing is hidden off-screen.
 */
export function CategoryFilter({
  categories,
  activeSlug,
  basePath = "/browse",
}: {
  categories: Category[];
  activeSlug: string | null;
  basePath?: string;
}) {
  return (
    <nav aria-label="Filter by category">
      <ul className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        <li className="shrink-0 snap-start">
          <ChipLink href={basePath} selected={!activeSlug}>
            All
          </ChipLink>
        </li>
        {categories.map((category) => (
          <li key={category.id} className="shrink-0 snap-start">
            <ChipLink
              href={`${basePath}?category=${category.slug}`}
              selected={activeSlug === category.slug}
            >
              {category.name}
            </ChipLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
