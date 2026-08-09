import { Camera, Search, Sparkles, UserPlus } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create a free account",
    body: "Takes two minutes. No experience required. Any skill level welcome.",
  },
  {
    number: "02",
    icon: Camera,
    title: "Upload your photography",
    body: "Nature, wildlife, coastal, parks, open spaces, community — any subject that connects to your world.",
  },
  {
    number: "03",
    icon: Search,
    title: "Nonprofits find your work",
    body: "Verified organizations browse the platform and access photography that tells their story.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Your photo does something real",
    body: "Conservation reports, grant applications, newsletters, advocacy campaigns — your image in the world, doing good.",
  },
];

export function Steps() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-20 border-y border-border bg-surface-2/50 py-20 sm:py-24"
    >
      <div className="container-page">
        <Reveal className="max-w-prose">
          <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 font-head text-4xl font-bold tracking-tight text-text sm:text-5xl"
          >
            Four steps to impact
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 90}>
              <div className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-surface-2 text-accent-ink transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary-ink">
                    <step.icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span
                    aria-hidden
                    className="font-head text-4xl font-bold leading-none text-border transition-colors duration-300 group-hover:text-primary/40"
                  >
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-head text-lg font-semibold text-text">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
