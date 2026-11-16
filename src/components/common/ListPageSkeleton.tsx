import { Skeleton } from "@/components/ui/skeleton";

interface ListPageSkeletonProps {
  count?: number;
}

function ListPageSkeleton({
  count = 6,
}: ListPageSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="space-y-4 rounded-xl border p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>

            <Skeleton className="h-9 w-28" />
          </div>

          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export default ListPageSkeleton;