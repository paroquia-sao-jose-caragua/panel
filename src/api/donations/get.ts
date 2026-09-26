import type { DonationsInfo } from '@/entities/DonationsInfo';
import { api } from '../utils/api';

interface GetDonationsInfoResponse {
  donations: DonationsInfo;
}

export const getDonationsInfo = async () => {
  const result = await api<GetDonationsInfoResponse>('/donations');
  return result;
};
