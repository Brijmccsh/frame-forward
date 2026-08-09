import { FolderOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { UploadForm } from "@/components/photos/upload-form";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth";
import { listCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "Upload a photo" };

export default async function UploadPage() {
  const { profile } = await requireRole("photographer");
  const categories = await listCategories();

  return (
    <>
      <Link
        href="/app"
        className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-text"
      >
        <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
          <path
            d="M16 10H5m0 0l4.5-4.5M5 10l4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to library
      </Link>

      <h1 className="mt-5 font-head text-3xl font-bold text-text sm:text-4xl">
        Add a photo
      </h1>
      <p className="mt-2 max-w-prose text-pretty text-muted">
        Pick your shot, drop it in a category, and give it a title. Nonprofits
        search by category, so choosing well helps your work get found.
      </p>

      <div className="mt-8">
        {categories.length ? (
          <UploadForm userId={profile.id} categories={categories} />
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="No categories available"
            description="Categories haven't loaded. Refresh the page, and if it keeps happening let an admin know."
          />
        )}
      </div>
    </>
  );
}
