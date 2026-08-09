"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhotoActions } from "@/components/requests/photo-actions";
import { PhotoLightbox } from "./photo-lightbox";
import { publicUrlFor } from "@/lib/storage";
import type { PhotoWithRelations } from "@/lib/queries/photos";

export interface BrowseGalleryProps {
  photos: PhotoWithRelations[];
  /** Present when the viewer is a nonprofit, enabling save + request. */
  nonprofit?: {
    orgName: string | null;
    savedPhotoIds: string[];
    requestedPhotoIds: string[];
  } | null;
}

/** Photo grid where every tile opens the lightbox. */
export function BrowseGallery({ photos, nonprofit }: BrowseGalleryProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [saved, setSaved] = React.useState(
    () => new Set(nonprofit?.savedPhotoIds ?? []),
  );
  const [requested, setRequested] = React.useState(
    () => new Set(nonprofit?.requestedPhotoIds ?? []),
  );

  const onSavedChange = React.useCallback(
    (photoId: string, isSaved: boolean) =>
      setSaved((current) => {
        const next = new Set(current);
        if (isSaved) next.add(photoId);
        else next.delete(photoId);
        return next;
      }),
    [],
  );

  const onRequested = React.useCallback(
    (photoId: string) =>
      setRequested((current) => new Set(current).add(photoId)),
    [],
  );

  const openPhoto = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <figure className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  aria-label={`Open ${photo.title ?? "photo"}`}
                >
                  <Image
                    src={publicUrlFor("photos", photo.image_path)}
                    alt={photo.title ?? "Photo"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
                  />
                </button>

                {photo.category ? (
                  <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-pill bg-bg/85 px-2 py-1 text-2xs font-semibold text-text backdrop-blur">
                    <span aria-hidden>{photo.category.emoji}</span>
                    {photo.category.name}
                  </span>
                ) : null}

                {nonprofit ? (
                  <div className="absolute right-2 top-2">
                    <PhotoActions
                      photoId={photo.id}
                      orgName={nonprofit.orgName}
                      saved={saved.has(photo.id)}
                      requested={requested.has(photo.id)}
                      layout="overlay"
                      onSavedChange={onSavedChange}
                    />
                  </div>
                ) : null}

                {nonprofit && requested.has(photo.id) ? (
                  <span className="pointer-events-none absolute bottom-2 left-2">
                    <Badge tone="accent" dot>
                      Requested
                    </Badge>
                  </span>
                ) : null}
              </div>

              <figcaption className="flex flex-1 flex-col gap-3 p-3.5">
                <h3 className="line-clamp-2 font-head text-sm font-semibold leading-snug text-text">
                  {photo.title ?? "Untitled"}
                </h3>

                {photo.photographer ? (
                  <Link
                    href={`/u/${photo.photographer.id}`}
                    className="mt-auto flex items-center gap-2 text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Avatar
                      src={photo.photographer.avatar_url}
                      name={photo.photographer.name}
                      size="xs"
                    />
                    <span className="truncate">
                      {photo.photographer.name ?? "Photographer"}
                    </span>
                  </Link>
                ) : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <PhotoLightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        actions={
          nonprofit && openPhoto ? (
            <PhotoActions
              key={openPhoto.id}
              photoId={openPhoto.id}
              orgName={nonprofit.orgName}
              saved={saved.has(openPhoto.id)}
              requested={requested.has(openPhoto.id)}
              onSavedChange={onSavedChange}
              onRequested={onRequested}
            />
          ) : null
        }
      />
    </>
  );
}
