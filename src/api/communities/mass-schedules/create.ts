import { communityApi } from '@/api/utils/communityApi';

interface CreateMassScheduleResponse {
  community: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    type: 'parish' | 'chapel';
    address: string;
    coverId: string;
  };
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
  recurrenceType: 'weekly' | 'monthly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  weekOfMonth?: number;
  monthOfYear?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  times: { startTime: string; endTime: string }[]; // Array de horários no formato "HH:MM"
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
