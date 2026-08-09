import Image from "next/image";
import { ArrowRight, Camera, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { HERO_IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

interface HeroTile {
  image: { src: string; alt: string };
  aspect: string;
  tilt: string;
}

/**
 * The float animation and the tilt both write `transform`, so they live on
 * separate elements — otherwise the keyframes cancel the rotation.
 */
function Tile({
  tile,
  delay,
  priority,
}: {
  tile: HeroTile;
  delay: number;
  priority: boolean;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className="motion-safe:animate-float"
    >
      <figure
        className={cn(
          "group relative overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5 transition-transform duration-500 ease-soft hover:rotate-0 hover:scale-[1.02] dark:ring-white/10",
          tile.aspect,
          tile.tilt,
        )}
      >
        <Image
          src={tile.image.src}
          alt={tile.image.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          unoptimized
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
        />
      </figure>
    </div>
  );
}

/** Layered photo collage — two columns of offset, gently floating tiles. */
function HeroCollage() {
  const tiles = [
    { image: HERO_IMAGES[0], aspect: "aspect-[4/5]", tilt: "-rotate-2" },
    { image: HERO_IMAGES[3], aspect: "aspect-[5/4]", tilt: "rotate-1" },
    { image: HERO_IMAGES[2], aspect: "aspect-[5/4]", tilt: "rotate-2" },
    { image: HERO_IMAGES[1], aspect: "aspect-[4/5]", tilt: "-rotate-1" },
  ];

  return (
    <div className="relative">
      {/* Warm wash behind the photographs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 opacity-70"
      >
        <div className="absolute left-0 top-4 h-64 w-64 rounded-pill bg-brand-lpink/50 blur-3xl dark:bg-brand-pink/10" />
        <div className="absolute bottom-0 right-4 h-72 w-72 rounded-pill bg-brand-lteal/50 blur-3xl dark:bg-brand-teal/10" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        <div className="flex translate-y-5 flex-col gap-4 sm:gap-5">
          {tiles.slice(0, 2).map((tile, index) => (
            <Tile key={tile.image.src} tile={tile} delay={index * 1.4} priority={index === 0} />
          ))}
        </div>

        <div className="flex -translate-y-4 flex-col gap-4 sm:gap-5">
          {tiles.slice(2).map((tile, index) => (
            <Tile
              key={tile.image.src}
              tile={tile}
              delay={index * 1.4 + 0.7}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
        <div className="animate-fade-up">
          <p className="mb-6 inline-flex items-center gap-2 rounded-pill border border-border bg-surface/80 px-3.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.14em] text-muted">
            <Camera aria-hidden className="h-3.5 w-3.5 text-accent-ink" />
            For student photographers &amp; nonprofits
          </p>

          <h1 className="text-balance font-head text-5xl font-bold leading-[1.03] tracking-tight text-text sm:text-6xl lg:text-7xl">
            Photography that{" "}
            <span className="relative whitespace-nowrap text-primary-ink">
              gives back.
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-primary/50"
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

          <p className="mt-8 max-w-prose text-pretty text-lg leading-relaxed text-muted">
            A purpose-driven platform connecting student photographers with
            nonprofits that need real, powerful imagery to tell their story.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/login" size="lg">
              Share your photography
              <ArrowRight aria-hidden className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/browse" size="lg" variant="outline">
              <Search aria-hidden className="h-4 w-4" />
              Browse the gallery
            </ButtonLink>
          </div>
        </div>

        <HeroCollage />
      </div>
    </section>
  );
}
