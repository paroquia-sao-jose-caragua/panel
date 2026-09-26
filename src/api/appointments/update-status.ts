import { api } from '../utils/api';
import type { AppointmentStatus } from '@/entities/appointment';

export interface UpdateAppointmentStatusParams {
  id: string;
  status: AppointmentStatus;
  cancellationReason?: string | null;
  privateNotes?: string | null;
}

export const updateAppointmentStatus = async ({
  id,
  status,
  cancellationReason,
  privateNotes,
}: UpdateAppointmentStatusParams) => {
  const result = await api<{ message: string }>(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      cancellationReason,
      privateNotes,
    }),
  });

  return result;
};
