const steps = [
  {
    emoji: "📤",
    title: "Upload your photos",
    body: "Add your best shots to a category — nature, sports, community, whatever you love shooting.",
  },
  {
    emoji: "💌",
    title: "A nonprofit reaches out",
    body: "Organizations browse the library and request the photos they want to use in their work.",
  },
  {
    emoji: "⏳",
    title: "Earn service hours",
    body: "When they confirm they used your photo, hours land in your account — with a letter you can download.",
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works"
      className="border-y border-border bg-surface-2/60 py-16 sm:py-20"
    >
      <div className="container-page">
        <div className="max-w-prose">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">
            How it works
          </p>
          <h2
            id="how-it-works"
            className="mt-3 font-head text-3xl font-bold text-text sm:text-4xl"
          >
            Three steps, start to hours.
          </h2>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="group relative rounded-lg border border-border bg-surface p-6 shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-md"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-surface-2 text-2xl transition-transform duration-300 ease-soft group-hover:scale-110">
                <span aria-hidden>{step.emoji}</span>
              </span>
              <span
                aria-hidden
                className="absolute right-5 top-5 font-head text-4xl font-bold text-border"
              >
                {index + 1}
              </span>
              <h3 className="font-head text-lg font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
