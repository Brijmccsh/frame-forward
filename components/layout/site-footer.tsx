import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Logo size="sm" />
          <p className="font-head text-sm italic text-muted">{BRAND.tagline}</p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-muted sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/browse" className="link-underline hover:text-text">
              Browse photos
            </Link>
            <Link href="/login" className="link-underline hover:text-text">
              Sign in
            </Link>
          </nav>
          <p className="text-xs text-muted/80">
            © {new Date().getFullYear()} Frame Forward
          </p>
        </div>
      </div>
    </footer>
  );
}
