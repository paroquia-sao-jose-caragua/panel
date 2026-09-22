import { api } from '../utils/api';
import type { Clergy } from '@/entities/Clergy';

interface ListClergyResponse {
  clergy: Clergy[];
}

export const listClergy = async () => {
  const result = await api<ListClergyResponse>('/clergy');
  return result;
};
