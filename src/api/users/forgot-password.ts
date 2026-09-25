import { api } from '../utils/api';

export const forgotPassword = async (values: { email: string }) => {
  const result = await api<{ message: string }>('/forgot-password', {
    method: 'POST',
    body: JSON.stringify(values),
  });

  return result;
};
