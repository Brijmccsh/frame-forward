import Image from "next/image";
import { FileText, Megaphone, Send, Sprout } from "lucide-react";
import { Reveal } from "./reveal";
import { IMPACT_IMAGE } from "@/lib/images";

const USES = [
  { icon: Sprout, label: "Conservation reports" },
  { icon: FileText, label: "Grant applications" },
  { icon: Send, label: "Newsletters" },
  { icon: Megaphone, label: "Advocacy campaigns" },
];

export function Impact() {
  return (
    <section
      aria-labelledby="impact-heading"
      className="border-y border-border bg-surface-2/50 py-20 sm:py-24"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
            Why it matters
          </p>
          <h2
            id="impact-heading"
            className="mt-3 text-balance font-head text-4xl font-bold tracking-tight text-text sm:text-5xl"
          >
            Your photo does something real.
          </h2>
          <p className="mt-5 max-w-prose text-pretty text-lg leading-relaxed text-muted">
            A photograph you took on a Saturday morning becomes the cover of a
            conservation report. The image in a grant application that gets
            funded. The face of a newsletter that reaches thousands, or an
            advocacy campaign that changes someone&apos;s mind.
          </p>
          <p className="mt-4 max-w-prose text-pretty leading-relaxed text-muted">
            Most nonprofits can&apos;t afford professional photography. They end
            up with stock images that feel like nobody&apos;s. Your work gives
            them something honest to show the world.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {USES.map((use) => (
              <li
                key={use.label}
                className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text shadow-xs"
              >
                <use.icon aria-hidden className="h-4 w-4 text-accent-ink" />
                {use.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <figure className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <Image
              src={IMPACT_IMAGE.src}
              alt={IMPACT_IMAGE.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              className="object-cover"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
