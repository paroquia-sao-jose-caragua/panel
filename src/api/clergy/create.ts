import { api } from '../utils/api';
import type { Clergy, ClergyPosition } from '@/entities/Clergy';

export interface CreateClergyParams {
  name: string;
  title?: string | null;
  position: ClergyPosition;
  roleName?: string | null;
  shortIntro?: string | null;
  bio?: string | null;
  orderIndex?: number;
  isMain?: boolean;
  photoId?: string | null;
}

interface CreateClergyResponse {
  clergy: Clergy;
}

export const createClergy = async (params: CreateClergyParams) => {
  const result = await api<CreateClergyResponse>('/clergy', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  return result;
};
