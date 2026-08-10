import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { ApplicationCard } from "@/components/admin/application-card";
import { ChipLink } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Stat, StatRow } from "@/components/ui/stat";
import { requireAdmin } from "@/lib/auth";
import { getApplicationCounts, listApplications } from "@/lib/admin/queries";
import type { ProfileStatus, Role } from "@/lib/types";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

const ROLES: Array<{ value: Role; label: string }> = [
  { value: "photographer", label: "Photographers" },
  { value: "nonprofit", label: "Nonprofits" },
];

const STATUSES: Array<{ value: ProfileStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
];

const isRole = (value?: string): value is Role =>
  value === "photographer" || value === "nonprofit";

const isStatus = (value?: string): value is ProfileStatus =>
  value === "pending" || value === "approved" || value === "denied";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { role?: string; status?: string };
}) {
  await requireAdmin();

  const role: Role = isRole(searchParams.role)
    ? searchParams.role
    : "photographer";
  const status: ProfileStatus = isStatus(searchParams.status)
    ? searchParams.status
    : "pending";

  const [applications, counts] = await Promise.all([
    listApplications(role, status),
    getApplicationCounts(),
  ]);

  const href = (next: { role?: Role; status?: ProfileStatus }) =>
    `/admin/applications?role=${next.role ?? role}&status=${next.status ?? status}`;

  const totalPending =
    counts.photographer.pending + counts.nonprofit.pending;

  return (
    <>
      <h1 className="font-head text-3xl font-bold text-text sm:text-4xl">
        Applications
      </h1>
      <p className="mt-2 max-w-prose text-pretty text-muted">
        Every photographer and nonprofit waiting to join. Approving someone
        lets them straight in; denying shows them a message and keeps their
        details here in case you change your mind.
      </p>

      <StatRow className="mt-8">
        <Stat
          icon={Inbox}
          label="Waiting on you"
          value={totalPending}
          hint={
            totalPending === 0
              ? "Queue is clear"
              : `${counts.photographer.pending} photographers · ${counts.nonprofit.pending} nonprofits`
          }
          tone={totalPending > 0 ? "primary" : "default"}
        />
        <Stat
          label="Approved"
          value={counts.photographer.approved + counts.nonprofit.approved}
          hint="Active accounts"
          tone="accent"
        />
        <Stat
          label="Denied"
          value={counts.photographer.denied + counts.nonprofit.denied}
          hint="Can be re-opened"
        />
      </StatRow>

      {/* Role switch */}
      <div className="mt-9 flex flex-wrap items-center gap-2">
        {ROLES.map((option) => (
          <ChipLink
            key={option.value}
            href={href({ role: option.value })}
            selected={role === option.value}
          >
            {option.label}
            <span className="ml-1 tabular-nums opacity-70">
              {counts[option.value].pending}
            </span>
          </ChipLink>
        ))}
      </div>

      {/* Status filter */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {STATUSES.map((option) => (
          <ChipLink
            key={option.value}
            href={href({ status: option.value })}
            selected={status === option.value}
            className="text-xs"
          >
            {option.label}
            <span className="ml-1 tabular-nums opacity-70">
              {counts[role][option.value]}
            </span>
          </ChipLink>
        ))}
      </div>

      <div className="mt-7">
        {applications.length ? (
          <ul className="flex flex-col gap-4">
            {applications.map((application) => (
              <ApplicationCard
                key={`${application.role}-${application.id}`}
                application={application}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Inbox}
            title={
              status === "pending"
                ? "Nothing to review"
                : `No ${status} ${role === "photographer" ? "photographers" : "nonprofits"}`
            }
            description={
              status === "pending"
                ? "New applications land here the moment someone finishes signing up."
                : "Try another filter."
            }
          />
        )}
      </div>
    </>
  );
}
