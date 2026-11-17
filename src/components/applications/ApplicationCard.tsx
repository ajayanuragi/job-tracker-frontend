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
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle>{application.jobTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {application.companyName}
          </p>
        </div>

        <div>
          <ApplicationStatusSelect application={application} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Applied on: {new Date(application.appliedAt).toLocaleDateString()}
        </p>

        {application.notes && <p className="text-sm">{application.notes}</p>}

        <Button
          nativeButton={false}
          variant="outline"
          className="w-full mt-4"
          render={<Link to={`/applications/${application.id}`} />}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default ApplicationCard;
