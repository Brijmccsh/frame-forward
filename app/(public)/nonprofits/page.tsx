import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { JsonLd, nonprofitListJsonLd } from "@/lib/seo/jsonld";
import { listPublicNonprofits } from "@/lib/queries/public";

const TITLE = "Nonprofits";
const DESCRIPTION =
  "The nonprofits on Frame Forward, telling their stories with photography that student photographers share for free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/nonprofits" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/nonprofits" },
};

export const revalidate = 3600;

export default async function NonprofitsPage() {
  const nonprofits = await listPublicNonprofits();

  return (
    <>
      <header className="max-w-prose">
        <h1 className="font-head text-4xl font-bold tracking-tight text-text sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Every organization here can use photography shared by students at no
          cost. Open a profile to see the work they do.
        </p>
      </header>

      {nonprofits.length ? (
        <>
          <JsonLd data={nonprofitListJsonLd(nonprofits)} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nonprofits.map((nonprofit) => (
              <li key={nonprofit.id}>
                <Link
                  href={`/nonprofits/${nonprofit.slug}`}
                  className="flex h-full items-start gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar
                    src={nonprofit.avatar_url}
                    name={nonprofit.org_name}
                    size="lg"
                    rounded="md"
                  />
                  <span className="min-w-0">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-head text-lg font-semibold text-text">
                        {nonprofit.org_name ?? "Nonprofit"}
                      </span>
                      {nonprofit.verified ? (
                        <Badge tone="accent" dot>
                          Verified
                        </Badge>
                      ) : null}
                    </span>
                    {nonprofit.mission ? (
                      <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">
                        {nonprofit.mission}
                      </span>
                    ) : null}
                    {nonprofit.location ? (
                      <span className="mt-2 block text-xs text-muted">
                        {nonprofit.location}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No nonprofits yet"
            description="Approved nonprofits will appear here as they join."
            action={<ButtonLink href="/login">Join as a nonprofit</ButtonLink>}
          />
        </div>
      )}
    </>
  );
}
