import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";
import type {
  PublicNonprofit,
  PublicPhoto,
  PublicPhotographer,
} from "@/lib/queries/public";

/**
 * Structured data. This is what lets Google show the site as an organisation,
 * surface photographs in image results, and render breadcrumbs under a result.
 */

export function organizationJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: "Frame Forward",
    url: base,
    logo: BRAND.logoUrl,
    email: "founders@frameforward.org",
    description: BRAND.description,
    slogan: BRAND.tagline,
  };
}

export function webSiteJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: "Frame Forward",
    description: BRAND.description,
    publisher: { "@id": `${base}/#organization` },
  };
}

export function breadcrumbJsonLd(trail: Array<{ name: string; path: string }>) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

export function photoJsonLd(photo: PublicPhoto) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${base}/photo/${photo.slug}#image`,
    contentUrl: photo.imageUrl,
    url: `${base}/photo/${photo.slug}`,
    name: photo.title ?? "Photograph",
    description: photo.caption ?? undefined,
    datePublished: photo.created_at,
    creditText: photo.photographer?.name ?? undefined,
    creator: photo.photographer
      ? {
          "@type": "Person",
          name: photo.photographer.name ?? "Student photographer",
          url: `${base}/photographers/${photo.photographer.slug}`,
        }
      : undefined,
    // Nonprofits may use these free of charge after requesting them.
    acquireLicensePage: `${base}/photo/${photo.slug}`,
    isFamilyFriendly: true,
  };
}

export function photographerJsonLd(
  photographer: PublicPhotographer,
  photos: PublicPhoto[],
) {
  const base = siteUrl();
  const sameAs = [
    photographer.website,
    photographer.instagram
      ? `https://instagram.com/${photographer.instagram}`
      : null,
  ].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/photographers/${photographer.slug}#person`,
    name: photographer.name ?? "Student photographer",
    url: `${base}/photographers/${photographer.slug}`,
    image: photographer.avatar_url ?? undefined,
    description: photographer.tagline ?? photographer.bio ?? undefined,
    jobTitle: "Photographer",
    homeLocation: photographer.location ?? undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    memberOf: { "@id": `${base}/#organization` },
    // Lets a name search surface the work, not just the profile.
    subjectOf: photos.slice(0, 12).map((photo) => ({
      "@type": "ImageObject",
      contentUrl: photo.imageUrl,
      url: `${base}/photo/${photo.slug}`,
      name: photo.title ?? "Photograph",
    })),
  };
}

export function collectionJsonLd({
  name,
  description,
  path,
  photos,
}: {
  name: string;
  description: string;
  path: string;
  photos: PublicPhoto[];
}) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: `${base}${path}`,
    name,
    description,
    isPartOf: { "@id": `${base}/#website` },
    hasPart: photos.slice(0, 24).map((photo) => ({
      "@type": "ImageObject",
      contentUrl: photo.imageUrl,
      url: `${base}/photo/${photo.slug}`,
      name: photo.title ?? "Photograph",
    })),
  };
}

/**
 * The photographer index as an ItemList.
 *
 * The other three listing pages describe themselves with CollectionPage, which
 * models a page *of images*. This one lists people, so an ItemList of the same
 * Person entities their profile pages declare keeps the graph consistent.
 */
export function photographerListJsonLd(photographers: PublicPhotographer[]) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: `${base}/photographers`,
    name: "Student photographers",
    numberOfItems: photographers.length,
    isPartOf: { "@id": `${base}/#website` },
    itemListElement: photographers.map((photographer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${base}/photographers/${photographer.slug}`,
      name: photographer.name ?? "Student photographer",
    })),
  };
}

/**
 * A nonprofit's profile. Its own @id keeps it distinct from Frame Forward's
 * Organization, and memberOf ties it back to the platform the way a
 * photographer's Person does.
 */
export function nonprofitJsonLd(nonprofit: PublicNonprofit) {
  const base = siteUrl();
  const url = `${base}/nonprofits/${nonprofit.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: nonprofit.org_name ?? "Nonprofit",
    url,
    logo: nonprofit.avatar_url ?? undefined,
    image: nonprofit.cover_url ?? undefined,
    description: nonprofit.mission ?? undefined,
    location: nonprofit.location ?? undefined,
    sameAs: nonprofit.website ? [nonprofit.website] : undefined,
    memberOf: { "@id": `${base}/#organization` },
  };
}

/**
 * The nonprofit directory as an ItemList. Each entry is the same Organization
 * its profile page declares, joined by @id so the graph stays one graph.
 */
export function nonprofitListJsonLd(nonprofits: PublicNonprofit[]) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: `${base}/nonprofits`,
    name: "Nonprofits",
    numberOfItems: nonprofits.length,
    isPartOf: { "@id": `${base}/#website` },
    itemListElement: nonprofits.map((nonprofit, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Organization",
        "@id": `${base}/nonprofits/${nonprofit.slug}#organization`,
        name: nonprofit.org_name ?? "Nonprofit",
        url: `${base}/nonprofits/${nonprofit.slug}`,
      },
    })),
  };
}

/** Renders a JSON-LD script tag. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
