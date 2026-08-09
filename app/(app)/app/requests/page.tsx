import { Camera, CircleCheck, Clock, Images, Inbox } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stat, StatRow } from "@/components/ui/stat";
import { requireRole } from "@/lib/auth";
import { countsForPhotographer } from "@/lib/queries/photos";
import {
  getPhotographerHours,
  listRequestsForPhotographer,
} from "@/lib/queries/requests";
import { getHoursPerPhoto } from "@/lib/queries/settings";
import { formatDate, formatHours } from "@/lib/format";
import { publicUrlFor } from "@/lib/storage";

export const metadata: Metadata = { title: "Requests & hours" };

export default async function PhotographerRequestsPage() {
  const { profile } = await requireRole("photographer");

  const [requests, hours, counts, hoursPerPhoto] = await Promise.all([
    listRequestsForPhotographer(profile.id),
    getPhotographerHours(profile.id),
    countsForPhotographer(profile.id),
    getHoursPerPhoto(),
  ]);

  const pending = requests.filter((request) => request.status === "requested");
  const confirmed = requests.filter((request) => request.status === "used");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-head text-3xl font-bold text-text sm:text-4xl">
            Requests &amp; hours
          </h1>
          <p className="mt-2 max-w-prose text-pretty text-muted">
            Who&apos;s asked to use your work, and the service hours
            you&apos;ve earned at {formatHours(hoursPerPhoto)} hours per photo
            used.
          </p>
        </div>
        {confirmed.length ? (
          <ButtonLink href="/app/requests/letter" variant="outline" size="sm">
            <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
              <path
                d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M3.5 14v1.5A1.5 1.5 0 005 17h10a1.5 1.5 0 001.5-1.5V14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Verification letter
          </ButtonLink>
        ) : null}
      </div>

      <StatRow className="mt-8">
        <Stat icon={Images} label="Photos" value={counts.published} hint={`${counts.total} total, ${counts.drafts} drafts`} />
        <Stat icon={CircleCheck} label="Times used" value={hours.photosUsed} hint="Confirmed by a nonprofit" tone="accent" />
        <Stat
          icon={Clock}
          label="Total hours"
          value={formatHours(hours.totalHours)}
          hint="Ready for your service log"
          tone="primary"
        />
      </StatRow>

      {/* Open requests */}
      <section className="mt-10">
        <h2 className="font-head text-xl font-semibold text-text">
          Open requests
          {pending.length ? (
            <span className="ml-2 text-sm font-medium text-muted">
              {pending.length}
            </span>
          ) : null}
        </h2>
        <p className="mt-1 text-sm text-muted">
          These nonprofits asked to use a photo. Hours land once they confirm
          they actually used it.
        </p>

        {pending.length ? (
          <ul className="mt-4 flex flex-col gap-3">
            {pending.map((request) => (
              <li
                key={request.id}
                className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {request.photo ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-2">
                    <Image
                      src={publicUrlFor("photos", request.photo.image_path)}
                      alt={request.photo.title ?? "Photo"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="font-head text-base font-semibold text-text">
                    {request.photo?.title ?? "Photo"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    {request.nonprofit ? (
                      <Link
                        href={`/u/${request.nonprofit.id}`}
                        className="flex items-center gap-1.5 transition-colors hover:text-text"
                      >
                        <Avatar
                          src={request.nonprofit.avatar_url}
                          name={request.nonprofit.org_name}
                          size="xs"
                          rounded="md"
                        />
                        {request.nonprofit.org_name ?? "A nonprofit"}
                      </Link>
                    ) : null}
                    {request.nonprofit?.email ? (
                      <a
                        href={`mailto:${request.nonprofit.email}`}
                        className="link-underline text-accent-ink"
                      >
                        {request.nonprofit.email}
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Requested {formatDate(request.created_at)}
                  </p>
                </div>

                <Badge tone="warning" dot className="shrink-0">
                  Awaiting confirmation
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-4"
            icon={Inbox}
            title="No open requests"
            description="When a nonprofit wants to use one of your photos, it'll show up here with their contact details."
          />
        )}
      </section>

      {/* Verification log */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-head text-xl font-semibold text-text">
              Verification log
            </h2>
            <p className="mt-1 text-sm text-muted">
              Every confirmed use, ready to hand to a teacher or NHS advisor.
            </p>
          </div>
          {confirmed.length ? (
            <ButtonLink href="/app/requests/letter" size="sm">
              Download letter
            </ButtonLink>
          ) : null}
        </div>

        {confirmed.length ? (
          <Card padded={false} className="mt-4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Confirmed photo uses and hours earned
                </caption>
                <thead>
                  <tr className="border-b border-border bg-surface-2/60">
                    <th scope="col" className="px-4 py-3 font-semibold text-muted">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-muted">
                      Nonprofit
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-muted">
                      Photo
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-muted">
                      Use type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-muted"
                    >
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {confirmed.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-border last:border-0 hover:bg-surface-2/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-muted">
                        {formatDate(request.used_at ?? request.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-text">
                        {request.nonprofit?.org_name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {request.photo?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {request.use_type ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-text">
                        {formatHours(request.hours_awarded)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-2/60">
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-right font-semibold text-text"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-right font-head text-lg font-bold tabular-nums text-text">
                      {formatHours(hours.totalHours)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        ) : (
          <EmptyState
            className="mt-4"
            icon={Clock}
            title="No confirmed uses yet"
            description={`Once a nonprofit confirms they used one of your photos, ${formatHours(hoursPerPhoto)} hours land here — along with a letter you can download.`}
          />
        )}
      </section>
    </>
  );
}
