import { api } from '../utils/api';
import type { Clergy, ClergyPosition } from '@/entities/Clergy';

export interface EditClergyParams {
  id: string;
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

interface EditClergyResponse {
  clergy: Clergy;
}

export const editClergy = async (params: EditClergyParams) => {
  const { id, ...body } = params;
  const result = await api<EditClergyResponse>(`/clergy/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...body }),
  });

  return result;
};
