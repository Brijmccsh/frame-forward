import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getProfileById, getPublishedPhotos } from "@/lib/profiles/queries";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const session = await getProfileById(params.id);
  if (!session) return { title: "Profile not found" };

  const name =
    session.role === "photographer"
      ? session.profile.name
      : session.profile.org_name;
  return { title: name ?? "Profile" };
}

/** Detail row shown in the sidebar. */
function Detail({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null;
  href?: string | null;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-2xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-sm text-text">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-accent-ink"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default async function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getProfileById(params.id);
  if (!session) notFound();

  const photos =
    session.role === "photographer"
      ? await getPublishedPhotos(session.profile.id)
      : [];

  const isPhotographer = session.role === "photographer";
  const name = isPhotographer
    ? session.profile.name
    : session.profile.org_name;

  return (
    <>
      <ProfileHeader
        role={session.role}
        name={name}
        tagline={isPhotographer ? session.profile.tagline : null}
        avatarUrl={session.profile.avatar_url}
        coverUrl={session.profile.cover_url}
        location={session.profile.location}
        verified={!isPhotographer && session.profile.verified}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="order-2 lg:order-1">
          {isPhotographer ? (
            <>
              {session.profile.bio ? (
                <section className="mb-8">
                  <h2 className="font-head text-lg font-semibold text-text">
                    About
                  </h2>
                  <p className="mt-2 max-w-prose whitespace-pre-line text-pretty leading-relaxed text-muted">
                    {session.profile.bio}
                  </p>
                </section>
              ) : null}

              <section>
                <h2 className="font-head text-lg font-semibold text-text">
                  Published photos
                  {photos.length ? (
                    <span className="ml-2 text-sm font-medium text-muted">
                      {photos.length}
                    </span>
                  ) : null}
                </h2>
                {photos.length ? (
                  <PhotoGrid photos={photos} className="mt-4" />
                ) : (
                  <EmptyState
                    className="mt-4"
                    emoji="📷"
                    title="No published photos yet"
                    description={`${name || "This photographer"} hasn't published anything to the library so far.`}
                  />
                )}
              </section>
            </>
          ) : (
            <section>
              <h2 className="font-head text-lg font-semibold text-text">
                Mission
              </h2>
              {session.profile.mission ? (
                <p className="mt-2 max-w-prose whitespace-pre-line text-pretty leading-relaxed text-muted">
                  {session.profile.mission}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  This organization hasn&apos;t written a mission yet.
                </p>
              )}
            </section>
          )}
        </div>

        <aside className="order-1 lg:order-2">
          <Card>
            <dl className="flex flex-col gap-4">
              {isPhotographer ? (
                <>
                  <Detail label="School" value={session.profile.school} />
                  <Detail
                    label="Class of"
                    value={
                      session.profile.grad_year
                        ? String(session.profile.grad_year)
                        : null
                    }
                  />
                  <Detail
                    label="Instagram"
                    value={
                      session.profile.instagram
                        ? `@${session.profile.instagram}`
                        : null
                    }
                    href={
                      session.profile.instagram
                        ? `https://instagram.com/${session.profile.instagram}`
                        : null
                    }
                  />
                </>
              ) : (
                <>
                  <Detail label="Contact" value={session.profile.contact_name} />
                  <Detail label="EIN" value={session.profile.ein} />
                </>
              )}
              <Detail
                label="Website"
                value={
                  session.profile.website
                    ? session.profile.website.replace(/^https?:\/\//, "")
                    : null
                }
                href={session.profile.website}
              />
              <Detail
                label="Joined"
                value={new Date(session.profile.created_at).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" },
                )}
              />
            </dl>
          </Card>
        </aside>
      </div>
    </>
  );
}
