import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, getJobs } from "@/services/jobService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import JobForm from "@/components/jobs/JobForm";
import type { JobFormValues } from "@/schemas/jobSchema";
import { useState } from "react";
import PageError from "@/components/common/PageError";
import ListPageSkeleton from "@/components/common/ListPageSkeleton";
import JobCard from "@/components/jobs/JobCard";

function JobsPage() {
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: (data: JobFormValues) => createJob(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsAddJobOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create job:", error);
    },
  });

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["jobs", page, 10],
    queryFn: () => getJobs({ page, size: 10 }),
  });

  if (isPending) {
    return (
      <main className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-9 w-36" />

        <ListPageSkeleton count={6} />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage and organize your saved job listings.
          </p>
        </div>

        <PageError
          title="Unable to load jobs"
          message="Something went wrong while fetching jobs. Please try again."
          onRetry={() => refetch()}
        />
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage and organize your saved job listings.
          </p>
        </div>

        <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
          <DialogTrigger render={<Button>Add Job</Button>} />
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add a new job</DialogTitle>
              <DialogDescription>
                Enter the details of the job you want to track.
              </DialogDescription>
            </DialogHeader>

            <JobForm
              onSubmit={(data) => createJobMutation.mutate(data)}
              isPending={createJobMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {data.content.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h2 className="text-lg font-semibold">No jobs yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first job listing to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.content.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {data.page.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {data.page.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page >= data.page.totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}

export default JobsPage;
