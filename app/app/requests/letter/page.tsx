import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PrintButton } from "@/components/requests/print-button";
import { BRAND } from "@/lib/brand";
import { requireRole } from "@/lib/auth";
import {
  getPhotographerHours,
  listRequestsForPhotographer,
} from "@/lib/queries/requests";
import { getHoursPerPhoto } from "@/lib/queries/settings";
import { formatDate, formatHours, formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Verification letter",
  robots: { index: false, follow: false },
};

/**
 * Print-optimised verification letter. "Download" = the browser's own
 * Print → Save as PDF, which keeps the output crisp and needs no PDF library.
 */
export default async function VerificationLetterPage() {
  const { profile } = await requireRole("photographer");

  const [requests, hours, hoursPerPhoto] = await Promise.all([
    listRequestsForPhotographer(profile.id, "used"),
    getPhotographerHours(profile.id),
    getHoursPerPhoto(),
  ]);

  if (!requests.length) redirect("/app/requests");

  const organizations = Array.from(
    new Set(
      requests
        .map((request) => request.nonprofit?.org_name)
        .filter((name): name is string => Boolean(name)),
    ),
  );

  const earliest = requests.reduce<string | null>((oldest, request) => {
    const date = request.used_at ?? request.created_at;
    return !oldest || date < oldest ? date : oldest;
  }, null);

  return (
    <div className="min-h-dvh bg-surface-2/50 py-8 print:bg-white print:py-0">
      {/* Screen-only toolbar */}
      <div className="container-page mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/app/requests"
          className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-text"
        >
          <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
            <path
              d="M16 10H5m0 0l4.5-4.5M5 10l4.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to requests
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto w-full max-w-3xl bg-white px-8 py-12 text-[#2B2D33] shadow-lg print:max-w-none print:px-0 print:py-0 print:shadow-none sm:px-12">
        <header className="flex items-start justify-between gap-6 border-b border-[#E9E4DE] pb-6">
          <div>
            <p className="font-head text-xl font-bold lowercase tracking-tight">
              frame forward
            </p>
            <p className="mt-1 text-xs text-[#6F6C77]">{BRAND.tagline}</p>
          </div>
          <div className="text-right text-xs text-[#6F6C77]">
            <p>Issued {formatLongDate(new Date())}</p>
          </div>
        </header>

        <h1 className="mt-8 font-head text-2xl font-bold">
          Community Service Verification
        </h1>

        <div className="mt-6 space-y-4 text-sm leading-relaxed">
          <p>To whom it may concern,</p>
          <p>
            This letter verifies that{" "}
            <strong>{profile.name ?? "this student"}</strong>
            {profile.school ? ` of ${profile.school}` : ""} has contributed
            volunteer photography through Frame Forward, a platform that
            connects student photographers with nonprofit organizations at no
            cost to those organizations.
          </p>
          <p>
            Each photograph confirmed as used by a nonprofit is credited at{" "}
            <strong>{formatHours(hoursPerPhoto)} hours</strong> of community
            service, reflecting the time involved in shooting, editing and
            preparing an image for an organization&apos;s use.
          </p>
          <p>
            To date,{" "}
            <strong>
              {organizations.length} organization
              {organizations.length === 1 ? "" : "s"}
            </strong>{" "}
            {organizations.length === 1 ? "has" : "have"} confirmed use of{" "}
            <strong>
              {requests.length} photograph{requests.length === 1 ? "" : "s"}
            </strong>
            , totalling{" "}
            <strong>{formatHours(hours.totalHours)} community service hours</strong>
            {earliest ? ` since ${formatLongDate(earliest)}` : ""}.
          </p>
        </div>

        {/* Summary band */}
        <dl className="mt-8 grid grid-cols-3 gap-4 rounded-lg border border-[#E9E4DE] bg-[#FAF8F5] p-5 text-center">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#6F6C77]">
              Photos used
            </dt>
            <dd className="mt-1 font-head text-2xl font-bold">
              {requests.length}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#6F6C77]">
              Organizations
            </dt>
            <dd className="mt-1 font-head text-2xl font-bold">
              {organizations.length}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#6F6C77]">
              Total hours
            </dt>
            <dd className="mt-1 font-head text-2xl font-bold">
              {formatHours(hours.totalHours)}
            </dd>
          </div>
        </dl>

        <h2 className="mt-10 font-head text-lg font-semibold">
          Record of confirmed uses
        </h2>
        <table className="mt-3 w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-y border-[#E9E4DE]">
              <th scope="col" className="py-2.5 pr-3 font-semibold">
                Date
              </th>
              <th scope="col" className="py-2.5 pr-3 font-semibold">
                Organization
              </th>
              <th scope="col" className="py-2.5 pr-3 font-semibold">
                Photograph
              </th>
              <th scope="col" className="py-2.5 pr-3 font-semibold">
                Use
              </th>
              <th scope="col" className="py-2.5 text-right font-semibold">
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-[#E9E4DE] align-top"
              >
                <td className="whitespace-nowrap py-2.5 pr-3">
                  {formatDate(request.used_at ?? request.created_at)}
                </td>
                <td className="py-2.5 pr-3 font-medium">
                  {request.nonprofit?.org_name ?? "—"}
                </td>
                <td className="py-2.5 pr-3">{request.photo?.title ?? "—"}</td>
                <td className="py-2.5 pr-3">{request.use_type ?? "—"}</td>
                <td className="py-2.5 text-right tabular-nums">
                  {formatHours(request.hours_awarded)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="py-3 pr-3 text-right font-semibold">
                Total hours
              </td>
              <td className="py-3 text-right font-head text-base font-bold tabular-nums">
                {formatHours(hours.totalHours)}
              </td>
            </tr>
          </tfoot>
        </table>

        <footer className="mt-10 border-t border-[#E9E4DE] pt-5 text-xs leading-relaxed text-[#6F6C77]">
          <p>
            Hours are recorded automatically when a nonprofit confirms use
            through their Frame Forward account. Each confirmation is tied to a
            verified organization account and a specific photograph.
          </p>
          <p className="mt-3">
            Questions about this record can be directed to{" "}
            {profile.email ?? "the student"} via Frame Forward.
          </p>
        </footer>
      </article>
    </div>
  );
}
