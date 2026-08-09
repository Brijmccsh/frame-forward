"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { ConfirmUsageDialog } from "./confirm-usage-dialog";
import { toggleSavePhoto } from "@/lib/requests/actions";
import { publicUrlFor } from "@/lib/storage";
import { formatDate } from "@/lib/format";
import type { SavedPhoto, UsageRequestDetail } from "@/lib/queries/requests";

export function NonprofitRequests({
  requests,
  saved,
  hoursPerPhoto,
}: {
  requests: UsageRequestDetail[];
  saved: SavedPhoto[];
  hoursPerPhoto: number;
}) {
  const [confirming, setConfirming] = React.useState<UsageRequestDetail | null>(
    null,
  );

  const pending = requests.filter((request) => request.status === "requested");
  const used = requests.filter((request) => request.status === "used");

  return (
    <>
      <Tabs
        label="Your requests"
        items={[
          { value: "requests", label: "Requests", count: requests.length },
          { value: "saved", label: "Saved", count: saved.length },
        ]}
      >
        {(tab) =>
          tab === "requests" ? (
            requests.length ? (
              <div className="flex flex-col gap-8">
                {pending.length ? (
                  <section>
                    <h2 className="mb-3 font-head text-lg font-semibold text-text">
                      Waiting on you
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {pending.map((request) => (
                        <RequestRow
                          key={request.id}
                          request={request}
                          onConfirm={() => setConfirming(request)}
                        />
                      ))}
                    </ul>
                  </section>
                ) : null}

                {used.length ? (
                  <section>
                    <h2 className="mb-3 font-head text-lg font-semibold text-text">
                      Confirmed uses
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {used.map((request) => (
                        <RequestRow key={request.id} request={request} />
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            ) : (
              <EmptyState
                emoji="💌"
                title="No requests yet"
                description="Find a photo you love in Browse and hit “Request to use”. You'll get the photographer's email right away."
                action={<ButtonLink href="/browse">Browse photos</ButtonLink>}
              />
            )
          ) : saved.length ? (
            <SavedGrid saved={saved} />
          ) : (
            <EmptyState
              emoji="♥"
              title="Your shortlist is empty"
              description="Tap the heart on any photo to keep it here while you decide."
              action={<ButtonLink href="/browse">Browse photos</ButtonLink>}
            />
          )
        }
      </Tabs>

      {confirming ? (
        <ConfirmUsageDialog
          open
          onClose={() => setConfirming(null)}
          requestId={confirming.id}
          photoTitle={confirming.photo?.title ?? null}
          photographerName={confirming.photo?.photographer?.name ?? null}
          hoursPerPhoto={hoursPerPhoto}
        />
      ) : null}
    </>
  );
}

function RequestRow({
  request,
  onConfirm,
}: {
  request: UsageRequestDetail;
  onConfirm?: () => void;
}) {
  const photo = request.photo;
  const photographer = photo?.photographer;
  const used = request.status === "used";

  return (
    <li className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center">
      {photo ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-2">
          <Image
            src={publicUrlFor("photos", photo.image_path)}
            alt={photo.title ?? "Photo"}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-head text-base font-semibold text-text">
            {photo?.title ?? "Photo unavailable"}
          </h3>
          {used ? (
            <Badge tone="success" dot>
              Used · {request.use_type}
            </Badge>
          ) : (
            <Badge tone="warning" dot>
              Requested
            </Badge>
          )}
        </div>

        {photographer ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <Link
              href={`/u/${photographer.id}`}
              className="flex items-center gap-1.5 transition-colors hover:text-text"
            >
              <Avatar
                src={photographer.avatar_url}
                name={photographer.name}
                size="xs"
              />
              {photographer.name ?? "Photographer"}
            </Link>
            {photographer.email ? (
              <a
                href={`mailto:${photographer.email}`}
                className="link-underline text-accent"
              >
                {photographer.email}
              </a>
            ) : null}
          </div>
        ) : null}

        <p className="mt-1.5 text-xs text-muted">
          Requested {formatDate(request.created_at)}
          {used && request.used_at
            ? ` · confirmed ${formatDate(request.used_at)}`
            : ""}
          {used && request.hours_awarded
            ? ` · ${request.hours_awarded} hrs credited`
            : ""}
        </p>
      </div>

      {!used && onConfirm ? (
        <Button size="sm" onClick={onConfirm} className="shrink-0">
          Confirm we used this
        </Button>
      ) : null}
    </li>
  );
}

function SavedGrid({ saved }: { saved: SavedPhoto[] }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [removing, setRemoving] = React.useState<string | null>(null);

  const unsave = (photoId: string) => {
    setRemoving(photoId);
    void toggleSavePhoto(photoId).then((result) => {
      setRemoving(null);
      if (!result.ok) {
        toastError("Couldn't update your shortlist", result.error);
        return;
      }
      success("Removed from your shortlist");
      router.refresh();
    });
  };

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {saved.map((item) =>
        item.photo ? (
          <li key={item.photo_id}>
            <figure className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-[4/5] bg-surface-2">
                <Image
                  src={publicUrlFor("photos", item.photo.image_path)}
                  alt={item.photo.title ?? "Photo"}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex flex-1 flex-col gap-2 p-3.5">
                <h3 className="line-clamp-2 font-head text-sm font-semibold text-text">
                  {item.photo.title ?? "Untitled"}
                </h3>
                <p className="text-xs text-muted">
                  {item.photo.photographer?.name ?? "Photographer"}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <ButtonLink href="/browse" size="mini" variant="secondary">
                    View in Browse
                  </ButtonLink>
                  <Button
                    size="mini"
                    variant="ghost"
                    onClick={() => unsave(item.photo_id)}
                    loading={removing === item.photo_id}
                    className="ml-auto hover:text-danger"
                  >
                    Remove
                  </Button>
                </div>
              </figcaption>
            </figure>
          </li>
        ) : null,
      )}
    </ul>
  );
}
