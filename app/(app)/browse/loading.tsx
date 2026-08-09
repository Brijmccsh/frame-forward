import {
  ChipRowSkeleton,
  PageHeaderSkeleton,
  PhotoGridSkeleton,
} from "@/components/ui/skeletons";

export default function BrowseLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-7">
        <ChipRowSkeleton />
      </div>
      <div className="mt-7">
        <PhotoGridSkeleton count={8} />
      </div>
    </>
  );
}
