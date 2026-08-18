import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublicPhotographers } from "@/lib/queries/public";

const TITLE = "Student photographers";
const DESCRIPTION =
  "The student photographers sharing their work with nonprofits on Frame Forward.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/photographers" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/photographers" },
};

export const revalidate = 3600;

export default async function PhotographersPage() {
  const photographers = await listPublicPhotographers();

  return (
    <>
      <header className="max-w-prose">
        <h1 className="font-head text-4xl font-bold tracking-tight text-text sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Every photographer here shares their work with nonprofits at no cost.
          Open a profile to see their portfolio.
        </p>
      </header>

      {photographers.length ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photographers.map((photographer) => (
            <li key={photographer.id}>
              <Link
                href={`/photographers/${photographer.slug}`}
                className="flex h-full items-start gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar
                  src={photographer.avatar_url}
                  name={photographer.name}
                  size="lg"
                />
                <span className="min-w-0">
                  <span className="block truncate font-head text-lg font-semibold text-text">
                    {photographer.name ?? "Student photographer"}
                  </span>
                  {photographer.tagline ? (
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">
                      {photographer.tagline}
                    </span>
                  ) : null}
                  {photographer.location ? (
                    <span className="mt-2 block text-xs text-muted">
                      {photographer.location}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No photographers yet"
            description="Approved photographers will appear here as they join."
            action={<ButtonLink href="/login">Join as a photographer</ButtonLink>}
          />
        </div>
      )}
    </>
  );
}
