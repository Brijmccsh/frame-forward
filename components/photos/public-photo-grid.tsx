import Image from "next/image";
import Link from "next/link";
import type { PublicPhoto } from "@/lib/queries/public";

/**
 * Photo grid for the public pages. Every tile is a real anchor to a real URL,
 * so crawlers can walk the whole library from any category page.
 */
export function PublicPhotoGrid({ photos }: { photos: PublicPhoto[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, index) => (
        <li key={photo.id}>
          <Link
            href={`/photo/${photo.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
              <Image
                src={photo.imageUrl}
                alt={photo.title ?? "Student photograph"}
                fill
                priority={index < 4}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
              />
              {photo.category ? (
                <span className="pointer-events-none absolute left-2 top-2 rounded-pill bg-bg/85 px-2.5 py-1 text-2xs font-semibold text-text backdrop-blur">
                  {photo.category.name}
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3.5">
              <h3 className="line-clamp-2 font-head text-sm font-semibold leading-snug text-text">
                {photo.title ?? "Untitled"}
              </h3>
              {photo.photographer?.name ? (
                <p className="mt-auto text-xs text-muted">
                  {photo.photographer.name}
                </p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
