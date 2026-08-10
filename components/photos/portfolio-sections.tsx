import { PhotoGrid } from "./photo-grid";
import type { PhotoWithRelations } from "@/lib/queries/photos";

/**
 * A photographer's published work, grouped into a section per category.
 *
 * Every photo already carries a category, so this gives the portfolio real
 * albums with no extra schema: sections appear in order of size, so whatever
 * someone shoots most leads their profile.
 */
export function PortfolioSections({
  photos,
}: {
  photos: PhotoWithRelations[];
}) {
  const groups = new Map<
    string,
    { name: string; photos: PhotoWithRelations[] }
  >();

  photos.forEach((photo) => {
    const key = photo.category?.slug ?? "uncategorised";
    const name = photo.category?.name ?? "Other work";
    const group = groups.get(key) ?? { name, photos: [] };
    group.photos.push(photo);
    groups.set(key, group);
  });

  const sections = Array.from(groups.entries()).sort(
    (a, b) => b[1].photos.length - a[1].photos.length,
  );

  // A single group isn't an album — just show the grid.
  if (sections.length <= 1) {
    return <PhotoGrid photos={photos} />;
  }

  return (
    <div className="flex flex-col gap-10">
      {sections.map(([slug, group]) => (
        <section key={slug} aria-labelledby={`album-${slug}`}>
          <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border pb-2">
            <h3
              id={`album-${slug}`}
              className="font-head text-base font-semibold text-text"
            >
              {group.name}
            </h3>
            <span className="text-xs tabular-nums text-muted">
              {group.photos.length} photo
              {group.photos.length === 1 ? "" : "s"}
            </span>
          </div>
          <PhotoGrid photos={group.photos} />
        </section>
      ))}
    </div>
  );
}
