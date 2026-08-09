"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Avatar } from "@/components/ui/avatar";
import { publicUrlFor } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { PhotoWithRelations } from "@/lib/queries/photos";

export interface PhotoLightboxProps {
  photos: PhotoWithRelations[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  /** Save / request controls, rendered in the details pane. */
  actions?: React.ReactNode;
}

/** Full-screen photo viewer with arrow-key navigation. */
export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  actions,
}: PhotoLightboxProps) {
  const [mounted, setMounted] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const photo = open ? photos[index] : undefined;

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onIndexChange(null);
      if (event.key === "ArrowRight" && index !== null) {
        onIndexChange((index + 1) % photos.length);
      }
      if (event.key === "ArrowLeft" && index !== null) {
        onIndexChange((index - 1 + photos.length) % photos.length);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, index, photos.length, onIndexChange]);

  if (!mounted || !open || !photo) return null;

  const step = (delta: number) =>
    onIndexChange((index! + delta + photos.length) % photos.length);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title ?? "Photo"}
      className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-brand-navy/80 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-sm font-medium text-white/70 tabular-nums">
          {index! + 1} / {photos.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onIndexChange(null)}
          aria-label="Close photo"
          className="rounded-pill bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
            <path
              d="M5 5l10 10M15 5L5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 lg:flex-row lg:gap-6 lg:px-6 lg:pb-6">
        <div className="relative min-h-0 flex-1">
          <Image
            key={photo.id}
            src={publicUrlFor("photos", photo.image_path)}
            alt={photo.title ?? "Photo"}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="animate-fade-in object-contain"
            priority
          />

          {photos.length > 1 ? (
            <>
              <NavButton direction="prev" onClick={() => step(-1)} />
              <NavButton direction="next" onClick={() => step(1)} />
            </>
          ) : null}
        </div>

        <aside className="shrink-0 overflow-y-auto rounded-lg border border-border bg-surface p-5 lg:w-80">
          {photo.category ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-2 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wide text-muted">
              <span aria-hidden>{photo.category.emoji}</span>
              {photo.category.name}
            </span>
          ) : null}

          <h2 className="mt-3 font-head text-xl font-bold text-text">
            {photo.title ?? "Untitled"}
          </h2>
          {photo.caption ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {photo.caption}
            </p>
          ) : null}

          {photo.photographer ? (
            <Link
              href={`/u/${photo.photographer.id}`}
              className="mt-5 flex items-center gap-3 rounded-md border border-border p-2.5 transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar
                src={photo.photographer.avatar_url}
                name={photo.photographer.name}
                size="sm"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-text">
                  {photo.photographer.name ?? "Photographer"}
                </span>
                <span className="block text-xs text-muted">
                  View profile
                </span>
              </span>
            </Link>
          ) : null}

          {actions ? <div className="mt-5">{actions}</div> : null}
        </aside>
      </div>
    </div>,
    document.body,
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-pill bg-white/10 p-3 text-white backdrop-blur transition-all hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        prev ? "left-1 sm:left-3" : "right-1 sm:right-3",
      )}
    >
      <svg viewBox="0 0 20 20" aria-hidden className="h-5 w-5">
        <path
          d={prev ? "M12.5 4L6.5 10l6 6" : "M7.5 4l6 6-6 6"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
