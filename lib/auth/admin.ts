/**
 * Who can review applications.
 *
 * Keep this in sync with nothing else — this constant is the single source of
 * truth for admin access. The database's `freeze_status` trigger only lets
 * `service_role` write `status`, and the service-role client is used in exactly
 * one place (lib/admin/actions.ts) behind the check below.
 *
 * Override with the ADMIN_EMAILS env var (comma-separated) to test with your
 * own address without touching code.
 */
const DEFAULT_ADMIN_EMAILS = ["founders@frameforward.org"];

export const ADMIN_EMAILS: string[] = (
  process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",")
    : DEFAULT_ADMIN_EMAILS
)
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export const ADMIN_PATH = "/admin/applications";
