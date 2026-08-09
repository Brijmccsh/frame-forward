import type { Metadata } from "next";
import { SignedInShell } from "@/components/layout/signed-in-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "My library" };

export default async function LibraryPage() {
  const { profile } = await requireRole("photographer");

  return (
    <SignedInShell>
      <h1 className="font-head text-3xl font-bold text-text">
        Hey{profile.name ? `, ${profile.name.split(" ")[0]}` : ""} 👋
      </h1>
      <p className="mt-2 text-muted">This is your photo library.</p>

      <EmptyState
        className="mt-8"
        emoji="📷"
        title="Nothing here yet"
        description="Uploading, editing and publishing land in the next phase."
      />
    </SignedInShell>
  );
}
