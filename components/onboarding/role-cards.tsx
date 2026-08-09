import Link from "next/link";

const roles = [
  {
    href: "/onboarding?role=photographer",
    emoji: "📸",
    title: "I'm a Photographer",
    body: "Share your photos with nonprofits and earn community service hours every time one gets used.",
    bullets: ["Upload to a shared library", "Get requests by email", "Track your hours"],
    accent:
      "hover:border-brand-pink/70 focus-visible:ring-brand-pink group-hover:text-brand-pink",
    wash: "from-brand-lpink/60 to-brand-pink/25 dark:from-brand-pink/20 dark:to-brand-pink/5",
  },
  {
    href: "/onboarding?role=nonprofit",
    emoji: "🤝",
    title: "We're a Nonprofit",
    body: "Browse real photography from student artists and use what you love — free, with credit.",
    bullets: ["Free to use", "Save a shortlist", "Reach photographers directly"],
    accent:
      "hover:border-brand-teal/70 focus-visible:ring-brand-teal group-hover:text-brand-teal",
    wash: "from-brand-lteal/60 to-brand-teal/25 dark:from-brand-teal/20 dark:to-brand-teal/5",
  },
];

export function RoleCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {roles.map((role) => (
        <Link
          key={role.href}
          href={role.href}
          className={`group flex flex-col rounded-lg border border-border bg-surface p-6 text-left shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${role.accent}`}
        >
          <span
            aria-hidden
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br text-3xl transition-transform duration-300 ease-soft group-hover:scale-110 ${role.wash}`}
          >
            {role.emoji}
          </span>
          <h2 className="font-head text-xl font-bold text-text transition-colors">
            {role.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{role.body}</p>
          <ul className="mt-5 flex flex-col gap-2 text-sm text-muted">
            {role.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-accent-ink"
                >
                  <path
                    d="M4 10.5l4 4 8-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {bullet}
              </li>
            ))}
          </ul>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-text">
            Continue
            <svg
              viewBox="0 0 20 20"
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 ease-soft group-hover:translate-x-1"
            >
              <path
                d="M4 10h11m0 0l-4.5-4.5M15 10l-4.5 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
