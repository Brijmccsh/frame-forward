/**
 * Local seed photography used on the marketing pages.
 * Files live in /public/seed and are rendered with next/image.
 */

export interface SeedImage {
  src: string;
  alt: string;
}

export const HERO_IMAGES: SeedImage[] = [
  {
    src: "/seed/hero-01-photographer.jpg",
    alt: "A young photographer framing a shot with a camera",
  },
  {
    src: "/seed/hero-02-portrait.jpg",
    alt: "A portrait taken in soft natural light",
  },
  {
    src: "/seed/hero-03-volunteers.jpg",
    alt: "Volunteers working together outdoors",
  },
  {
    src: "/seed/hero-04-landscape.jpg",
    alt: "An open landscape at golden hour",
  },
];

export const IMPACT_IMAGE: SeedImage = {
  src: "/seed/impact-community.jpg",
  alt: "People gathered together in their community",
};

/** Category slug -> representative photo. Keys match `categories.slug`. */
export const CATEGORY_IMAGES: Record<string, string> = {
  "nature-wildlife": "/seed/cat-nature-wildlife.jpg",
  "people-portraits": "/seed/cat-people-portraits.jpg",
  "community-events": "/seed/cat-community-events.jpg",
  "urban-architecture": "/seed/cat-urban-architecture.jpg",
  "animals-pets": "/seed/cat-animals-pets.jpg",
  "action-sports": "/seed/cat-action-sports.jpg",
  "food-culture": "/seed/cat-food-culture.jpg",
  "fine-art": "/seed/cat-fine-art.jpg",
  "environmental-conservation": "/seed/cat-environmental-conservation.jpg",
  "volunteering-service": "/seed/cat-volunteering-service.jpg",
};

export const categoryImage = (slug: string): string | null =>
  CATEGORY_IMAGES[slug] ?? null;

/** Fallback list used when the database can't be reached at render time. */
export const FALLBACK_CATEGORIES = [
  { slug: "nature-wildlife", name: "Nature & Wildlife" },
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
