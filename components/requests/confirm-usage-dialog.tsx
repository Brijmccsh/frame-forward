"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { confirmUsage } from "@/lib/requests/actions";
import { USE_TYPES, USE_TYPE_EMOJI } from "@/lib/requests/use-types";

/** "Confirm we used this" — picks a use type and credits the photographer. */
export function ConfirmUsageDialog({
  open,
  onClose,
  requestId,
  photoTitle,
  photographerName,
  hoursPerPhoto,
}: {
  open: boolean;
  onClose: () => void;
  requestId: string;
  photoTitle: string | null;
  photographerName: string | null;
  hoursPerPhoto: number;
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [useType, setUseType] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!open) setUseType(null);
  }, [open]);

  const confirm = () => {
    if (!useType) return;
    startTransition(async () => {
      const result = await confirmUsage(requestId, useType);
      if (!result.ok) {
        toastError("Couldn't confirm that", result.error);
        return;
      }
      onClose();
      success(
        "Thank you! 🎉",
        `${photographerName ?? "The photographer"} just earned ${hoursPerPhoto} service hours.`,
      );
      router.refresh();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm you used this photo"
      description={`This credits ${photographerName ?? "the photographer"} with ${hoursPerPhoto} community service hours. Only confirm once the photo is actually out in the world.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Not yet
          </Button>
          <Button onClick={confirm} loading={pending} disabled={!useType}>
            Confirm &amp; credit hours
          </Button>
        </>
      }
    >
      {photoTitle ? (
        <p className="mb-4 rounded-md border border-border bg-surface-2/60 px-3.5 py-2.5 text-sm text-text">
          {photoTitle}
        </p>
      ) : null}

      <fieldset disabled={pending}>
        <legend className="mb-2.5 text-sm font-medium text-text">
          How did you use it? <span className="text-primary-ink">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {USE_TYPES.map((type) => (
            <Chip
              key={type}
              emoji={USE_TYPE_EMOJI[type]}
              selected={useType === type}
              onClick={() => setUseType(type)}
              data-autofocus={type === USE_TYPES[0] ? "" : undefined}
            >
              {type}
            </Chip>
          ))}
        </div>
      </fieldset>
    </Modal>
  );
}
