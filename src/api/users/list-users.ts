import { api } from '../utils/api';
import { User, UsersListMeta } from '@/entities/user';

export interface ListUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface ListUsersResponse {
  users: User[];
  meta: UsersListMeta;
}

export const listUsers = async (params?: ListUsersParams) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.search) query.set('search', params.search);
  if (params?.role) query.set('role', params.role);
  if (params?.status) query.set('status', params.status);

  const queryString = query.toString();
  const path = `/users${queryString ? `?${queryString}` : ''}`;

  const result = await api<ListUsersResponse>(path, {
    method: 'GET',
  });

  return result;
};
