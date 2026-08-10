import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { BRAND } from "@/lib/brand";

const LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#for-photographers", label: "For photographers" },
  { href: "/#for-nonprofits", label: "For nonprofits" },
  { href: "/login", label: "Sign in" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-10 py-14 lg:flex-row lg:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <Logo size="sm" />
          <p className="font-head text-base italic text-muted">
            {BRAND.tagline}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            A place for student photographers and the organizations doing the
            work to find each other.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:items-end">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="flex items-center gap-2 text-sm text-muted">
            <Mail aria-hidden className="h-4 w-4 text-accent-ink" />
            Contact us at{" "}
            <a
              href="mailto:founders@frameforward.org"
              className="link-underline font-medium text-accent-ink"
            >
              founders@frameforward.org
            </a>
          </p>

          <p className="text-xs text-muted/80">© 2026 Frame Forward</p>
        </div>
      </div>
    </footer>
  );
}
