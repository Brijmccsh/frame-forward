import type { ReactNode } from "react";

/** Titled block inside a profile form. */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6 first:border-0 first:pt-0">
      <h2 className="font-head text-lg font-semibold text-text">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted">{description}</p>
      ) : null}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

/** Two-up responsive row for short fields. */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
