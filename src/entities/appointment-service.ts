export type AppointmentServiceCategory =
  | 'clergy_sacramental'
  | 'home_visit'
  | 'pastoral';

export interface AppointmentService {
  id: string;
  title: string;
  category: AppointmentServiceCategory;
  description: string | null;
  defaultDurationMinutes: number;
  requiresAddress: boolean;
  active: boolean;
}
