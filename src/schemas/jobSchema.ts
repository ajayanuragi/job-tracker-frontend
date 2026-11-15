import { z } from 'zod'

export const jobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Job title is required')
    .max(150, 'Job title cannot exceed 150 characters'),

  companyName: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(150, 'Company name cannot exceed 150 characters'),

  description: z
    .string()
    .trim()
    .min(1, 'Job description is required'),

  location: z.string(),

  employmentType: z.enum([
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP',
  ]),

  workplaceType: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),

  jobUrl: z
    .string()
    .refine(
      (value) => value === '' || /^https?:\/\/.+/.test(value),
      'Job URL must start with http:// or https://',
    ),
})

export type JobFormValues = z.infer<typeof jobSchema>