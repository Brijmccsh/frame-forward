import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ChipLink } from "@/components/ui/chip";
import { Pagination } from "@/components/ui/pagination";
import { PublicPhotoGrid } from "@/components/photos/public-photo-grid";
import { JsonLd, collectionJsonLd } from "@/lib/seo/jsonld";
import { listPublicCategories, listPublicPhotos } from "@/lib/queries/public";

const TITLE = "Free photography for nonprofits";
const DESCRIPTION =
  "A free photo library for nonprofits, shot by student photographers. Browse by category and use any image at no cost.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/photos" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/photos" },
};

export const revalidate = 3600;

export default async function PublicPhotosPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const requested = Number.parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(requested) ? requested : 1;

  const [categories, result] = await Promise.all([
    listPublicCategories(),
    listPublicPhotos({ page }),
  ]);

  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/photos",
          photos: result.photos,
        })}
      />

      <header className="max-w-prose">
        <h1 className="font-head text-4xl font-bold tracking-tight text-text sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Every photograph here was taken by a student and shared for nonprofits
          to use free of charge. Browse by category, or find a photographer whose
          work fits your mission.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/login">Request a photo</ButtonLink>
          <ButtonLink href="/photographers" variant="outline">
            Meet the photographers
          </ButtonLink>
        </div>
      </header>

      <nav aria-label="Categories" className="mt-10">
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category.id}>
              <ChipLink href={`/photos/${category.slug}`}>
                {category.name}
              </ChipLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10">
        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          total={result.total}
          pageSize={result.pageSize}
          hrefFor={(next) => (next > 1 ? `/photos?page=${next}` : "/photos")}
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
            hrefFor={(next) => (next > 1 ? `/photos?page=${next}` : "/photos")}
          />
        </div>
      ) : null}

      <p className="mt-12 text-sm text-muted">
        Are you a student photographer?{" "}
        <Link href="/login" className="link-underline font-medium text-accent-ink">
          Share your work
        </Link>
        .
      </p>
    </>
  );
}
