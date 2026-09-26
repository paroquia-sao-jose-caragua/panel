import type { UrgentAlert } from '@/entities/urgent-alert';
import { api } from '../utils/api';

interface GetUrgentAlertResponse {
  alert: UrgentAlert;
}

export const getUrgentAlert = async () => {
  const result = await api<GetUrgentAlertResponse>('/urgent-alert');
  return result;
};
