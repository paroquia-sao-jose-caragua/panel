import { api } from '../utils/api';

export const resendUserInvite = async (id: string) => {
  const result = await api<{ message?: string }>(`/users/${id}/resend-invite`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  return result;
};
