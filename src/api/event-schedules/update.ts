import type { EventSchedule } from '@/entities/EventSchedule';
import { eventSchedulesApi } from '../utils/eventSchedulesApi';

interface UpdateEventScheduleResponse {
  eventSchedule: EventSchedule;
}

export const updateEventSchedule = async ({
  eventScheduleId,
  ...values
}: {
  eventScheduleId: string;
  communityId: string;
  title: string;
  type: EventSchedule['type'];
  massType?: 'ordinary' | 'devotional' | 'solemnity' | 'sacramental';
  isPrecept?: boolean;
  eventDate: string;
  startTime: string;
  endTime?: string;
  customLocation?: string;
  orientations?: string;
}) => {
  const result = await eventSchedulesApi<UpdateEventScheduleResponse>(
    `/${eventScheduleId}`,
    {
      method: 'PUT',
      body: JSON.stringify(values),
    }
  );

  return result;
};
