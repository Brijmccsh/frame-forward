"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ContactDialog } from "./contact-dialog";
import {
  requestPhoto,
  toggleSavePhoto,
  type PhotographerContact,
} from "@/lib/requests/actions";
import { cn } from "@/lib/utils";

export interface PhotoActionsProps {
  photoId: string;
  orgName: string | null;
  saved: boolean;
  requested: boolean;
  /** `inline` sits in the lightbox sidebar; `overlay` floats on a card. */
  layout?: "inline" | "overlay";
  onSavedChange?: (photoId: string, saved: boolean) => void;
  onRequested?: (photoId: string) => void;
}

/** Save + request controls a nonprofit sees on any photo. */
export function PhotoActions({
  photoId,
  orgName,
  saved,
  requested,
  layout = "inline",
  onSavedChange,
  onRequested,
}: PhotoActionsProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [isSaved, setIsSaved] = React.useState(saved);
  const [isRequested, setIsRequested] = React.useState(requested);
  const [contact, setContact] = React.useState<PhotographerContact | null>(null);
  const [alreadyRequested, setAlreadyRequested] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [savePending, startSave] = React.useTransition();
  const [requestPending, startRequest] = React.useTransition();

  React.useEffect(() => setIsSaved(saved), [saved]);
  React.useEffect(() => setIsRequested(requested), [requested]);

  const toggleSave = () => {
    const next = !isSaved;
    setIsSaved(next); // optimistic
    onSavedChange?.(photoId, next);

    startSave(async () => {
      const result = await toggleSavePhoto(photoId);
      if (!result.ok) {
        setIsSaved(!next);
        onSavedChange?.(photoId, !next);
        toastError("Couldn't update your shortlist", result.error);
        return;
      }
      if (result.saved) success("Saved to your shortlist ♥");
      router.refresh();
    });
  };

  const request = () => {
    startRequest(async () => {
      const result = await requestPhoto(photoId);
      if (!result.ok) {
        toastError("Couldn't send that request", result.error);
        return;
      }
      setContact(result.contact);
      setAlreadyRequested(result.alreadyRequested);
      setDialogOpen(true);
      setIsRequested(true);
      onRequested?.(photoId);
      router.refresh();
    });
  };

  const heart = (
    <button
      type="button"
      onClick={toggleSave}
      disabled={savePending}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
      className={cn(
        "inline-flex items-center justify-center rounded-pill transition-all duration-200 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60",
        layout === "overlay"
          ? "h-9 w-9 bg-bg/85 text-muted shadow-sm backdrop-blur hover:scale-110 hover:text-primary"
          : "h-11 w-11 border border-border bg-surface text-muted hover:border-primary/50 hover:text-primary",
        isSaved && "text-primary",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("h-5 w-5 transition-transform", isSaved && "scale-110")}
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.9"
      >
        <path
          d="M12 20.3l-1.4-1.3C5.4 14.4 2 11.4 2 7.7 2 4.9 4.2 2.8 7 2.8c1.6 0 3.1.7 4 1.9 0.9-1.2 2.4-1.9 4-1.9 2.8 0 5 2.1 5 4.9 0 3.7-3.4 6.7-8.6 11.3L12 20.3z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  if (layout === "overlay") {
    return (
      <>
        {heart}
        <ContactDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          contact={contact}
          orgName={orgName}
          alreadyRequested={alreadyRequested}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {heart}
        <Button
          onClick={request}
          loading={requestPending}
          fullWidth
          variant={isRequested ? "outline" : "primary"}
        >
          {isRequested ? "Requested — see contact" : "Request to use"}
        </Button>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-muted">
        Free to use. We&apos;ll show you the photographer&apos;s email right
        away.
      </p>

      <ContactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        contact={contact}
        orgName={orgName}
        alreadyRequested={alreadyRequested}
      />
    </>
  );
}
