import { useQueries, useQuery } from "@tanstack/react-query";
import { getJobs } from "@/services/jobService";
import { getApplications } from "@/services/applicationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseBusiness,
  FileText,
  CalendarCheck,
  Trophy,
} from "lucide-react";
import ApplicationStatusChart from "@/components/dashboard/ApplicationStatusChart";

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
      {
        queryKey: ["applications", { status: "REJECTED", page: 0, size: 1 }],
        queryFn: () =>
          getApplications({ status: "REJECTED", page: 0, size: 1 }),
      },
      {
        queryKey: ["applications", { status: "WITHDRAW", page: 0, size: 1 }],
        queryFn: () =>
          getApplications({ status: "WITHDRAW", page: 0, size: 1 }),
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

  const [
    jobsQuery,
    applicationsQuery,
    interviewsQuery,
    offersQuery,
    rejectedQuery,
    withdrawnQuery,
  ] = results;

  const stats = [
    {
      title: "Total Jobs",
      query: jobsQuery,
      icon: BriefcaseBusiness,
      href: "/jobs",
    },
    {
      title: "Total Applications",
      query: applicationsQuery,
      icon: FileText,
      href: "/applications",
    },
    {
      title: "Interviews",
      query: interviewsQuery,
      icon: CalendarCheck,
      href: "/applications?status=INTERVIEW",
    },
    {
      title: "Offers",
      query: offersQuery,
      icon: Trophy,
      href: "/applications?status=OFFER",
    },
  ];

  const chartQueries = [
    applicationsQuery,
    interviewsQuery,
    offersQuery,
    rejectedQuery,
    withdrawnQuery,
  ];

  const chartLoading = chartQueries.some((query) => query.isPending);
  const chartError = chartQueries.some((query) => query.isError);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your jobs and applications.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ title, query, icon: Icon, href }) => (
            <Link key={title} to={href} className="block">
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  <Icon className="size-5 text-muted-foreground" />
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
            </Link>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            {chartLoading ? (
              <p className="text-muted-foreground">Loading chart...</p>
            ) : chartError ? (
              <p className="text-destructive">Failed to load chart.</p>
            ) : (
              <ApplicationStatusChart
                applied={
                  applicationsQuery.data!.page.totalElements -
                  interviewsQuery.data!.page.totalElements -
                  offersQuery.data!.page.totalElements -
                  rejectedQuery.data!.page.totalElements -
                  withdrawnQuery.data!.page.totalElements
                }
                interview={interviewsQuery.data!.page.totalElements}
                offer={offersQuery.data!.page.totalElements}
                rejected={rejectedQuery.data!.page.totalElements}
                withdrawn={withdrawnQuery.data!.page.totalElements}
              />
            )}
          </CardContent>
        </Card>
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
