import { api } from '../utils/api';

export const resetPassword = async (values: {
  token: string;
  password?: string;
  newPassword?: string;
}) => {
  const pwd = values.newPassword || values.password;
  const result = await api<{ message: string }>('/reset-password', {
    method: 'POST',
    body: JSON.stringify({
      token: values.token,
      password: pwd,
      newPassword: pwd,
    }),
  });

  return result;
};
