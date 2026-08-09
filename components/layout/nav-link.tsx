"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
  exact = false,
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "whitespace-nowrap rounded-pill px-3.5 py-2 text-sm font-semibold transition-colors duration-200",
        active
          ? "bg-surface-2 text-text"
          : "text-muted hover:bg-surface-2/70 hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}
