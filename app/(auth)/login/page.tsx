import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/auth/login-form";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Frame Forward with a one-time code.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-pill bg-brand-lpink/30 blur-3xl dark:bg-brand-pink/10" />
        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-pill bg-brand-lteal/35 blur-3xl dark:bg-brand-teal/10" />
      </div>

      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="container-page flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md animate-fade-up">
          <LoginForm next={searchParams.next} />
          <p className="mt-8 text-center font-head text-sm italic text-muted">
            {BRAND.tagline}
          </p>
        </div>
      </main>
    </div>
  );
}
