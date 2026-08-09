import Image from "next/image";
import {
  Award,
  Camera,
  Check,
  HeartHandshake,
  MousePointerClick,
  ShieldCheck,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { HERO_IMAGES } from "@/lib/images";

const PHOTOGRAPHER_POINTS = [
  {
    icon: Camera,
    text: "Build a real portfolio with work that lives outside your camera roll.",
  },
  {
    icon: HeartHandshake,
    text: "See your photography used by causes you actually care about.",
  },
  {
    icon: Award,
    text: "Earn verified community-service hours as recognition for the work you gave.",
  },
];

const NONPROFIT_POINTS = [
  {
    icon: Check,
    text: "Free, authentic, high-quality imagery — no licensing fees, ever.",
  },
  {
    icon: MousePointerClick,
    text: "Request a photo in one click and reach the photographer directly.",
  },
  {
    icon: ShieldCheck,
    text: "Tell your mission beautifully, at no cost to your program budget.",
  },
];

export function ValueTwoUp() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Reveal as="section">
          <div
            id="for-photographers"
            className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={HERO_IMAGES[0].src}
                alt={HERO_IMAGES[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"
              />
            </div>

            <div className="flex flex-1 flex-col p-7 sm:p-8">
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-primary-ink">
                For photographers
              </p>
              <h2 className="mt-3 font-head text-2xl font-bold text-text sm:text-3xl">
                Your work, out in the world
              </h2>

              <ul className="mt-6 flex flex-col gap-4">
                {PHOTOGRAPHER_POINTS.map((point) => (
                  <li key={point.text} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-primary/10 text-primary-ink">
                      <point.icon aria-hidden className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-muted">
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2">
                <ButtonLink href="/login">Share your photography</ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" delay={120}>
          <div
            id="for-nonprofits"
            className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={HERO_IMAGES[2].src}
                alt={HERO_IMAGES[2].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"
              />
            </div>

            <div className="flex flex-1 flex-col p-7 sm:p-8">
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
                For nonprofits
              </p>
              <h2 className="mt-3 font-head text-2xl font-bold text-text sm:text-3xl">
                Imagery worthy of your mission
              </h2>

              <ul className="mt-6 flex flex-col gap-4">
                {NONPROFIT_POINTS.map((point) => (
                  <li key={point.text} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-accent/10 text-accent-ink">
                      <point.icon aria-hidden className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-muted">
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2">
                <ButtonLink href="/login" variant="accent">
                  Find photography
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
