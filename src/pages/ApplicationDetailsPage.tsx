import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ApplicationStatusSelect from "@/components/applications/ApplicationStatusSelect";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApplication,
  patchApplication,
} from "@/services/applicationService";
import PageError from "@/components/common/PageError";
import DetailsPageSkeleton from "@/components/common/DetailsPageSkeleton";

function ApplicationDetailsPage() {
  const [editedNotes, setEditedNotes] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const applicationId = Number(id);

  const {
    data: application,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["applications", applicationId],
    queryFn: () => getApplication(applicationId),
    enabled: Number.isInteger(applicationId) && applicationId > 0,
  });

  const queryClient = useQueryClient();

  const notesMutation = useMutation({
    mutationFn: (notes: string) => patchApplication(applicationId, { notes }),

    onSuccess: (updatedApplication) => {
      queryClient.setQueryData(
        ["applications", applicationId],
        updatedApplication,
      );

      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      setEditedNotes(null);
    },
  });

  if (isPending) {
    return <DetailsPageSkeleton />;
  }

  if (isError || !application) {
    return (
      <main className="space-y-4 p-6">
        <Button variant="outline" render={<Link to="/applications" />}>
          Back to Applications
        </Button>

        <PageError
          title="Unable to load application"
          message="Something went wrong while fetching application details. Please try again."
          onRetry={() => refetch()}
        />
      </main>
    );
  }

  return (
    <main className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" render={<Link to="/applications" />}>
          Back to Applications
        </Button>

        <ApplicationStatusSelect application={application} />
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{application.jobTitle}</CardTitle>

          <CardDescription>{application.companyName}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-left">
          <div className="text-center">
            <p className="text-sm font-medium">Applied On</p>
            <p className="text-sm text-muted-foreground">
              {new Date(application.appliedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Notes</p>

            <Textarea
              value={editedNotes ?? application.notes ?? ""}
              onChange={(event) => setEditedNotes(event.target.value)}
              placeholder="Add notes about your application..."
              rows={5}
            />

            <div className="flex justify-center">
              <Button
                disabled={editedNotes === null || notesMutation.isPending}
                onClick={() => {
                  if (editedNotes !== null) {
                    notesMutation.mutate(editedNotes);
                  }
                }}
              >
                {notesMutation.isPending ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default ApplicationDetailsPage;
