import { api } from './api';

export const massSchedulesApi = async <ResponseData, K extends string = never>(
  path = '',
  init?: RequestInit
) => {
  return api<ResponseData, K>(`/mass-schedules${path}`, init);
};
