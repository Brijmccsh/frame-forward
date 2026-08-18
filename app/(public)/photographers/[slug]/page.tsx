import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtSign, Globe, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { ChipLink } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { PublicPhotoGrid } from "@/components/photos/public-photo-grid";
import { JsonLd, breadcrumbJsonLd, photographerJsonLd } from "@/lib/seo/jsonld";
import {
  getPublicPhotographerBySlug,
  listPublicPhotographers,
  listPublicPhotos,
} from "@/lib/queries/public";

export const revalidate = 3600;

export async function generateStaticParams() {
  const photographers = await listPublicPhotographers();
  return photographers.map((photographer) => ({ slug: photographer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const photographer = await getPublicPhotographerBySlug(params.slug);
  if (!photographer) return { title: "Photographer not found" };

  const name = photographer.name ?? "Student photographer";
  // Name first so a search for the person matches the strongest signal.
  const title = `${name} — photography portfolio`;
  const description =
    photographer.tagline ??
    photographer.bio ??
    `Photographs by ${name}, shared free with nonprofits on Frame Forward.`;

  return {
    title,
    description,
    alternates: { canonical: `/photographers/${photographer.slug}` },
    openGraph: {
      title,
      description,
      url: `/photographers/${photographer.slug}`,
      type: "profile",
      images: photographer.cover_url
        ? [{ url: photographer.cover_url, alt: name }]
        : undefined,
    },
  };
}

export default async function PublicPhotographerPage({
  params,
}: {
  params: { slug: string };
}) {
  const photographer = await getPublicPhotographerBySlug(params.slug);
  if (!photographer) notFound();

  const result = await listPublicPhotos({
    photographerId: photographer.id,
    pageSize: 60,
  });
  const name = photographer.name ?? "Student photographer";

  return (
    <>
      <JsonLd data={photographerJsonLd(photographer, result.photos)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Photographers", path: "/photographers" },
          { name, path: `/photographers/${photographer.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb">
        <ChipLink href="/photographers">All photographers</ChipLink>
      </nav>

      <header className="mt-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-surface-2 sm:aspect-[5/2] lg:aspect-[3/1]">
          {photographer.cover_url ? (
            <Image
              src={photographer.cover_url}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-[center_38%]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-lpink via-brand-pink/60 to-brand-lteal/60" />
          )}
        </div>

        <div className="flex items-end gap-4 px-1">
          <div className="-mt-10 sm:-mt-12">
            <Avatar
              src={photographer.avatar_url}
              name={name}
              size="2xl"
              className="border-4 border-bg bg-surface shadow-md"
            />
          </div>
          <div className="pb-1">
            <h1 className="font-head text-3xl font-bold leading-tight text-text sm:text-4xl">
              {name}
            </h1>
            {photographer.tagline ? (
              <p className="mt-1 max-w-prose text-pretty text-muted">
                {photographer.tagline}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="order-2 lg:order-1">
          {photographer.bio ? (
            <section className="mb-10 max-w-prose">
              <h2 className="font-head text-lg font-semibold text-text">
                About {name.split(" ")[0]}
              </h2>
              <p className="mt-2 whitespace-pre-line text-pretty leading-relaxed text-muted">
                {photographer.bio}
              </p>
            </section>
          ) : null}

          <section>
            <h2 className="font-head text-lg font-semibold text-text">
              Photographs by {name}
              {result.total ? (
                <span className="ml-2 text-sm font-medium text-muted">
                  {result.total}
                </span>
              ) : null}
            </h2>
            <div className="mt-5">
              {result.photos.length ? (
                <PublicPhotoGrid photos={result.photos} />
              ) : (
                <EmptyState
                  title="No published photographs yet"
                  description={`${name} hasn't published anything to the library so far.`}
                />
              )}
            </div>
          </section>
        </div>

        <aside className="order-1 lg:order-2">
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
            <dl className="flex flex-col gap-4 text-sm">
              {photographer.location ? (
                <div>
                  <dt className="text-2xs font-semibold uppercase tracking-wide text-muted">
                    Based in
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-text">
                    <MapPin aria-hidden className="h-3.5 w-3.5 text-muted" />
                    {photographer.location}
                  </dd>
                </div>
              ) : null}
              {photographer.website ? (
                <div>
                  <dt className="text-2xs font-semibold uppercase tracking-wide text-muted">
                    Website
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5">
                    <Globe aria-hidden className="h-3.5 w-3.5 text-muted" />
                    <a
                      href={photographer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline break-all text-accent-ink"
                    >
                      {photographer.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              ) : null}
              {photographer.instagram ? (
                <div>
                  <dt className="text-2xs font-semibold uppercase tracking-wide text-muted">
                    Instagram
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5">
                    <AtSign aria-hidden className="h-3.5 w-3.5 text-muted" />
                    <a
                      href={`https://instagram.com/${photographer.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-accent-ink"
                    >
                      @{photographer.instagram}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm leading-relaxed text-muted">
                Nonprofits can use this work free of charge.
              </p>
              <div className="mt-4">
                <ButtonLink href="/login" size="sm">
                  Request a photo
                </ButtonLink>
              </div>
            </div>
          </div>

          <p className="mt-4 px-1 text-xs leading-relaxed text-muted">
            Are you {name.split(" ")[0]}?{" "}
            <Link href="/login" className="link-underline">
              Sign in
            </Link>{" "}
            to edit this page.
          </p>
        </aside>
      </div>
    </>
  );
}
