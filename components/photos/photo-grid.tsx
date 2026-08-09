import Image from "next/image";
import { publicUrlFor } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/types";

/**
 * Read-only masonry-ish grid of photos.
 * Interactions (saving, requesting) land in a later phase.
 */
export function PhotoGrid({
  photos,
  className,
}: {
  photos: Photo[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4",
        className,
      )}
    >
      {photos.map((photo) => (
        <li key={photo.id}>
          <figure className="group overflow-hidden rounded-md border border-border bg-surface-2 shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-md">
            <div className="relative aspect-square">
              <Image
                src={publicUrlFor("photos", photo.image_path)}
                alt={photo.title ?? "Photo"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
              />
            </div>
            {photo.title ? (
              <figcaption className="truncate bg-surface px-3 py-2 text-xs font-medium text-text">
                {photo.title}
              </figcaption>
            ) : null}
          </figure>
        </li>
      ))}
    </ul>
  );
}
