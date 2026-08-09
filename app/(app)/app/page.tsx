import type { Metadata } from "next";
import { PhotoManageCard } from "@/components/photos/photo-manage-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stat, StatRow } from "@/components/ui/stat";
import { requireRole } from "@/lib/auth";
import { listCategories } from "@/lib/queries/categories";
import { listByPhotographer } from "@/lib/queries/photos";

export const metadata: Metadata = { title: "My library" };

export default async function LibraryPage() {
  const { profile } = await requireRole("photographer");
  const [photos, categories] = await Promise.all([
    listByPhotographer(profile.id, { includeUnpublished: true }),
    listCategories(),
  ]);

  const published = photos.filter((photo) => photo.is_published).length;
  const firstName = profile.name?.split(" ")[0];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-head text-3xl font-bold text-text sm:text-4xl">
            {firstName ? `Hey, ${firstName}` : "Your library"} 👋
          </h1>
          <p className="mt-2 text-muted">
            Everything you&apos;ve uploaded, published or not.
          </p>
        </div>
        <ButtonLink href="/app/upload" size="lg">
          <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
            <path
              d="M10 4.5v11M4.5 10h11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add a photo
        </ButtonLink>
      </div>

      {photos.length ? (
        <>
          <StatRow className="mt-8">
            <Stat emoji="🖼️" label="Photos" value={photos.length} />
            <Stat
              emoji="🌍"
              label="Published"
              value={published}
              hint="Visible to nonprofits in Browse"
              tone="accent"
            />
            <Stat
              emoji="✏️"
              label="Drafts"
              value={photos.length - published}
              hint="Only you can see these"
            />
          </StatRow>

          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <li key={photo.id}>
                <PhotoManageCard photo={photo} categories={categories} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState
          className="mt-10"
          emoji="📷"
          title="Your library is waiting"
          description="Upload your first photo and it goes straight into the library nonprofits browse. Every one they use earns you service hours."
          action={
            <ButtonLink href="/app/upload" size="lg">
              Upload your first photo
            </ButtonLink>
          }
        />
      )}
    </>
  );
}
