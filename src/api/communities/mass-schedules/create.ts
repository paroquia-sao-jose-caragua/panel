import { communityApi } from '@/api/utils/communityApi';
import type { MassSchedule } from '@/entities/MassSchedule';

interface CreateMassScheduleResponse {
  massSchedule: MassSchedule;
}

export const createMassSchedule = async ({
  communityId,
  ...values
}: {
  communityId: string;
  title?: string;
  type: 'ordinary' | 'devotional' | 'solemnity';
  orientations?: string;
  isPrecept: boolean;
  recurrenceType: 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  weekOfMonth?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  startTime: string; // "HH:MM"
}) => {
  const result = await communityApi<CreateMassScheduleResponse>(
    `/${communityId}/mass-schedules`,
    {
      method: 'POST',
      body: JSON.stringify(values),
    }
  );

  return result;
};
