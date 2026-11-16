import type { Application } from "@/types/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationStatusSelect from "@/components/applications/ApplicationStatusSelect";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface ApplicationCardProps {
  application: Application;
}

function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{application.jobTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {application.companyName}
            </p>
          </div>

          <ApplicationStatusSelect application={application} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Applied on: {new Date(application.appliedAt).toLocaleDateString()}
        </p>

        {application.notes && <p className="text-sm">{application.notes}</p>}

        <Button
          variant="outline"
          className="w-full mt-2"
          render={<Link to={`/applications/${application.id}`} />}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default ApplicationCard;
