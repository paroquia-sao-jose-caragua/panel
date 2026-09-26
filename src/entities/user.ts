export type UserRole =
  | 'admin'
  | 'secretary'
  | 'user'
  | 'pastoral_agent'
  | 'viewer';

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
