import { api } from '../utils/api';
import { User, UserRole } from '@/entities/user';

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  sendInvite?: boolean;
}

export interface CreateUserResponse {
  message: string;
  user: User;
  resetToken?: string;
}

export const createUser = async (values: CreateUserInput) => {
  const result = await api<CreateUserResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(values),
  });

  return result;
};
