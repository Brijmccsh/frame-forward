import { PageHeaderSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function UploadLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </>
  );
}
