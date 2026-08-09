import {
  PhotoGridSkeleton,
  ProfileHeaderSkeleton,
} from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfileLoading() {
  return (
    <>
      <ProfileHeaderSkeleton />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="order-2 lg:order-1">
          <Skeleton className="h-6 w-40" />
          <div className="mt-4">
            <PhotoGridSkeleton count={4} aspect="aspect-square" />
          </div>
        </div>
        <Skeleton className="order-1 h-56 rounded-lg lg:order-2" />
      </div>
    </>
  );
}
