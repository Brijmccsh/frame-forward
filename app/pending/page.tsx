import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Clock, Mail, ShieldCheck, XCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HOME_PATH, getSessionProfile, requireUser } from "@/lib/auth";
import { ADMIN_EMAILS } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Application under review",
  robots: { index: false, follow: false },
};

/**
 * The waiting room. Applicants land here straight after onboarding and stay
 * until the founder approves them.
 *
 * Status is read live rather than cached, so the moment an application is
 * approved the next page load lets them through.
 */
export default async function PendingPage() {
  const user = await requireUser();
  const session = await getSessionProfile();

  // No profile yet — they haven't applied.
  if (!session) redirect("/onboarding");
  // Approved while they were sitting here.
  if (session.profile.status === "approved") redirect(HOME_PATH[session.role]);

  const denied = session.profile.status === "denied";
  const name =
    session.role === "photographer"
      ? session.profile.name
      : session.profile.org_name;
  const summary =
    session.role === "photographer"
      ? session.profile.tagline
      : session.profile.mission;
  const contact = ADMIN_EMAILS[0];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="container-page flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-lg animate-fade-up">
          <Card className="p-7 shadow-lg sm:p-8">
            <span
              aria-hidden
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-pill ${
                denied
                  ? "bg-danger/10 text-danger"
                  : "bg-primary/10 text-primary-ink"
              }`}
            >
              {denied ? (
                <XCircle className="h-6 w-6" />
              ) : (
                <Clock className="h-6 w-6" />
              )}
            </span>

            <h1 className="font-head text-2xl font-bold text-text sm:text-3xl">
              {denied
                ? "We couldn't approve this application"
                : "Your application is under review"}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              {denied ? (
                <>
                  After looking it over, we aren&apos;t able to approve this
                  account for Frame Forward right now. If you think that&apos;s
                  a mistake, reply to us and we&apos;ll take another look.
                </>
              ) : (
                <>
                  Thanks for applying{name ? `, ${name.split(" ")[0]}` : ""}.
                  A real person reads every application so nonprofits can trust
                  the work in this library. You&apos;ll get access here as soon
                  as it&apos;s approved — no need to reapply.
                </>
              )}
            </p>

            {/* What they submitted */}
            <div className="mt-7 flex items-start gap-4 rounded-md border border-border bg-surface-2/60 p-4">
              <Avatar
                src={session.profile.avatar_url}
                name={name}
                size="lg"
                rounded={session.role === "nonprofit" ? "md" : "full"}
              />
              <div className="min-w-0">
                <p className="truncate font-head text-base font-semibold text-text">
                  {name || "Your profile"}
                </p>
                <p className="truncate text-xs text-muted">{user.email}</p>
                <p className="mt-1 text-2xs font-semibold uppercase tracking-wide text-muted">
                  {session.role === "photographer"
                    ? "Photographer"
                    : "Nonprofit"}
                </p>
                {summary ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                    {summary}
                  </p>
                ) : null}
              </div>
            </div>

            {!denied ? (
              <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted">
                <ShieldCheck
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                />
                Reviews are usually quick. Nothing you submitted is public yet.
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <ButtonLink href={`mailto:${contact}`} variant="outline" size="sm">
                <Mail aria-hidden className="h-4 w-4" />
                {denied ? "Get in touch" : "Ask about my application"}
              </ButtonLink>
              <p className="text-xs text-muted">{contact}</p>
            </div>
          </Card>

          <p className="mt-6 text-center font-head text-sm italic text-muted">
            Teens with a vision. Nonprofits with a mission.
          </p>
        </div>
      </main>
    </div>
  );
}
