import { api } from './api';

interface ResponseErrorFields<K extends string> {
  fields?: {
    [P in K]: { message: string }[];
  };
}

export const massSchedulesApi = async <ResponseData, K extends string = never>(
  path = '',
  init?: RequestInit
): Promise<
  ResponseErrorFields<K> &
    ResponseData & {
      statusCode: number;
      message?: string;
    }
> => {
  return api<ResponseData, K>(`/mass-schedules${path}`, init);
};
