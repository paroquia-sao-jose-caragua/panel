export interface AppointmentService {
  id: string;
  title: string;
  category: 'clergy_sacramental' | 'home_visit' | 'pastoral';
  description: string | null;
  defaultDurationMinutes: number;
  requiresAddress: boolean;
  active: boolean;
}
