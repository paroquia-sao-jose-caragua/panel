import { api } from './api';

export const eventSchedulesApi = async <ResponseData, K extends string = never>(
  path = '',
  init?: RequestInit
) => {
  return api<ResponseData, K>(`/event-schedules${path}`, init);
};
