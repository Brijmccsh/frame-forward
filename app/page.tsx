import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { HeroCollage } from "@/components/marketing/hero-collage";
import { HowItWorks } from "@/components/marketing/how-it-works";

export default function HomePage() {
  return (
    <AppShell
      contained={false}
      actions={
        <ButtonLink size="sm" href="/login">
          Sign in / Join
        </ButtonLink>
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Soft brand wash behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-pill bg-brand-lpink/35 blur-3xl dark:bg-brand-pink/10" />
          <div className="absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-pill bg-brand-lteal/40 blur-3xl dark:bg-brand-teal/10" />
        </div>

        <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-pill border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <span aria-hidden>📸</span>
              For student photographers &amp; nonprofits
            </p>

            <h1 className="text-balance font-head text-5xl font-bold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-7xl">
              Photography that{" "}
              <span className="relative whitespace-nowrap text-primary">
                gives back.
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-primary/45"
                >
                  <path
                    d="M2 8C60 3 130 2 298 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-7 max-w-prose text-pretty text-lg leading-relaxed text-muted">
              Share your photos with nonprofits that need them. They get
              beautiful images for free — you get real community service hours
              for every photo they use.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href="/login" size="lg">
                Sign in / Join
                <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
                  <path
                    d="M4 10h11m0 0l-4.5-4.5M15 10l-4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </ButtonLink>
              <p className="text-sm text-muted">
                Free forever. No password to remember.
              </p>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8">
              {[
                { value: "10", label: "photo categories" },
                { value: "3 hrs", label: "earned per photo used" },
                { value: "$0", label: "cost to nonprofits" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-head text-3xl font-bold text-text">
                      {stat.value}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroCollage />
        </div>
      </section>

      <HowItWorks />

      {/* Closing call to action */}
      <section className="container-page pb-20 pt-4 sm:pb-24">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface px-6 py-14 text-center shadow-md sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-brand-lpink/40 to-transparent dark:from-brand-pink/10"
          />
          <h2 className="relative font-head text-3xl font-bold text-text sm:text-4xl">
            Your photos are already good enough.
          </h2>
          <p className="relative mx-auto mt-4 max-w-prose text-pretty text-muted">
            Somewhere out there, a nonprofit needs exactly the shot sitting on
            your camera roll. Put it to work.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/login" size="lg">
              Get started
            </ButtonLink>
            <Link
              href="/browse"
              className="link-underline inline-flex items-center px-2 py-3 text-sm font-semibold text-muted transition-colors hover:text-text"
            >
              Browse the library first
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
