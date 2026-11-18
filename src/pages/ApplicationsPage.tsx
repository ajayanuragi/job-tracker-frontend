import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import {
  createApplication,
  getApplications,
} from "@/services/applicationService";
import ListPageSkeleton from "@/components/common/ListPageSkeleton";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getJobs } from "@/services/jobService";
import ApplicationCard from "@/components/applications/ApplicationCard";
import ApplicationForm from "@/components/applications/ApplicationForm";
import type { ApplicationFormValues } from "@/schemas/applicationSchema";
import { useState } from "react";
import PageError from "@/components/common/PageError";
import type { ApplicationStatus } from "@/types/application";

function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState("");
  const status = searchParams.get("status");
  const [page, setPage] = useState(0);

  const validStatuses: ApplicationStatus[] = [
    "APPLIED",
    "INTERVIEW",
    "REJECTED",
    "OFFER",
    "WITHDRAW",
  ];

  const statusFilter: ApplicationStatus | "ALL" = validStatuses.includes(
    status as ApplicationStatus,
  )
    ? (status as ApplicationStatus)
    : "ALL";

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [
      "applications",
      {
        page,
        size: 10,
        status: statusFilter,
        companyName: companyFilter,
        jobTitle: jobTitleFilter,
      },
    ],
    queryFn: () =>
      getApplications({
        page,
        size: 10,
        sort: ["appliedAt,desc"],
        status: statusFilter === "ALL" ? undefined : statusFilter,
        companyName: companyFilter || undefined,
        jobTitle: jobTitleFilter || undefined,
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

        <ListPageSkeleton count={6} />
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

  const handleSearch = () => {
    setCompanyFilter(companyInput.trim());
    setJobTitleFilter(jobTitleInput.trim());
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchParams((params) => {
      const updated = new URLSearchParams(params);
      updated.delete("status");
      return updated;
    });
    setCompanyInput("");
    setCompanyFilter("");
    setJobTitleInput("");
    setJobTitleFilter("");
    setPage(0);
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);

            if (!value || value === "ALL") {
              params.delete("status");
            } else {
              params.set("status", value);
            }
            setPage(0);
            setSearchParams(params);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="WITHDRAW">Withdrawn</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by company..."
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
             handleSearch()
            }
          }}
          className="w-56"
        />
        <Input
          placeholder="Search by job title..."
          value={jobTitleInput}
          onChange={(e) => setJobTitleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            handleSearch()
            }
          }}
          className="w-56"
        />

        <Button type="button" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outline" type="button" onClick={handleClearFilters}>
          Clear Filters
        </Button>
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
        <p className="text-muted-foreground">
          {statusFilter !== "ALL" || companyFilter || jobTitleFilter
            ? "No applications match your filters."
            : "No applications yet."}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.content.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}

      {data.page.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {data.page.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page >= data.page.totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}

export default ApplicationsPage;
