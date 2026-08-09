"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Sun/moon toggle. Renders a neutral placeholder until mounted so the server
 * and client markup match (the resolved theme is unknown during SSR).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Toggle color theme"
      }
      title={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : undefined}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-muted transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary-ink hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-300 ease-soft",
          mounted && !isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0",
        )}
      >
        <circle cx="12" cy="12" r="4.25" fill="currentColor" />
        <g
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
        </g>
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-300 ease-soft",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-50 opacity-0",
        )}
      >
        <path
          d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
