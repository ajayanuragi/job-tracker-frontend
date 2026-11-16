import { api } from "@/lib/api";
import type { Job, JobRequest, JobPatchRequest } from "@/types/job";
import type { Page } from "@/types/pagination";

export interface JobParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export const getJobs = async (params: JobParams): Promise<Page<Job>> => {
  const response = await api.get<Page<Job>>("/api/jobs", { params });
  return response.data;
};

export const getJob = async (id: number): Promise<Job> => {
  const response = await api.get<Job>(`/api/jobs/${id}`);
  return response.data;
};

export const createJob = async (data: JobRequest): Promise<Job> => {
  const response = await api.post<Job>("/api/jobs", data);
  return response.data;
};

export const updateJob = async (id: number, data: JobRequest): Promise<Job> => {
  const response = await api.put<Job>(`/api/jobs/${id}`, data);
  return response.data;
};

export const patchJob = async (
  id: number,
  data: JobPatchRequest,
): Promise<Job> => {
  const response = await api.patch<Job>(`/api/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/api/jobs/${id}`);
};
