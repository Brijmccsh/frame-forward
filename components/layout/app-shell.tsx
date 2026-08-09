import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteFooter } from "./site-footer";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  /** Nav links for the top bar. Also shown in a scrollable strip on mobile. */
  nav?: ReactNode;
  /** Right-hand slot: avatar menu, sign-in button, etc. */
  actions?: ReactNode;
  children: ReactNode;
  /** Constrain and pad the main content. Turn off for full-bleed pages. */
  contained?: boolean;
  className?: string;
}

export function AppShell({
  nav,
  actions,
  children,
  contained = true,
  className,
}: AppShellProps) {
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

          {nav ? (
            <nav
              aria-label="Main"
              className="ml-4 hidden items-center gap-1 md:flex"
            >
              {nav}
            </nav>
          ) : null}

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {actions}
          </div>
        </div>

        {nav ? (
          <nav
            aria-label="Main"
            className="container-page flex items-center gap-1 overflow-x-auto pb-2.5 md:hidden"
          >
            {nav}
          </nav>
        ) : null}
      </header>

      <main
        id="main"
        className={cn(
          "flex-1",
          contained && "container-page py-8 sm:py-10",
          className,
        )}
      >
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
