import { useQueries, useQuery } from "@tanstack/react-query";
import { getJobs } from "@/services/jobService";
import { getApplications } from "@/services/applicationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["jobs", { page: 0, size: 1 }],
        queryFn: () => getJobs({ page: 0, size: 1 }),
      },
      {
        queryKey: ["applications", { page: 0, size: 1 }],
        queryFn: () => getApplications({ page: 0, size: 1 }),
      },
      {
        queryKey: ["applications", { status: "INTERVIEW", page: 0, size: 1 }],
        queryFn: () =>
          getApplications({ status: "INTERVIEW", page: 0, size: 1 }),
      },
      {
        queryKey: ["applications", { status: "OFFER", page: 0, size: 1 }],
        queryFn: () => getApplications({ status: "OFFER", page: 0, size: 1 }),
      },
    ],
  });

  const recentApplicationsQuery = useQuery({
    queryKey: ["applications", { page: 0, size: 5, sort: ["appliedAt,desc"] }],
    queryFn: () =>
      getApplications({
        page: 0,
        size: 5,
        sort: ["appliedAt,desc"],
      }),
  });

  const [jobsQuery, applicationsQuery, interviewsQuery, offersQuery] = results;
  const stats = [
    { title: "Total Jobs", query: jobsQuery },
    { title: "Total Applications", query: applicationsQuery },
    { title: "Interviews", query: interviewsQuery },
    { title: "Offers", query: offersQuery },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your jobs and applications.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ title, query }) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">
                  {query.isPending
                    ? "..."
                    : query.isError
                      ? "Error"
                      : query.data.page.totalElements}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
      
        <CardContent>
          {recentApplicationsQuery.isPending ? (
            <p className="text-muted-foreground">Loading applications...</p>
          ) : recentApplicationsQuery.isError ? (
            <p className="text-destructive">Failed to load applications.</p>
          ) : recentApplicationsQuery.data.content.length === 0 ? (
            <p className="text-muted-foreground">No applications yet.</p>
          ) : (
            <div className="divide-y">
              {recentApplicationsQuery.data.content.map((application) => (
                <Link
                  key={application.id}
                  to={`/applications/${application.id}`}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{application.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.companyName}
                    </p>
                  </div>
      
                  <Badge variant="secondary">{application.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
