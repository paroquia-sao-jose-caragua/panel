export interface PastoralAgentFormValues {
  name: string;
  title: string;
  actingRole: string;
  phone: string;
  email: string;
  communityId: string | null;
  serviceIds: string[];
  userId?: string | null;
  acceptsAppointments: boolean;
  active: boolean;
}
