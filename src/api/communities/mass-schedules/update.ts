import { massSchedulesApi } from '@/api/utils/massSchedulesApi';

interface UpdateMassScheduleResponse {
  massSchedule: {
    id: string;
    communityId: string;
    type: 'ordinary' | 'devotional' | 'solemnity';
    isPrecept: boolean;
    recurrenceType: 'weekly' | 'monthly' | 'yearly';
    dayOfWeek?: number;
    active: boolean;
    startDate: string;
    times: [
      {
        id: string;
        scheduleId: string;
        startTime: string;
        endTime: string;
      },
      {
        id: string;
        scheduleId: string;
        startTime: string;
        endTime: string;
      },
    ];
  };
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
  recurrenceType: 'weekly' | 'monthly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  weekOfMonth?: number;
  monthOfYear?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  times: { startTime: string; endTime: string }[];
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
