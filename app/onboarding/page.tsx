import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { RoleCards } from "@/components/onboarding/role-cards";
import { PhotographerForm } from "@/components/profile/photographer-form";
import { NonprofitForm } from "@/components/profile/nonprofit-form";
import { HOME_PATH, getSessionProfile, requireUser } from "@/lib/auth";
import type { Role } from "@/lib/types";

export const metadata: Metadata = { title: "Welcome" };

const isRole = (value: string | undefined): value is Role =>
  value === "photographer" || value === "nonprofit";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const user = await requireUser();

  // Already onboarded — nothing to do here.
  const session = await getSessionProfile();
  if (session) redirect(HOME_PATH[session.role]);

  const role = isRole(searchParams.role) ? searchParams.role : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="container-page flex-1 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-3xl animate-fade-up">
          {role ? (
            <>
              <Link
                href="/onboarding"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-text"
              >
                <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
                  <path
                    d="M16 10H5m0 0l4.5-4.5M5 10l4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Not quite — pick again
              </Link>

              <h1 className="mt-5 font-head text-3xl font-bold text-text sm:text-4xl">
                {role === "photographer"
                  ? "Set up your photographer profile"
                  : "Set up your organization"}
              </h1>
              <p className="mt-2 max-w-prose text-pretty text-muted">
                {role === "photographer"
                  ? "Only your name is required — everything else you can fill in whenever."
                  : "Only your organization's name is required — the rest helps photographers say yes."}
              </p>
              <p className="mt-2 text-sm text-muted">
                Signing up as{" "}
                <span className="font-semibold text-text">{user.email}</span>
              </p>

              <div className="mt-8">
                {role === "photographer" ? (
                  <PhotographerForm userId={user.id} mode="create" />
                ) : (
                  <NonprofitForm userId={user.id} mode="create" />
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">
                One quick thing
              </p>
              <h1 className="mt-3 font-head text-4xl font-bold text-text sm:text-5xl">
                Which one are you?
              </h1>
              <p className="mt-3 max-w-prose text-pretty text-lg text-muted">
                This sets up the right home for you. You can&apos;t change it
                later, so pick the one that fits.
              </p>

              <div className="mt-10">
                <RoleCards />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
