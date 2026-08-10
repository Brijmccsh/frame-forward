import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { NavLink } from "@/components/layout/nav-link";
import { SignedInShell } from "@/components/layout/signed-in-shell";
import { UserMenu } from "@/components/layout/user-menu";
import {
  ONBOARDING_PATH,
  PENDING_PATH,
  getSessionProfile,
  requireUser,
} from "@/lib/auth";
import { isAdminEmail } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

/**
 * Shell for every signed-in page. Living in a layout means the nav stays put
 * during navigation and route-level loading.tsx skeletons render inside it.
 *
 * The founder may have no photographer/nonprofit profile of their own, but
 * still needs to open an applicant's public profile from the review queue —
 * so an admin without a profile gets a light shell rather than a redirect.
 */
export default async function AppGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  const session = await getSessionProfile();

  if (!session) {
    if (!isAdminEmail(user.email)) redirect(ONBOARDING_PATH);

    return (
      <AppShell
        nav={<NavLink href="/admin/applications">Applications</NavLink>}
        actions={
          <UserMenu
            role="photographer"
            name={user.email ?? "Founder"}
            email={user.email ?? null}
            avatarUrl={null}
            adminOnly
          />
        }
      >
        {children}
      </AppShell>
    );
  }

  if (session.profile.status !== "approved") redirect(PENDING_PATH);

  return <SignedInShell>{children}</SignedInShell>;
}
