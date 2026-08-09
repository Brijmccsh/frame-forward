import type { Metadata } from "next";
import { SignedInShell } from "@/components/layout/signed-in-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { requireProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Requests" };

export default async function RequestsPage() {
  const session = await requireProfile();
  const photographer = session.role === "photographer";

  return (
    <SignedInShell>
      <h1 className="font-head text-3xl font-bold text-text">
        {photographer ? "Requests & hours" : "My requests"}
      </h1>
      <p className="mt-2 text-muted">
        {photographer
          ? "Who asked to use your work, and the hours you've earned."
          : "Photos you've requested, and the ones you've confirmed using."}
      </p>

      <EmptyState
        className="mt-8"
        emoji="⏳"
        title="No requests yet"
        description="Requests, confirmations and the hours ledger arrive in a later phase."
      />
    </SignedInShell>
  );
}
