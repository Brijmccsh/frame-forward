import type { ReactNode } from "react";
import { AppShell } from "./app-shell";
import { NavLink } from "./nav-link";
import { UserMenu } from "./user-menu";
import { requireProfile } from "@/lib/auth";
import type { Role } from "@/lib/types";

const NAV: Record<Role, Array<{ href: string; label: string }>> = {
  photographer: [
    { href: "/app", label: "My library" },
    { href: "/browse", label: "Explore" },
    { href: "/app/requests", label: "Requests & hours" },
  ],
  nonprofit: [
    { href: "/browse", label: "Browse" },
    { href: "/requests", label: "My requests" },
  ],
};

/**
 * App shell for signed-in pages: role-aware nav plus the account menu.
 * Redirects to onboarding when the user has no profile yet.
 */
export async function SignedInShell({
  children,
  contained = true,
}: {
  children: ReactNode;
  contained?: boolean;
}) {
  const session = await requireProfile();

  const name =
    session.role === "photographer"
      ? session.profile.name
      : session.profile.org_name;

  return (
    <AppShell
      contained={contained}
      nav={NAV[session.role].map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          // /app would otherwise stay active on /app/requests and /app/upload.
          exact={item.href === "/app"}
        >
          {item.label}
        </NavLink>
      ))}
      actions={
        <UserMenu
          role={session.role}
          name={name}
          email={session.profile.email}
          avatarUrl={session.profile.avatar_url}
        />
      }
    >
      {children}
    </AppShell>
  );
}
