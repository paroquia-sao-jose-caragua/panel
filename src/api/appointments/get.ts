import { api } from '../utils/api';
import type { Appointment } from '@/entities/appointment';

export interface GetAppointmentResponse {
  appointment: Appointment;
}

export const getAppointment = async (id: string) => {
  const result = await api<GetAppointmentResponse>(`/appointments/${id}`, {
    method: 'GET',
  });

  return result;
};
