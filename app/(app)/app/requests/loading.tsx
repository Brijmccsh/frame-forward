import {
  ListSkeleton,
  PageHeaderSkeleton,
  StatRowSkeleton,
} from "@/components/ui/skeletons";

export default function PhotographerRequestsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-8">
        <StatRowSkeleton />
      </div>
      <div className="mt-10">
        <ListSkeleton count={3} />
      </div>
    </>
  );
}
