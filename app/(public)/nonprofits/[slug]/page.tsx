import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ChipLink } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { JsonLd, breadcrumbJsonLd, nonprofitJsonLd } from "@/lib/seo/jsonld";
import {
  getPublicNonprofitBySlug,
  listPublicNonprofits,
} from "@/lib/queries/public";

export const revalidate = 3600;

export async function generateStaticParams() {
  const nonprofits = await listPublicNonprofits();
  return nonprofits.map((nonprofit) => ({ slug: nonprofit.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const nonprofit = await getPublicNonprofitBySlug(params.slug);
  if (!nonprofit) return { title: "Nonprofit not found" };

  const name = nonprofit.org_name ?? "Nonprofit";
  // Name first so a search for the organization matches the strongest signal.
  const title = `${name} — nonprofit profile`;
  const description =
    nonprofit.mission ??
    `${name} is on Frame Forward, where student photographers share their work with nonprofits for free.`;

  return {
    title,
    description,
    alternates: { canonical: `/nonprofits/${nonprofit.slug}` },
    openGraph: {
      title,
      description,
      url: `/nonprofits/${nonprofit.slug}`,
      type: "website",
      images: nonprofit.cover_url
        ? [{ url: nonprofit.cover_url, alt: name }]
        : undefined,
    },
  };
}

/**
 * A nonprofit's public profile — everything here is for looking. Nonprofits
 * don't publish photos (they request them, and that flow stays behind sign-in),
 * so where a photographer's page has a portfolio, this one has their mission.
 */
export default async function PublicNonprofitPage({
  params,
}: {
  params: { slug: string };
}) {
  const nonprofit = await getPublicNonprofitBySlug(params.slug);
  if (!nonprofit) notFound();

  const name = nonprofit.org_name ?? "Nonprofit";

  return (
    <>
      <JsonLd data={nonprofitJsonLd(nonprofit)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Nonprofits", path: "/nonprofits" },
          { name, path: `/nonprofits/${nonprofit.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb">
        <ChipLink href="/nonprofits">All nonprofits</ChipLink>
      </nav>

      <header className="mt-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-surface-2 sm:aspect-[5/2] lg:aspect-[3/1]">
          {nonprofit.cover_url ? (
            <Image
              src={nonprofit.cover_url}
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
              src={nonprofit.avatar_url}
              name={name}
              size="2xl"
              rounded="md"
              className="border-4 border-bg bg-surface shadow-md"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <h1 className="font-head text-3xl font-bold leading-tight text-text sm:text-4xl">
              {name}
            </h1>
            {nonprofit.verified ? (
              <Badge tone="accent" dot>
                Verified
              </Badge>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="order-2 lg:order-1">
          {nonprofit.mission ? (
            <section className="max-w-prose">
              <h2 className="font-head text-lg font-semibold text-text">
                About {name}
              </h2>
              <p className="mt-2 whitespace-pre-line text-pretty leading-relaxed text-muted">
                {nonprofit.mission}
              </p>
            </section>
          ) : (
            <EmptyState
              title="No mission statement yet"
              description={`${name} hasn't shared what they do so far.`}
            />
          )}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
            <dl className="flex flex-col gap-4 text-sm">
              {nonprofit.location ? (
                <div>
                  <dt className="text-2xs font-semibold uppercase tracking-wide text-muted">
                    Based in
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-text">
                    <MapPin aria-hidden className="h-3.5 w-3.5 text-muted" />
                    {nonprofit.location}
                  </dd>
                </div>
              ) : null}
              {nonprofit.website ? (
                <div>
                  <dt className="text-2xs font-semibold uppercase tracking-wide text-muted">
                    Website
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5">
                    <Globe aria-hidden className="h-3.5 w-3.5 text-muted" />
                    <a
                      href={nonprofit.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline break-all text-accent-ink"
                    >
                      {nonprofit.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm leading-relaxed text-muted">
                Student photographers share their work with nonprofits like{" "}
                {name}, free of charge.
              </p>
              <div className="mt-4">
                <ButtonLink href="/login" size="sm">
                  Share your photography
                </ButtonLink>
              </div>
            </div>
          </div>

          <p className="mt-4 px-1 text-xs leading-relaxed text-muted">
            Part of {name}?{" "}
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
