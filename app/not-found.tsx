import { Telescope } from "lucide-react";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="container-page flex flex-1 items-center justify-center py-16">
        <div className="max-w-md text-center">
          <span
            aria-hidden
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill bg-surface-2 text-muted"
          >
            <Telescope className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-head text-3xl font-bold text-text sm:text-4xl">
            Nothing in this frame
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted">
            This page doesn&apos;t exist — or it belongs to someone else. Let&apos;s
            get you back to the good stuff.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/browse">Browse photos</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Home
            </ButtonLink>
          </div>
        </div>
      </main>
    </div>
  );
}
