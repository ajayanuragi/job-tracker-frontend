import { z } from 'zod'

export const applicationSchema = z.object({
  jobId: z.number().min(1, 'Please select a job'),
  appliedAt: z.string().min(1, 'Application date is required'),
  notes: z.string().optional(),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>