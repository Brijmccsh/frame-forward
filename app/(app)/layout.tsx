import type { ReactNode } from "react";
import { SignedInShell } from "@/components/layout/signed-in-shell";

/**
 * Shell for every signed-in page. Living in a layout means the nav stays put
 * during navigation and route-level loading.tsx skeletons render inside it.
 */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <SignedInShell>{children}</SignedInShell>;
}
