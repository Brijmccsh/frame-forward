import { cn } from "@/lib/utils";

/**
 * Decorative "stack of prints" for the hero. Purely CSS so the landing page
 * stays fast and looks intentional before any real photos exist.
 */
const frames = [
  {
    label: "Community",
    emoji: "🤝",
    wash: "from-brand-pink/85 to-brand-lpink/70",
    className: "-rotate-6 lg:-translate-x-6",
    delay: "0ms",
  },
  {
    label: "Nature",
    emoji: "🌿",
    wash: "from-brand-teal/85 to-brand-lteal/70",
    className: "rotate-3 translate-y-8 lg:translate-x-10",
    delay: "120ms",
  },
  {
    label: "Events",
    emoji: "🎉",
    wash: "from-brand-lpink/90 to-brand-lteal/80",
    className: "-rotate-2 translate-y-16 lg:translate-x-1",
    delay: "240ms",
  },
];

export function HeroCollage() {
  return (
    <div
      aria-hidden
      className="relative mx-auto hidden h-[26rem] w-full max-w-md sm:block"
    >
      {frames.map((frame, index) => (
        <figure
          key={frame.label}
          style={{ animationDelay: frame.delay, zIndex: frames.length - index }}
          className={cn(
            "absolute left-1/2 top-6 w-60 -translate-x-1/2 animate-fade-up rounded-lg border border-border bg-surface p-3 pb-4 shadow-lg transition-transform duration-500 ease-soft hover:-translate-y-2 hover:rotate-0 sm:w-64",
            frame.className,
          )}
        >
          <div
            className={cn(
              "flex aspect-[4/5] items-center justify-center rounded-md bg-gradient-to-br text-5xl",
              frame.wash,
            )}
          >
            <span>{frame.emoji}</span>
          </div>
          <figcaption className="mt-3 flex items-center justify-between px-0.5">
            <span className="font-head text-sm font-semibold text-text">
              {frame.label}
            </span>
            <span className="rounded-pill bg-surface-2 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-muted">
              +3 hrs
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
