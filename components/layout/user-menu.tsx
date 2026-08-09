"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export interface UserMenuProps {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: Role;
}

const links: Record<Role, Array<{ href: string; label: string }>> = {
  photographer: [
    { href: "/app", label: "My library" },
    { href: "/requests", label: "Requests & hours" },
    { href: "/profile", label: "Edit profile" },
  ],
  nonprofit: [
    { href: "/browse", label: "Browse photos" },
    { href: "/requests", label: "My requests" },
    { href: "/profile", label: "Edit profile" },
  ],
};

/** Avatar button with a dropdown of role-aware links and sign out. */
export function UserMenu({ name, email, avatarUrl, role }: UserMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-pill border border-border bg-surface p-1 pr-2.5 transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <Avatar
          src={avatarUrl}
          name={name ?? email}
          size="sm"
          rounded={role === "nonprofit" ? "md" : "full"}
        />
        <svg
          viewBox="0 0 20 20"
          aria-hidden
          className={cn(
            "h-3.5 w-3.5 text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          <path
            d="M6 8l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 animate-scale-in overflow-hidden rounded-md border border-border bg-surface p-1.5 shadow-lg"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-text">
              {name || "Your account"}
            </p>
            {email ? (
              <p className="truncate text-xs text-muted">{email}</p>
            ) : null}
          </div>
          <div className="my-1 h-px bg-border" />
          {links[role].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-sm px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await signOut();
              })
            }
            className="block w-full rounded-sm px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {pending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
