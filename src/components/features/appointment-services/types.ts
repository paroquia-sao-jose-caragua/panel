import type { AppointmentServiceCategory } from '@/entities/appointment-service';

export interface AppointmentServiceFormValues {
  id?: string;
  title: string;
  category: AppointmentServiceCategory;
  description: string;
  defaultDurationMinutes: number;
  requiresAddress: boolean;
  active: boolean;
}
