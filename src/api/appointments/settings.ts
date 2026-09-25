import { api } from '../utils/api';
import type { AppointmentSettings } from '@/entities/appointment-settings';

export interface UpdateAppointmentSettingsParams {
  enabled: boolean;
  suspendedTitle?: string;
  suspendedMessage?: string;
}

export const getAppointmentSettings = async () => {
  const result = await api<{ settings: AppointmentSettings }>('/appointment-settings');
  return result;
};

export const updateAppointmentSettings = async (data: UpdateAppointmentSettingsParams) => {
  const result = await api<{ message: string; settings: AppointmentSettings }>('/appointment-settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result;
};
