import type { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Shell for the crawlable pages. Deliberately outside the (app) group: these
 * render for signed-out visitors and search engines, and never touch auth.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-fg"
      >
        Skip to content
      </a>
      <MarketingNav />
      <main id="main" className="container-page flex-1 py-10 sm:py-14">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
