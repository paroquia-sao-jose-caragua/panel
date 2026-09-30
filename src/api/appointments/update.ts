import { api } from '../utils/api';
import type { Appointment, AppointmentStatus, PatientConditions } from '@/entities/appointment';

export interface UpdateAppointmentInput {
  agentId: string;
  serviceId: string;
  communityId?: string | null;
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string | null;
  requesterRelationship?: string | null;
  patientName?: string | null;
  patientAddress?: string | null;
  patientConditions?: PatientConditions | null;
  appointmentDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  requesterNotes?: string | null;
  status?: AppointmentStatus;
  privatePastoralNotes?: string | null;
  cancellationReason?: string | null;
}

export interface UpdateAppointmentResponse {
  message: string;
  appointment: Appointment;
}

export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentInput
) => {
  const result = await api<UpdateAppointmentResponse>(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return result;
};
