import { Skeleton } from "@/components/ui/skeleton";

export default function RouteLoadingSkeleton() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <Skeleton className="h-8 w-48" />

      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>

      <Skeleton className="h-64 w-full" />
    </main>
  );
}