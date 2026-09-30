import { api } from '../utils/api';
import type { Appointment, AppointmentStatus, PatientConditions } from '@/entities/appointment';

export interface CreateAppointmentInput {
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
}

export interface CreateAppointmentResponse {
  message: string;
  appointment: Appointment;
}

export const createAppointment = async (data: CreateAppointmentInput) => {
  const result = await api<CreateAppointmentResponse>('/appointments/internal', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return result;
};
