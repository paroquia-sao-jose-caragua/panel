import { massSchedulesApi } from '@/api/utils/massSchedulesApi';
import type { MassSchedule } from '@/entities/MassSchedule';

interface UpdateMassScheduleResponse {
  massSchedule: MassSchedule;
  statusCode: number;
  message: string;
}

export const updateMassSchedule = async ({
  massScheduleId,
  ...values
}: {
  massScheduleId: string;
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
  const result = await massSchedulesApi<UpdateMassScheduleResponse>(
    `/${massScheduleId}`,
    {
      method: 'PUT',
      body: JSON.stringify(values),
    }
  );

  return result;
};
