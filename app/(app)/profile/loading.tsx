import { ProfileHeaderSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <>
      <ProfileHeaderSkeleton />
      <div className="mt-10 flex flex-col gap-3">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-80 max-w-full" />
        <Skeleton className="mt-3 h-[32rem] w-full rounded-lg" />
      </div>
    </>
  );
}
