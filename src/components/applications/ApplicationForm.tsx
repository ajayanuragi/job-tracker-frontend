import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Job } from '@/types/job'
import {
  applicationSchema,
  type ApplicationFormValues,
} from '@/schemas/applicationSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ApplicationFormProps {
  jobs: Job[]
  onSubmit: (data: ApplicationFormValues) => void
  isPending?: boolean
}

function ApplicationForm({
  jobs,
  onSubmit,
  isPending = false,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId: 0,
      appliedAt: new Date().toISOString().slice(0, 16),
      notes: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="jobId" className="text-sm font-medium">
          Job
        </label>
        <select
          id="jobId"
          {...register('jobId', { valueAsNumber: true })}
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
        >
          <option value={0}>Select a job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} — {job.companyName}
            </option>
          ))}
        </select>
        {errors.jobId && (
          <p className="text-sm text-destructive">
            {errors.jobId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="appliedAt" className="text-sm font-medium">
          Applied date
        </label>
        <Input
          id="appliedAt"
          type="datetime-local"
          {...register('appliedAt')}
        />
        {errors.appliedAt && (
          <p className="text-sm text-destructive">
            {errors.appliedAt.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (optional)
        </label>
        <Textarea id="notes" {...register('notes')} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Add Application'}
      </Button>
    </form>
  )
}

export default ApplicationForm