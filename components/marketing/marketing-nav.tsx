import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

const LINKS = [
  { href: "#for-photographers", label: "For Photographers" },
  { href: "#for-nonprofits", label: "For Nonprofits" },
  { href: "/browse", label: "Browse" },
  { href: "#how-it-works", label: "How it works" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border glass">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav
          aria-label="Main"
          className="ml-6 hidden items-center gap-1 lg:flex"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-pill px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/login" size="sm">
            Sign in / Join
          </ButtonLink>
        </div>
      </div>

      {/* Compact link row for small screens */}
      <nav
        aria-label="Main"
        className="container-page flex items-center gap-1 overflow-x-auto pb-2.5 lg:hidden"
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-pill px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
