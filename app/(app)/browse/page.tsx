import type { Metadata } from "next";
import { Search, Sprout } from "lucide-react";
import { BrowseGallery } from "@/components/photos/browse-gallery";
import { CategoryFilter } from "@/components/photos/category-filter";
import { PhotoSearch } from "@/components/photos/photo-search";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { requireProfile } from "@/lib/auth";
import { listCategories } from "@/lib/queries/categories";
import { listPublished, sanitizeSearch } from "@/lib/queries/photos";
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
  searchParams: { category?: string; q?: string; page?: string };
}) {
  const session = await requireProfile();
  const activeSlug = searchParams.category ?? null;
  const query = sanitizeSearch(searchParams.q);
  const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? requestedPage : 1;

  const isNonprofit = session.role === "nonprofit";
  const [categories, result, savedPhotoIds, requestedPhotoIds] =
    await Promise.all([
      listCategories(),
      listPublished({ categorySlug: activeSlug, query, page }),
      isNonprofit ? listSavedPhotoIds(session.profile.id) : [],
      isNonprofit ? listRequestedPhotoIds(session.profile.id) : [],
    ]);

  const active = categories.find((category) => category.slug === activeSlug);

  /** Keeps category + search when moving between pages. */
  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    if (activeSlug) params.set("category", activeSlug);
    if (query) params.set("q", query);
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    return search ? `/browse?${search}` : "/browse";
  };

  const filtered = Boolean(active || query);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-head text-3xl font-bold text-text sm:text-4xl">
            {active ? active.name : "Browse photos"}
          </h1>
          <p className="mt-2 max-w-prose text-pretty text-muted">
            {isNonprofit
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
        <PhotoSearch
          query={query}
          categorySlug={activeSlug}
          total={result.total}
        />
      </div>

      <div className="mt-5">
        <CategoryFilter categories={categories} activeSlug={activeSlug} />
      </div>

      {result.photos.length ? (
        <>
          <div className="mt-7">
            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              total={result.total}
              pageSize={result.pageSize}
              hrefFor={hrefFor}
            />
          </div>

          <div className="mt-6">
            <BrowseGallery
              photos={result.photos}
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
          </div>

          {result.pageCount > 1 ? (
            <div className="mt-10 border-t border-border pt-6">
              <Pagination
                page={result.page}
                pageCount={result.pageCount}
                total={result.total}
                pageSize={result.pageSize}
                hrefFor={hrefFor}
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-7">
          <EmptyState
            icon={filtered ? Search : Sprout}
            title={
              query
                ? `Nothing matches “${query}”`
                : active
                  ? `Nothing in ${active.name} yet`
                  : "The library is just getting started"
            }
            description={
              query
                ? "Try a different word, or clear the search to see everything."
                : active
                  ? "Try another category — new photos land here all the time."
                  : "No photos have been published yet. Check back soon, or be the first to add one."
            }
            action={
              filtered ? (
                <ButtonLink href="/browse" variant="outline">
                  See all photos
                </ButtonLink>
              ) : session.role === "photographer" ? (
                <ButtonLink href="/app/upload">Upload a photo</ButtonLink>
              ) : null
            }
          />
        </div>
      )}
    </>
  );
}
