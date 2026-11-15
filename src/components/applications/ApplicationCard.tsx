import type { Application } from '@/types/application'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ApplicationCardProps {
  application: Application
}

function ApplicationCard({ application }: ApplicationCardProps) {
  const formattedStatus = application.status.replace('_', ' ')

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

          <Badge variant="secondary">{formattedStatus}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Applied on:{' '}
          {new Date(application.appliedAt).toLocaleDateString()}
        </p>

        {application.notes && (
          <p className="text-sm">{application.notes}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default ApplicationCard