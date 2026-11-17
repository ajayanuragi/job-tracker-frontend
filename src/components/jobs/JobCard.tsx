import type { Job } from "@/types/job";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{job.companyName}</p>
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

        <Button
          nativeButton={false}
          variant="outline"
          className="w-full"
          render={<Link to={`/jobs/${job.id}`} />}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default JobCard;
