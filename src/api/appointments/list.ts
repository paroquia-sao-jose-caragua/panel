import { api } from '../utils/api';
import type { Appointment, AppointmentStatus } from '@/entities/appointment';

export interface ListAppointmentsParams {
  agentId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
}

interface ListAppointmentsResponse {
  appointments: Appointment[];
}

export const listAppointments = async (params?: ListAppointmentsParams) => {
  const searchParams = new URLSearchParams();
  if (params?.agentId) searchParams.append('agentId', params.agentId);
  if (params?.date) searchParams.append('date', params.date);
  if (params?.startDate) searchParams.append('startDate', params.startDate);
  if (params?.endDate) searchParams.append('endDate', params.endDate);
  if (params?.status) searchParams.append('status', params.status);

  const query = searchParams.toString();
  const url = query ? `/appointments?${query}` : '/appointments';

  const result = await api<ListAppointmentsResponse>(url);
  return result;
};
