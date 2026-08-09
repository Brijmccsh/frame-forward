import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

/**
 * Photographer-only segment (/app, /app/upload, /app/requests).
 *
 * The check lives in a layout rather than each page so the redirect happens
 * before the response starts streaming — a page-level redirect degrades into
 * a meta-refresh once loading.tsx has flushed the shell.
 */
export default async function PhotographerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("photographer");
  return <>{children}</>;
}
