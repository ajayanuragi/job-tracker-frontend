import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApplication,
  getApplications,
} from "@/services/applicationService";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { getJobs } from "@/services/jobService";
import ApplicationCard from "@/components/applications/ApplicationCard";
import ApplicationForm from "@/components/applications/ApplicationForm";
import type { ApplicationFormValues } from "@/schemas/applicationSchema";
import { useState } from "react";
import PageError from "@/components/common/PageError";

function ApplicationsPage() {
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: () =>
      getApplications({
        page: 0,
        size: 10,
        sort: ["appliedAt,desc"],
      }),
  });

  const { data: jobsData } = useQuery({
    queryKey: ["jobs"],
    queryFn: () =>
      getJobs({
        page: 0,
        size: 100,
        sort: ["createdAt,desc"],
      }),
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setIsAddApplicationOpen(false);
    },
  });

  const handleCreateApplication = (values: ApplicationFormValues) => {
    createMutation.mutate(values);
  };

  if (isPending) {
    return (
      <main className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-9 w-36" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4 rounded-xl border p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-9 w-32" />
              </div>

              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications.
          </p>
        </div>

        <PageError
          title="Unable to load applications"
          message="Something went wrong while fetching your applications. Please try again."
          onRetry={() => refetch()}
        />
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications.
        </p>
      </div>

      {jobsData && jobsData.content.length > 0 ? (
        <Dialog
          open={isAddApplicationOpen}
          onOpenChange={setIsAddApplicationOpen}
        >
          <DialogTrigger render={<Button>Add Application</Button>} />

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add a new application</DialogTitle>
              <DialogDescription>
                Select a job and enter your application details.
              </DialogDescription>
            </DialogHeader>

            <ApplicationForm
              jobs={jobsData.content}
              onSubmit={handleCreateApplication}
              isPending={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add a job before tracking an application.
        </p>
      )}

      {createMutation.isSuccess && (
        <Alert>
          <AlertTitle>Application added</AlertTitle>
          <AlertDescription>
            Your application has been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {createMutation.isError && (
        <Alert variant="destructive">
          <AlertTitle>Failed to add application</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {data.content.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.content.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </main>
  );
}

export default ApplicationsPage;
