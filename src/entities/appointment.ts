export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface PatientConditions {
  isBedridden?: boolean;
  canSwallowHost?: boolean;
  isLucid?: boolean;
  notes?: string;
}

export interface Appointment {
  id: string;
  agentId: string;
  serviceId: string;
  communityId: string | null;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string | null;
  requesterRelationship: string | null;
  patientName: string | null;
  patientAddress: string | null;
  patientConditions: PatientConditions | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  accessToken: string;
  requesterNotes: string | null;
  privatePastoralNotes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt?: string | null;

  service?: {
    id: string;
    title: string;
    category: string;
    description: string | null;
    defaultDurationMinutes: number;
    requiresAddress: boolean;
  } | null;

  agent?: {
    id: string;
    name: string;
    title: string | null;
    actingRole: string;
    phone: string;
    email: string | null;
    photoUrl?: string | null;
  } | null;

  community?: {
    id: string;
    name: string;
  } | null;
}
