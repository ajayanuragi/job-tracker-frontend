export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'OFFER'
  | 'WITHDRAW'

export interface Application {
  id: number
  jobId: number
  jobTitle: string
  companyName: string
  status: ApplicationStatus
  appliedAt: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface ApplicationRequest {
  jobId: number
  appliedAt?: string
  notes?: string
}

export interface ApplicationPatchRequest {
  status?: ApplicationStatus
  notes?: string
}