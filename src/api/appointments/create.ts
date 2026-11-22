import { api } from '../utils/api';
import type {
  Appointment,
  AppointmentKind,
  AppointmentStatus,
  PatientConditions,
} from '@/entities/appointment';

export interface CreateAppointmentInput {
  kind?: AppointmentKind;
  title?: string | null;
  agentId: string;
  serviceId?: string | null;
  communityId?: string | null;
  requesterName?: string | null;
  requesterPhone?: string | null;
  requesterEmail?: string | null;
  requesterRelationship?: string | null;
  patientName?: string | null;
  patientAddress?: string | null;
  patientConditions?: PatientConditions | null;
  appointmentDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime?: string | null; // "HH:mm"
  durationMinutes?: number | null;
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
