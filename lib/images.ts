/**
 * Marketing photography, pre-optimised at build time by
 * `npm run optimize:seed` (sources live in assets/seed, which is not served).
 *
 * These are rendered with `unoptimized` on next/image: they're already the
 * right size and format, so routing them through the runtime optimizer would
 * burn CPU and memory to produce the same bytes.
 */

export interface SeedImage {
  src: string;
  alt: string;
}

export const HERO_IMAGES: SeedImage[] = [
  {
    src: "/seed/hero-01-photographer.webp",
    alt: "A young photographer framing a shot with a camera",
  },
  {
    src: "/seed/hero-02-portrait.webp",
    alt: "A portrait taken in soft natural light",
  },
  {
    src: "/seed/hero-03-volunteers.webp",
    alt: "Volunteers working together outdoors",
  },
  {
    src: "/seed/hero-04-landscape.webp",
    alt: "An open landscape at golden hour",
  },
];

export const IMPACT_IMAGE: SeedImage = {
  src: "/seed/impact-community.webp",
  alt: "People gathered together in their community",
};

/** Category slug -> representative photo. Keys match `categories.slug`. */
export const CATEGORY_IMAGES: Record<string, string> = {
  "nature-landscapes": "/seed/cat-nature-wildlife.webp",
  "people-portraits": "/seed/cat-people-portraits.webp",
  "community-events": "/seed/cat-community-events.webp",
  "urban-architecture": "/seed/cat-urban-architecture.webp",
  "animals-pets": "/seed/cat-animals-pets.webp",
  "action-sports": "/seed/cat-action-sports.webp",
  "food-culture": "/seed/cat-food-culture.webp",
  "fine-art": "/seed/cat-fine-art.webp",
  "environmental-conservation": "/seed/cat-environmental-conservation.webp",
  "volunteering-service": "/seed/cat-volunteering-service.webp",
};

export const categoryImage = (slug: string): string | null =>
  CATEGORY_IMAGES[slug] ?? null;

/** Fallback list used when the database can't be reached at render time. */
export const FALLBACK_CATEGORIES = [
  { slug: "nature-landscapes", name: "Nature & Landscapes" },
  { slug: "people-portraits", name: "People & Portraits" },
  { slug: "community-events", name: "Community & Events" },
  { slug: "urban-architecture", name: "Urban & Architecture" },
  { slug: "animals-pets", name: "Animals & Pets" },
  { slug: "action-sports", name: "Action & Sports" },
  { slug: "food-culture", name: "Food & Culture" },
  { slug: "fine-art", name: "Black & White / Fine Art" },
  { slug: "environmental-conservation", name: "Environmental & Conservation" },
  { slug: "volunteering-service", name: "Volunteering & Service" },
] as const;
