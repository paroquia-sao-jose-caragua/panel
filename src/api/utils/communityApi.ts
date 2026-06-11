import { api } from './api';

export const communityApi = async <ResponseData, K extends string = never>(
  path = '',
  init?: RequestInit
) => {
  return api<ResponseData, K>(`/communities${path}`, init);
};
