import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  /** Lifts the card on hover — use for clickable cards only. */
  interactive?: boolean;
  padded?: boolean;
  as?: "div" | "article" | "section" | "li";
};

export function Card({
  className,
  interactive = false,
  padded = true,
  as: Tag = "div",
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-border bg-surface shadow-sm",
        padded && "p-5 sm:p-6",
        interactive &&
          "transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />;
}

export function CardTitle({
  className,
  as: Tag = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" }) {
  return (
    <Tag
      className={cn("font-head text-lg font-semibold text-text", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-relaxed text-muted", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-5 flex items-center gap-3 border-t border-border pt-4",
        className,
      )}
      {...props}
    />
  );
}
