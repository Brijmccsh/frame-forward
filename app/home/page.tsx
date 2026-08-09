import { redirect } from "next/navigation";
import { resolveHomePath } from "@/lib/auth";

/**
 * Tiny router: sends a signed-in user to onboarding or their role's home.
 * Middleware points here whenever the correct destination depends on the
 * user's profile state (e.g. a signed-in user hitting /login).
 */
export const dynamic = "force-dynamic";

export default async function HomeResolverPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const home = await resolveHomePath();

  // Honour ?next= only for safe, in-app paths.
  const next = searchParams.next;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : null;

  redirect(safeNext && home !== "/onboarding" ? safeNext : home);
}
