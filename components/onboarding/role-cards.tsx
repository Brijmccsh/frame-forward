import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, Check, HeartHandshake } from "lucide-react";
import { HERO_IMAGES } from "@/lib/images";

const roles = [
  {
    href: "/onboarding?role=photographer",
    icon: Camera,
    image: HERO_IMAGES[0],
    title: "I'm a Photographer",
    body: "Share your photography with nonprofits and see your work out in the world, doing good.",
    bullets: [
      "Upload to a shared library",
      "Hear directly from organizations",
      "Verified service hours",
    ],
    hover: "hover:border-brand-pink/60 focus-visible:ring-brand-pink",
    iconClass: "bg-primary/10 text-primary-ink",
  },
  {
    href: "/onboarding?role=nonprofit",
    icon: HeartHandshake,
    image: HERO_IMAGES[2],
    title: "We're a Nonprofit",
    body: "Find authentic photography from student artists and use it freely to tell your story.",
    bullets: ["Free to use", "Save a shortlist", "Reach photographers directly"],
    hover: "hover:border-brand-teal/60 focus-visible:ring-brand-teal",
    iconClass: "bg-accent/10 text-accent-ink",
  },
];

export function RoleCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {roles.map((role) => (
        <Link
          key={role.href}
          href={role.href}
          className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-left shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${role.hover}`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={role.image.src}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 45vw"
              unoptimized
              className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent"
            />
          </div>

          <div className="flex flex-1 flex-col p-6">
            <span
              aria-hidden
              className={`mb-5 flex h-11 w-11 items-center justify-center rounded-md ${role.iconClass}`}
            >
              <role.icon className="h-5 w-5" />
            </span>

            <h2 className="font-head text-xl font-bold text-text">
              {role.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {role.body}
            </p>

            <ul className="mt-5 flex flex-col gap-2 text-sm text-muted">
              {role.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2">
                  <Check
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-accent-ink"
                  />
                  {bullet}
                </li>
              ))}
            </ul>

            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-text">
              Continue
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 ease-soft group-hover:translate-x-1"
              />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
