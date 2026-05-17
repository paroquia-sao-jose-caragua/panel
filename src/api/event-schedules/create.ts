import type { EventSchedule } from '@/entities/EventSchedule';
import { eventSchedulesApi } from '../utils/eventSchedulesApi';

interface CreateEventScheduleResponse {
  eventSchedule: EventSchedule;
}

export const createEventSchedule = async (values: {
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
  const result = await eventSchedulesApi<CreateEventScheduleResponse>('/', {
    method: 'POST',
    body: JSON.stringify(values),
  });

  return result;
};
