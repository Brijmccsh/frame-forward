import {
  PageHeaderSkeleton,
  PhotoGridSkeleton,
  StatRowSkeleton,
} from "@/components/ui/skeletons";

export default function LibraryLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-8">
        <StatRowSkeleton />
      </div>
      <div className="mt-8">
        <PhotoGridSkeleton count={8} aspect="aspect-square" />
      </div>
    </>
  );
}
