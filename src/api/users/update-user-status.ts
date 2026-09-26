import { api } from '../utils/api';
import { User, UserStatus } from '@/entities/user';

export const updateUserStatus = async ({
  id,
  status,
}: {
  id: string;
  status: UserStatus;
}) => {
  const result = await api<{ message: string; user: User }>(`/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return result;
};
