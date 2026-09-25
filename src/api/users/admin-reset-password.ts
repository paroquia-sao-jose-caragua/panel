import { api } from '../utils/api';

export interface AdminResetPasswordInput {
  id: string;
  password?: string;
  sendEmail?: boolean;
}

export const adminResetPassword = async ({
  id,
  password,
  sendEmail,
}: AdminResetPasswordInput) => {
  const result = await api<{ message: string; resetToken?: string }>(
    `/users/${id}/reset-password`,
    {
      method: 'POST',
      body: JSON.stringify({ password, sendEmail }),
    }
  );

  return result;
};
