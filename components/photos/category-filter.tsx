import { ChipLink } from "@/components/ui/chip";
import type { Category } from "@/lib/types";

/**
 * URL-driven category filter. Uses links rather than state so the current
 * filter is shareable and survives a refresh.
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
      <ul className="flex snap-x gap-2 overflow-x-auto pb-1">
        <li className="snap-start">
          <ChipLink href={basePath} selected={!activeSlug}>
            All
          </ChipLink>
        </li>
        {categories.map((category) => (
          <li key={category.id} className="snap-start">
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
