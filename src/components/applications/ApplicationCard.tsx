import type { Application } from "@/types/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateApplicationStatus } from '@/services/applicationService'
import type { ApplicationStatus } from '@/types/application'


interface ApplicationCardProps {
  application: Application;
}

function ApplicationCard({ application }: ApplicationCardProps) {
  
  const queryClient = useQueryClient()
  
  const statusMutation = useMutation({
    mutationFn: (status: ApplicationStatus) =>
      updateApplicationStatus(application.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })

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

          <Select
            value={application.status}
            onValueChange={(value) => {
              statusMutation.mutate(value as ApplicationStatus)
            }}
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
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Applied on: {new Date(application.appliedAt).toLocaleDateString()}
        </p>

        {application.notes && <p className="text-sm">{application.notes}</p>}
      </CardContent>
    </Card>
  );
}

export default ApplicationCard;
