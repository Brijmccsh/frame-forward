import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

/** Page title + subtitle placeholder. */
export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="h-9 w-64 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  );
}

export function ChipRowSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-9 shrink-0 rounded-pill"
          style={{ width: `${5 + ((index * 3) % 4)}rem` }}
        />
      ))}
    </div>
  );
}

/** Matches the browse / library grid so the swap doesn't jump. */
export function PhotoGridSkeleton({
  count = 8,
  aspect = "aspect-[4/5]",
}: {
  count?: number;
  aspect?: string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="overflow-hidden rounded-lg border border-border bg-surface"
        >
          <Skeleton className={cn("w-full rounded-none", aspect)} />
          <div className="flex flex-col gap-2 p-3.5">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StatRowSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-border bg-surface p-5"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

/** Stacked rows used by the request lists. */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
        >
          <Skeleton className="h-16 w-16 shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-28 shrink-0 rounded-pill" />
        </li>
      ))}
    </ul>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/1] w-full rounded-lg sm:aspect-[4/1]" />
      <div className="flex items-end gap-4 px-1">
        <Skeleton className="-mt-10 h-28 w-28 shrink-0 rounded-pill sm:-mt-12" />
        <div className="flex flex-col gap-2 pb-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      </div>
    </div>
  );
}
