import { api } from './api';

export const userApi = async <ResponseData, K extends string = never>(
  path: string,
  init?: RequestInit
) => {
  return api<ResponseData, K>(`/users${path}`, init);
};
