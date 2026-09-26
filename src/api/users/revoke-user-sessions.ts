import { api } from '../utils/api';

export const revokeUserSessions = async (id: string) => {
  const result = await api<{ message: string }>(`/users/${id}/revoke-sessions`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  return result;
};
