import { api } from '../utils/api';
import type { AppointmentService } from '@/entities/appointment-service';

export const listAppointmentServices = async () => {
  const result = await api<{ services: AppointmentService[] }>('/appointment-services');
  return result;
};
