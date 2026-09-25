export interface PastoralAgent {
  id: string;
  name: string;
  title: string | null;
  actingRole: string;
  userId: string | null;
  phone: string;
  email: string | null;
  communityId: string | null;
  photoId: string | null;
  photoUrl?: string | null;
  acceptsAppointments: boolean;
  active: boolean;
  community?: {
    id: string;
    name: string;
  } | null;
  services?: Array<{
    id: string;
    title: string;
    category: string;
    description: string | null;
    defaultDurationMinutes: number;
    requiresAddress: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface AgentAvailability {
  id: string;
  agentId: string;
  communityId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  active: boolean;
}

export interface AgentBlockedDate {
  id: string;
  agentId: string;
  blockedDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}
