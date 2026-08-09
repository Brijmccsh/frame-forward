import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";

/** Nonprofit-only. Photographers get their own view at /app/requests. */
export default async function NonprofitRequestsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireProfile();
  if (session.role === "photographer") redirect("/app/requests");
  return <>{children}</>;
}
