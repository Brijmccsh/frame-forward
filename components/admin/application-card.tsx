"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, RotateCcw, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { reviewApplication } from "@/lib/admin/actions";
import { formatDate } from "@/lib/format";
import type { Application } from "@/lib/admin/queries";
import type { ProfileStatus } from "@/lib/types";

const TONE: Record<ProfileStatus, "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  denied: "danger",
};

export function ApplicationCard({ application }: { application: Application }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [pending, startTransition] = React.useTransition();
  const [confirmDeny, setConfirmDeny] = React.useState(false);

  const review = (status: ProfileStatus) => {
    startTransition(async () => {
      const result = await reviewApplication(
        application.role,
        application.id,
        status,
      );
      if (!result.ok) {
        toastError("Couldn't save that", result.error);
        return;
      }
      setConfirmDeny(false);
      success(
        status === "approved"
          ? "Approved"
          : status === "denied"
            ? "Denied"
            : "Moved back to pending",
        application.name ?? application.email ?? undefined,
      );
      router.refresh();
    });
  };

  return (
    <>
      <li className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar
            src={application.avatarUrl}
            name={application.name ?? application.email}
            size="xl"
            rounded={application.role === "nonprofit" ? "md" : "full"}
            className="shrink-0"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-head text-lg font-semibold text-text">
                {application.name || "Unnamed application"}
              </h3>
              <Badge tone={TONE[application.status]} dot>
                {application.status}
              </Badge>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              {application.email ? (
                <a
                  href={`mailto:${application.email}`}
                  className="link-underline text-accent-ink"
                >
                  {application.email}
                </a>
              ) : (
                <span>No email on file</span>
              )}
              {application.location ? <span>{application.location}</span> : null}
              {application.website ? (
                <a
                  href={application.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-text"
                >
                  {application.website.replace(/^https?:\/\//, "")}
                  <ExternalLink aria-hidden className="h-3 w-3" />
                </a>
              ) : null}
            </div>

            {application.detail ? (
              <p className="mt-1 text-xs text-muted">{application.detail}</p>
            ) : null}

            {application.summary ? (
              <p className="mt-3 max-w-prose whitespace-pre-line text-sm leading-relaxed text-muted">
                {application.summary}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-muted/80">
                They didn&apos;t write anything about themselves.
              </p>
            )}

            <p className="mt-3 text-2xs uppercase tracking-wide text-muted/80">
              Applied {formatDate(application.createdAt)}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
            <Link
              href={`/u/${application.id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-pill border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-primary/50 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View profile
            </Link>

            {application.status !== "approved" ? (
              <Button
                size="sm"
                onClick={() => review("approved")}
                loading={pending}
              >
                <Check aria-hidden className="h-4 w-4" />
                Approve
              </Button>
            ) : null}

            {application.status !== "denied" ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmDeny(true)}
                disabled={pending}
                className="hover:text-danger"
              >
                <X aria-hidden className="h-4 w-4" />
                Deny
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => review("pending")}
                loading={pending}
              >
                <RotateCcw aria-hidden className="h-4 w-4" />
                Re-open
              </Button>
            )}
          </div>
        </div>
      </li>

      <Modal
        open={confirmDeny}
        onClose={() => setConfirmDeny(false)}
        size="sm"
        title="Deny this application?"
        description={`${application.name || "This applicant"} will see a "not approved" message and won't be able to use Frame Forward. You can re-open it later from the Denied tab.`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmDeny(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => review("denied")}
              loading={pending}
            >
              Deny application
            </Button>
          </>
        }
      />
    </>
  );
}
