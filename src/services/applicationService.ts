import { api } from "@/lib/api";
import type {
  Application,
  ApplicationRequest,
  ApplicationPatchRequest,
} from "@/types/application";
import type { Page } from "@/types/pagination";

export interface ApplicationParams {
  page?: number;
  size?: number;
  sort?: string[];
  status?: string;
  companyName?: string;
  jobTitle?: string;
}

export const getApplications = async (
  params: ApplicationParams,
): Promise<Page<Application>> => {
  const response = await api.get("/api/applications", { params });
  return response.data;
};

export const createApplication = async (
  data: ApplicationRequest,
): Promise<Application> => {
  const response = await api.post('/api/applications', data)
  return response.data
}


export const getApplication = async (
  id: number,
): Promise<Application> => {
  const response = await api.get(`/api/applications/${id}`)
  return response.data
}

export const patchApplication = async (
  id: number,
  data: ApplicationPatchRequest,
): Promise<Application> => {
  const response = await api.patch(`/api/applications/${id}`, data)
  return response.data
}