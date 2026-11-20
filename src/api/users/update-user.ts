import { api } from '../utils/api';
import { User } from '@/entities/user';

export const updateUser = async ({
  id,
  name,
  email,
}: {
  id: string;
  name: string;
  email: string;
}) => {
  const result = await api<{ message: string; user: User }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, email }),
  });

  return result;
};
