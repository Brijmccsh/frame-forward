import { ListSkeleton, PageHeaderSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Skeleton className="mt-8 h-11 w-56 rounded-pill" />
      <div className="mt-6">
        <ListSkeleton count={3} />
      </div>
    </>
  );
}
