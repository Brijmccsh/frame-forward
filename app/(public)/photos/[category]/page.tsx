import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { ChipLink } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PublicPhotoGrid } from "@/components/photos/public-photo-grid";
import { JsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo/jsonld";
import { categoryCopy } from "@/lib/seo/copy";
import {
  getPublicCategory,
  listPublicCategories,
  listPublicPhotos,
} from "@/lib/queries/public";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await listPublicCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getPublicCategory(params.category);
  if (!category) return { title: "Category not found" };

  const copy = categoryCopy(category.slug, category.name);
  return {
    title: copy.heading,
    description: copy.intro,
    alternates: { canonical: `/photos/${category.slug}` },
    openGraph: {
      title: copy.heading,
      description: copy.intro,
      url: `/photos/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { page?: string };
}) {
  const category = await getPublicCategory(params.category);
  if (!category) notFound();

  const requested = Number.parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(requested) ? requested : 1;

  const [categories, result] = await Promise.all([
    listPublicCategories(),
    listPublicPhotos({ categoryId: category.id, page }),
  ]);

  const copy = categoryCopy(category.slug, category.name);
  const path = `/photos/${category.slug}`;
  const hrefFor = (next: number) => (next > 1 ? `${path}?page=${next}` : path);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Photos", path: "/photos" },
          { name: category.name, path },
        ])}
      />
      <JsonLd
        data={collectionJsonLd({
          name: copy.heading,
          description: copy.intro,
          path,
          photos: result.photos,
        })}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex items-center gap-2">
          <li>
            <ChipLink href="/photos">All photos</ChipLink>
          </li>
        </ol>
      </nav>

      <header className="mt-6 max-w-prose">
        <h1 className="font-head text-4xl font-bold tracking-tight text-text sm:text-5xl">
          {copy.heading}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          {copy.intro}
        </p>
        <p className="mt-3 text-pretty leading-relaxed text-muted">
          {copy.forNonprofits}
        </p>
        <div className="mt-7">
          <ButtonLink href="/login">Request a photo</ButtonLink>
        </div>
      </header>

      <nav aria-label="Other categories" className="mt-10">
        <ul className="flex flex-wrap gap-2">
          {categories.map((other) => (
            <li key={other.id}>
              <ChipLink
                href={`/photos/${other.slug}`}
                selected={other.slug === category.slug}
              >
                {other.name}
              </ChipLink>
            </li>
          ))}
        </ul>
      </nav>

      {result.photos.length ? (
        <>
          <div className="mt-10">
            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              total={result.total}
              pageSize={result.pageSize}
              hrefFor={hrefFor}
            />
          </div>
          <div className="mt-6">
            <PublicPhotoGrid photos={result.photos} />
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
        <div className="mt-10">
          <EmptyState
            title={`No ${category.name.toLowerCase()} photos yet`}
            description="Nothing has been published in this category so far. Try another, or check back soon."
            action={<ButtonLink href="/photos">See all photos</ButtonLink>}
          />
        </div>
      )}
    </>
  );
}
