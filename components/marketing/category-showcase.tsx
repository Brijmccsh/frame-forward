import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./reveal";
import { CATEGORY_IMAGES, FALLBACK_CATEGORIES } from "@/lib/images";

export function CategoryShowcase() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="py-20 sm:py-24"
    >
      <div className="container-page">
        <Reveal className="max-w-prose">
          <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
            The library
          </p>
          <h2
            id="categories-heading"
            className="mt-3 font-head text-4xl font-bold tracking-tight text-text sm:text-5xl"
          >
            Every kind of story
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
            Ten categories, shaped by what students actually shoot — and by
            what the organizations doing the work actually need.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FALLBACK_CATEGORIES.map((category, index) => (
            <Reveal as="li" key={category.slug} delay={(index % 5) * 70}>
              <Link
                href={`/browse?category=${category.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-soft hover:-translate-y-1.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg dark:ring-white/10"
              >
                <Image
                  src={CATEGORY_IMAGES[category.slug]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-110"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/25 to-transparent transition-opacity duration-300 group-hover:from-brand-navy/90"
                />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block font-head text-sm font-semibold leading-snug text-white sm:text-base">
                    {category.name}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
