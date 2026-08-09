import { Reveal } from "./reveal";

const STATS = [
  { value: "10", label: "categories", detail: "from wildlife to fine art" },
  { value: "100%", label: "free for nonprofits", detail: "no fees, no licensing" },
  {
    value: "Verified",
    label: "service hours for students",
    detail: "logged and downloadable",
  },
];

export function StatsBand() {
  return (
    <section aria-label="Frame Forward at a glance" className="pb-20 sm:pb-24">
      <div className="container-page">
        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border shadow-sm sm:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center bg-surface px-6 py-10 text-center"
              >
                <dt className="order-2 mt-2 font-body text-sm font-semibold text-text">
                  {stat.label}
                </dt>
                <dd className="order-1 font-head text-4xl font-bold tracking-tight text-text sm:text-5xl">
                  {stat.value}
                </dd>
                <dd className="order-3 mt-1 text-xs text-muted">
                  {stat.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
