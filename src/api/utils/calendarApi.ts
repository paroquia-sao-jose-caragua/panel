import { api } from './api';

export const calendarApi = async <ResponseData, K extends string = never>(
  path = '',
  init?: RequestInit
) => {
  return api<ResponseData, K>(`/calendar${path}`, init);
};
