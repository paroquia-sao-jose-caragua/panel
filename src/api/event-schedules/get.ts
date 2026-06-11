import type { EventSchedule } from '@/entities/EventSchedule';
import { eventSchedulesApi } from '../utils/eventSchedulesApi';

interface GetEventScheduleResponse {
  eventSchedule: EventSchedule;
}

export const getEventSchedule = async (id: string) => {
  const result = await eventSchedulesApi<GetEventScheduleResponse>(`/${id}`);

  return result;
};
