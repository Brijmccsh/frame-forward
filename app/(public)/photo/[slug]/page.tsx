import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { ChipLink } from "@/components/ui/chip";
import { PublicPhotoGrid } from "@/components/photos/public-photo-grid";
import { JsonLd, breadcrumbJsonLd, photoJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { getPublicPhotoBySlug, listPublicPhotos } from "@/lib/queries/public";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const photo = await getPublicPhotoBySlug(params.slug);
  if (!photo) return { title: "Photo not found" };

  const who = photo.photographer?.name ?? "a student photographer";
  const title = `${photo.title ?? "Photograph"} by ${who}`;
  const description =
    photo.caption ??
    `${photo.category?.name ?? "Photography"} by ${who}, free for nonprofits to use on Frame Forward.`;

  return {
    title,
    description,
    alternates: { canonical: `/photo/${photo.slug}` },
    openGraph: {
      title,
      description,
      url: `/photo/${photo.slug}`,
      type: "article",
      // The photograph itself is the share image — far better than a generic card.
      images: [{ url: photo.imageUrl, alt: photo.title ?? "Photograph" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [photo.imageUrl],
    },
  };
}

export default async function PublicPhotoPage({
  params,
}: {
  params: { slug: string };
}) {
  const photo = await getPublicPhotoBySlug(params.slug);
  if (!photo) notFound();

  const more = photo.photographer
    ? await listPublicPhotos({
        photographerId: photo.photographer.id,
        pageSize: 8,
      })
    : null;
  const others = (more?.photos ?? []).filter((item) => item.id !== photo.id);

  return (
    <>
      <JsonLd data={photoJsonLd(photo)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Photos", path: "/photos" },
          ...(photo.category
            ? [
                {
                  name: photo.category.name,
                  path: `/photos/${photo.category.slug}`,
                },
              ]
            : []),
          { name: photo.title ?? "Photograph", path: `/photo/${photo.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2">
        <ChipLink href="/photos">All photos</ChipLink>
        {photo.category ? (
          <ChipLink href={`/photos/${photo.category.slug}`}>
            {photo.category.name}
          </ChipLink>
        ) : null}
      </nav>

      <article className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <figure className="relative overflow-hidden rounded-lg border border-border bg-surface-2">
          <Image
            src={photo.imageUrl}
            alt={photo.title ?? "Student photograph"}
            width={1600}
            height={1200}
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="h-auto w-full object-contain"
          />
        </figure>

        <div>
          <h1 className="font-head text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {photo.title ?? "Untitled"}
          </h1>

          {photo.caption ? (
            <p className="mt-4 text-pretty leading-relaxed text-muted">
              {photo.caption}
            </p>
          ) : null}

          {photo.photographer ? (
            <Link
              href={`/photographers/${photo.photographer.slug}`}
              className="mt-7 flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar
                src={photo.photographer.avatar_url}
                name={photo.photographer.name}
                size="md"
              />
              <span className="min-w-0">
                <span className="block truncate font-head text-base font-semibold text-text">
                  {photo.photographer.name ?? "Student photographer"}
                </span>
                <span className="block truncate text-xs text-muted">
                  {photo.photographer.tagline ?? "View portfolio"}
                </span>
              </span>
            </Link>
          ) : null}

          <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm">
            {photo.category ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Category</dt>
                <dd>
                  <Link
                    href={`/photos/${photo.category.slug}`}
                    className="link-underline font-medium text-accent-ink"
                  >
                    {photo.category.name}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Published</dt>
              <dd className="text-text">{formatDate(photo.created_at)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Cost to nonprofits</dt>
              <dd className="font-semibold text-text">Free</dd>
            </div>
          </dl>

          <div className="mt-7 rounded-lg border border-border bg-surface-2/60 p-5">
            <p className="text-sm leading-relaxed text-muted">
              Nonprofits can use this photograph free of charge. Sign in to
              request it and you&apos;ll get the photographer&apos;s email
              straight away.
            </p>
            <div className="mt-4">
              <ButtonLink href="/login">Request this photo</ButtonLink>
            </div>
          </div>
        </div>
      </article>

      {others.length ? (
        <section className="mt-16">
          <h2 className="font-head text-xl font-semibold text-text">
            More from {photo.photographer?.name ?? "this photographer"}
          </h2>
          <div className="mt-5">
            <PublicPhotoGrid photos={others.slice(0, 4)} />
          </div>
        </section>
      ) : null}
    </>
  );
}
