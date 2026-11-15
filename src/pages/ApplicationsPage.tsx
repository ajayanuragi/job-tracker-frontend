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

import { getJobs } from "@/services/jobService";
import ApplicationCard from "@/components/applications/ApplicationCard";
import ApplicationForm from "@/components/applications/ApplicationForm";
import type { ApplicationFormValues } from "@/schemas/applicationSchema";
import { useState } from "react";

function ApplicationsPage() {
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);

  const { data, isPending, isError } = useQuery({
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
    return <main className="p-6">Loading applications...</main>;
  }

  if (isError) {
    return <main className="p-6">Failed to load applications.</main>;
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
