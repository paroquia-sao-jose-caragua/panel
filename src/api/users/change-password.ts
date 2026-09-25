import { api } from '../utils/api';

export const changePassword = async (values: {
  currentPassword: string;
  newPassword: string;
}) => {
  const result = await api<{ message: string }>('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify(values),
  });

  return result;
};
