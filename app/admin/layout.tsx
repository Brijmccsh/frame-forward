import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NavLink } from "@/components/layout/nav-link";
import { SiteFooter } from "@/components/layout/site-footer";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSessionProfile, requireAdmin } from "@/lib/auth";

/**
 * Admin shell. Kept separate from the (app) group because the founder may not
 * have a photographer/nonprofit profile of their own — the (app) layout
 * requires one.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();
  // The founder may also be a normal member; if so, keep their way back in.
  const session = await getSessionProfile();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-fg"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border glass">
        <div className="container-page flex h-16 items-center gap-3">
          <Logo />

          <span className="ml-1 hidden items-center gap-1.5 rounded-pill border border-accent/30 bg-accent/10 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wide text-accent-ink sm:inline-flex">
            <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
            Founder
          </span>

          <nav aria-label="Admin" className="ml-4 flex items-center gap-1">
            <NavLink href="/admin/applications">Applications</NavLink>
            {session ? <NavLink href="/browse">Back to app</NavLink> : null}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <UserMenu
                role={session.role}
                name={
                  session.role === "photographer"
                    ? session.profile.name
                    : session.profile.org_name
                }
                email={session.profile.email}
                avatarUrl={session.profile.avatar_url}
              />
            ) : (
              <UserMenu
                role="photographer"
                name={user.email ?? "Founder"}
                email={user.email ?? null}
                avatarUrl={null}
                adminOnly
              />
            )}
          </div>
        </div>
      </header>

      <main id="main" className="container-page flex-1 py-8 sm:py-10">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
