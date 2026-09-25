import { api } from '../utils/api';
import { User, UserRole } from '@/entities/user';

export const updateUserRole = async ({
  id,
  role,
}: {
  id: string;
  role: UserRole;
}) => {
  const result = await api<{ message: string; user: User }>(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });

  return result;
};
