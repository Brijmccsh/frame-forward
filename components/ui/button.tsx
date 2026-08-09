import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "accent";
export type ButtonSize = "mini" | "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-body font-semibold transition-all duration-200 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-fg shadow-sm hover:-translate-y-0.5 hover:shadow-glow",
  accent:
    "bg-accent text-accent-fg shadow-sm hover:-translate-y-0.5 hover:shadow-md",
  secondary: "border border-border/70 bg-surface-2 text-text hover:bg-border/60",
  outline:
    "border border-border bg-surface text-text hover:border-primary/60 hover:bg-primary/5",
  ghost: "text-muted hover:bg-surface-2 hover:text-text",
  danger: "bg-danger text-danger-fg shadow-sm hover:brightness-105",
};

const sizes: Record<ButtonSize, string> = {
  mini: "h-7 gap-1 px-2.5 text-2xs",
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-base",
};

const iconSizes: Record<ButtonSize, string> = {
  mini: "h-7 w-7 p-0",
  sm: "h-9 w-9 p-0",
  md: "h-11 w-11 p-0",
  lg: "h-[3.25rem] w-[3.25rem] p-0",
};

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a square button sized for a single icon. */
  iconOnly?: boolean;
  fullWidth?: boolean;
}

/** Shared class recipe so links can look identical to buttons. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  iconOnly = false,
  fullWidth = false,
  className,
}: ButtonStyleProps & { className?: string } = {}) {
  return cn(
    base,
    variants[variant],
    iconOnly ? iconSizes[size] : sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonStyleProps {
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      iconOnly,
      fullWidth,
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={buttonClasses({
          variant,
          size,
          iconOnly,
          fullWidth,
          className,
        })}
        {...props}
      >
        {loading ? <Spinner size={size === "lg" ? "md" : "sm"} /> : null}
        {children}
      </button>
    );
  },
);

export interface ButtonLinkProps
  extends LinkProps,
    ButtonStyleProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  children: React.ReactNode;
}

/** A next/link that looks and focuses like a Button. */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { className, variant, size, iconOnly, fullWidth, children, ...props },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={buttonClasses({
          variant,
          size,
          iconOnly,
          fullWidth,
          className,
        })}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
