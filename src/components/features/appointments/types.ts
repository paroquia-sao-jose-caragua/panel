import type { AppointmentStatus } from '@/entities/appointment';

export interface AppointmentFormValues {
  agentId: string;
  serviceId: string;
  communityId: string | null;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  requesterRelationship: string;
  requesterNotes: string;
  patientName: string;
  patientAddress: string;
  isBedridden: boolean;
  canSwallowHost: boolean;
  isLucid: boolean;
  patientNotes: string;
  status: AppointmentStatus;
  privatePastoralNotes: string;
}
