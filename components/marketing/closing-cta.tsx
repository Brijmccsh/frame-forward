import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { HERO_IMAGES } from "@/lib/images";

export function ClosingCta() {
  return (
    <section className="pb-24 sm:pb-28">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-border shadow-lg">
            <Image
              src={HERO_IMAGES[3].src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              unoptimized
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-brand-navy/70 backdrop-blur-[2px]"
            />

            <div className="relative px-6 py-20 text-center sm:px-12 sm:py-24">
              <h2 className="text-balance font-head text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Your photos are already good enough.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/85">
                Somewhere out there, an organization needs exactly the shot
                sitting on your camera roll. Give it somewhere to go.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/login" size="lg">
                  Get started
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href="/browse"
                  size="lg"
                  className="border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:shadow-none"
                >
                  Browse the library
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
