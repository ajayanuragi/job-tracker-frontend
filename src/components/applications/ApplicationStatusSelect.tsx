import type { Application, ApplicationStatus } from "@/types/application";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicationStatus } from "@/services/applicationService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface ApplicationStatusSelectProps {
  application: Application;
}

function ApplicationStatusSelect({
  application,
}: ApplicationStatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(
    application.status,
  );

  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (status: ApplicationStatus) =>
      updateApplicationStatus(application.id, status),

    onSuccess: (updatedApplication) => {
      setSelectedStatus(updatedApplication.status);

      queryClient.setQueryData(
        ["applications", application.id],
        updatedApplication,
      );

      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },

    onError: () => {
      setSelectedStatus(application.status);
    },
  });

  return (
    <Select
      value={selectedStatus}
      onValueChange={(value) => {
        if (value) {
          const status = value as ApplicationStatus;
          setSelectedStatus(status);
          statusMutation.mutate(status);
        }
      }}
      disabled={statusMutation.isPending}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="APPLIED">Applied</SelectItem>
        <SelectItem value="INTERVIEW">Interview</SelectItem>
        <SelectItem value="OFFER">Offer</SelectItem>
        <SelectItem value="REJECTED">Rejected</SelectItem>
        <SelectItem value="WITHDRAW">Withdrawn</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default ApplicationStatusSelect;
