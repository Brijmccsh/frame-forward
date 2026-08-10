import Image from "next/image";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export interface ProfileHeaderProps {
  role: Role;
  name: string | null;
  tagline?: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  location?: string | null;
  meta?: ReactNode;
  actions?: ReactNode;
  verified?: boolean;
}

/** Cover banner with the avatar overlapping, name in Fraunces. */
export function ProfileHeader({
  role,
  name,
  tagline,
  avatarUrl,
  coverUrl,
  location,
  meta,
  actions,
  verified = false,
}: ProfileHeaderProps) {
  const nonprofit = role === "nonprofit";

  return (
    <header>
      <div
        className={cn(
          // Was 3:1 / 4:1, which cropped a normal 3:2 photo down to a thin
          // band and cut off whatever was near the top. These ratios keep the
          // banner shape while showing much more of the image.
          "relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border sm:aspect-[5/2] lg:aspect-[3/1]",
          !coverUrl &&
            (nonprofit
              ? "bg-gradient-to-br from-brand-lteal via-brand-teal/60 to-brand-lpink/60"
              : "bg-gradient-to-br from-brand-lpink via-brand-pink/60 to-brand-lteal/60"),
        )}
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-[center_38%]"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4">
          <div className="-mt-10 sm:-mt-12">
            <Avatar
              src={avatarUrl}
              name={name}
              size="2xl"
              rounded={nonprofit ? "md" : "full"}
              className="border-4 border-bg bg-surface shadow-md"
            />
          </div>
          <div className="pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-head text-2xl font-bold leading-tight text-text sm:text-3xl">
                {name || "Unnamed profile"}
              </h1>
              {verified ? (
                <Badge tone="accent" dot>
                  Verified
                </Badge>
              ) : null}
            </div>
            {tagline ? (
              <p className="mt-1 max-w-prose text-pretty text-sm text-muted">
                {tagline}
              </p>
            ) : null}
            {location ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                <svg viewBox="0 0 20 20" aria-hidden className="h-3.5 w-3.5">
                  <path
                    d="M10 17.5s5.5-4.8 5.5-9a5.5 5.5 0 10-11 0c0 4.2 5.5 9 5.5 9z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="10" cy="8.5" r="1.9" fill="currentColor" />
                </svg>
                {location}
              </p>
            ) : null}
            {meta ? <div className="mt-3">{meta}</div> : null}
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2 pb-1">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
