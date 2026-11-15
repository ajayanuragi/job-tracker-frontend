
export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'

export type WorkplaceType = 'REMOTE' | 'HYBRID' | 'ONSITE'

export interface Job {
  id: number
  title: string
  companyName: string
  description: string
  location: string | null
  employmentType: EmploymentType
  workplaceType: WorkplaceType
  jobUrl: string | null
  createdAt: string
}

export interface JobRequest {
  title: string
  companyName: string
  description: string
  location?: string
  employmentType: EmploymentType
  workplaceType: WorkplaceType
  jobUrl?: string
}

export type JobPatchRequest = Partial<JobRequest>
