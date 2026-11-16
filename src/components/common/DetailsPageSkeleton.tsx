import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

function DetailsPageSkeleton() {
  return (
    <main className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-40" />
      </div>

      <Card>
        <CardHeader className="items-center space-y-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-28 w-full" />
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-9 w-28" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default DetailsPageSkeleton;