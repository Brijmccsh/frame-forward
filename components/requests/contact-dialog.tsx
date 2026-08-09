"use client";

import * as React from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { PhotographerContact } from "@/lib/requests/actions";

function mailtoFor(
  contact: PhotographerContact,
  orgName: string | null,
): string {
  const subject = `Photo request from ${orgName ?? "a nonprofit"} — Frame Forward`;
  const body = [
    `Hi ${contact.name ?? "there"},`,
    "",
    `We found your photo${contact.photoTitle ? ` "${contact.photoTitle}"` : ""} on Frame Forward and would love to use it${orgName ? ` at ${orgName}` : ""}.`,
    "",
    "Here's how we're planning to use it:",
    "",
    "",
    "Thank you for sharing your work — we'll confirm on Frame Forward once it's published so you get your service hours.",
    "",
    orgName ?? "",
  ].join("\n");

  return `mailto:${contact.email ?? ""}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

/** Shown right after a request — reveals the photographer's email. */
export function ContactDialog({
  open,
  onClose,
  contact,
  orgName,
  alreadyRequested = false,
}: {
  open: boolean;
  onClose: () => void;
  contact: PhotographerContact | null;
  orgName: string | null;
  alreadyRequested?: boolean;
}) {
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!contact) return null;

  const copyEmail = async () => {
    if (!contact.email) return;
    await navigator.clipboard.writeText(contact.email);
    setCopied(true);
    success("Email copied");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={alreadyRequested ? "You've already asked" : "Request sent"}
      description={
        alreadyRequested
          ? "This one's already in My requests. Here are the photographer's details again."
          : "Reach out directly — photographers love hearing what their work is for."
      }
    >
      <div className="rounded-md border border-border bg-surface-2/60 p-4">
        <p className="text-2xs font-semibold uppercase tracking-wide text-muted">
          Photographer
        </p>
        <p className="mt-1 font-head text-lg font-semibold text-text">
          {contact.name ?? "Photographer"}
        </p>
        {contact.email ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-sm bg-surface px-3 py-2 font-body text-sm text-text">
              {contact.email}
            </code>
            <Button size="sm" variant="secondary" onClick={copyEmail}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">
            This photographer hasn&apos;t shared an email address.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Once you&apos;ve actually used the photo, come back to{" "}
        <span className="font-semibold text-text">My requests</span> and confirm
        it — that&apos;s what credits their service hours.
      </p>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <ButtonLink href="/requests" variant="outline" onClick={onClose}>
          My requests
        </ButtonLink>
        {contact.email ? (
          <a
            href={mailtoFor(contact, orgName)}
            className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary px-5 text-sm font-semibold text-primary-fg shadow-sm transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Email {contact.name?.split(" ")[0] ?? "them"}
          </a>
        ) : null}
      </div>
    </Modal>
  );
}
