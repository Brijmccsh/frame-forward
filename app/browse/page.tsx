import type { Metadata } from "next";
import { SignedInShell } from "@/components/layout/signed-in-shell";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Browse" };

export default async function BrowsePage() {
  return (
    <SignedInShell>
      <h1 className="font-head text-3xl font-bold text-text">Browse photos</h1>
      <p className="mt-2 text-muted">
        Every published photo, sorted into categories.
      </p>

      <EmptyState
        className="mt-8"
        emoji="🖼️"
        title="The library is warming up"
        description="Categories, the photo grid and saving favourites arrive in the next phase."
      />
    </SignedInShell>
  );
}
