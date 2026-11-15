import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, getJobs } from "@/services/jobService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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

function JobsPage() {
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

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

  const { data, isPending, isError } = useQuery({
    queryKey: ["jobs", 0, 10],
    queryFn: () => getJobs({ page: 0, size: 10 }),
  });

  if (isPending) {
    return (
      <main className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            Failed to load jobs. Please try again later.
          </AlertDescription>
        </Alert>
      </main>
    );
  }
  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
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
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {job.companyName}
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {job.employmentType.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline">{job.workplaceType}</Badge>
                </div>

                <p className="mt-auto text-sm text-muted-foreground">
                  {job.location || "Location not specified"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

export default JobsPage;
