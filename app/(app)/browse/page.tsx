import { Search, Sprout } from "lucide-react";
import type { Metadata } from "next";
import { BrowseGallery } from "@/components/photos/browse-gallery";
import { CategoryFilter } from "@/components/photos/category-filter";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireProfile } from "@/lib/auth";
import { listCategories } from "@/lib/queries/categories";
import { listPublished } from "@/lib/queries/photos";
import {
  listRequestedPhotoIds,
  listSavedPhotoIds,
} from "@/lib/queries/requests";

export const metadata: Metadata = {
  title: "Browse photos",
  description: "Free photography from student artists, sorted by category.",
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session = await requireProfile();
  const activeSlug = searchParams.category ?? null;

  const isNonprofit = session.role === "nonprofit";
  const [categories, photos, savedPhotoIds, requestedPhotoIds] =
    await Promise.all([
      listCategories(),
      listPublished({ categorySlug: activeSlug }),
      isNonprofit ? listSavedPhotoIds(session.profile.id) : [],
      isNonprofit ? listRequestedPhotoIds(session.profile.id) : [],
    ]);

  const active = categories.find((category) => category.slug === activeSlug);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-head text-3xl font-bold text-text sm:text-4xl">
            {active ? active.name : "Browse photos"}
          </h1>
          <p className="mt-2 max-w-prose text-pretty text-muted">
            {session.role === "nonprofit"
              ? "Every photo here is free for your organization to use. Find one you love and reach out to the photographer."
              : "See what everyone else is shooting — and what nonprofits are picking up."}
          </p>
        </div>
        {session.role === "photographer" ? (
          <ButtonLink href="/app/upload" variant="outline" size="sm">
            Add your own
          </ButtonLink>
        ) : null}
      </div>

      <div className="mt-7">
        <CategoryFilter categories={categories} activeSlug={activeSlug} />
      </div>

      <div className="mt-7">
        {photos.length ? (
          <>
            <p className="mb-4 text-sm text-muted">
              {photos.length} photo{photos.length === 1 ? "" : "s"}
              {active ? ` in ${active.name}` : ""}
            </p>
            <BrowseGallery
              photos={photos}
              nonprofit={
                isNonprofit && session.role === "nonprofit"
                  ? {
                      orgName: session.profile.org_name,
                      savedPhotoIds,
                      requestedPhotoIds,
                    }
                  : null
              }
            />
          </>
        ) : (
          <EmptyState
            icon={active ? Search : Sprout}
            title={
              active
                ? `Nothing in ${active.name} yet`
                : "The library is just getting started"
            }
            description={
              active
                ? "Try another category — new photos land here all the time."
                : "No photos have been published yet. Check back soon, or be the first to add one."
            }
            action={
              active ? (
                <ButtonLink href="/browse" variant="outline">
                  See all photos
                </ButtonLink>
              ) : session.role === "photographer" ? (
                <ButtonLink href="/app/upload">Upload a photo</ButtonLink>
              ) : null
            }
          />
        )}
      </div>
    </>
  );
}
