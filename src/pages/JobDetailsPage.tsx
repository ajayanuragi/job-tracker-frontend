import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJob } from "@/services/jobService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import ApplicationForm from "@/components/applications/ApplicationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import {
  createApplication,
  applicationExists,
} from "@/services/applicationService";
import PageError from "@/components/common/PageError";
import DetailsPageSkeleton from "@/components/common/DetailsPageSkeleton";

function JobDetails() {
  const [isTrackApplicationOpen, setIsTrackApplicationOpen] = useState(false);
  const { id } = useParams();

  const {
    data: job,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["jobs", Number(id)],
    queryFn: () => getJob(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
  });

  const { data: isAlreadyTracked } = useQuery({
    queryKey: ["applications", "exists", id],
    queryFn: () => applicationExists(Number(id)),
    enabled: !!id && Number.isInteger(Number(id)) && Number(id) > 0,
  });

  const queryClient = useQueryClient();

  const createApplicationMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      setIsTrackApplicationOpen(false);
    },
  });

  if (!id || !Number.isInteger(Number(id))) {
    return (
      <main className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Invalid job ID</AlertTitle>
          <AlertDescription>The job ID in the URL is invalid.</AlertDescription>
        </Alert>
      </main>
    );
  }
  if (isPending) {
    return <DetailsPageSkeleton />;
  }

  if (isError || !job) {
    return (
      <main className="space-y-4 p-6">
        <Button variant="outline" render={<Link to="/jobs" />}>
          Back to Jobs
        </Button>

        <PageError
          title="Unable to load job"
          message="Something went wrong while fetching job details. Please try again."
          onRetry={() => refetch()}
        />
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" render={<Link to="/jobs" />}>
          Back to Jobs
        </Button>

        <Dialog
          open={isTrackApplicationOpen}
          onOpenChange={setIsTrackApplicationOpen}
        >
          <DialogTrigger
            render={
              <Button
                disabled={isAlreadyTracked === undefined || isAlreadyTracked}
              >
                {isAlreadyTracked ? "Already Tracked" : "Track Application"}
              </Button>
            }
          />

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Track Application</DialogTitle>
              <DialogDescription>
                Record your application for {job.title}.
              </DialogDescription>
            </DialogHeader>

            <ApplicationForm
              jobs={[job]}
              defaultJobId={job.id}
              onSubmit={(values) => createApplicationMutation.mutate(values)}
              isPending={createApplicationMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
          <p className="text-muted-foreground">{job.companyName}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {job.employmentType.replace("_", " ")}
            </Badge>
            <Badge variant="outline">{job.workplaceType}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {job.location || "Location not specified"}
          </p>

          <div className="space-y-2">
            <h2 className="font-semibold">Job Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-6">
              {job.description}
            </p>
          </div>

          {job.jobUrl && (
            <Button
              variant="outline"
              render={
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              View Original Listing
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default JobDetails;
