import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Hero } from "@/components/marketing/hero";
import { Steps } from "@/components/marketing/steps";
import { CategoryShowcase } from "@/components/marketing/category-showcase";
import { Impact } from "@/components/marketing/impact";
import { ValueTwoUp } from "@/components/marketing/value-two-up";
import { StatsBand } from "@/components/marketing/stats-band";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Tells Google this is Frame Forward the organisation, not a phrase. */}
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />

      {/* Without JS the reveal animations never fire, so pin them visible. */}
      <noscript>
        <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-fg"
      >
        Skip to content
      </a>

      <MarketingNav />

      <main id="main" className="flex-1">
        <Hero />
        <Steps />
        <CategoryShowcase />
        <Impact />
        <ValueTwoUp />
        <StatsBand />
        <ClosingCta />
      </main>

      <SiteFooter />
    </div>
  );
}
