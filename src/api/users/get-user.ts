import { api } from '../utils/api';
import { User } from '@/entities/user';

export const getUser = async (id: string) => {
  const result = await api<{ user: User }>(`/users/${id}`, {
    method: 'GET',
  });

  return result;
};
