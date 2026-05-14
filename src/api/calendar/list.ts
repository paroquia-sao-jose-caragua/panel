import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { calendarApi } from '../utils/calendarApi';

interface ListCalendarSchedulesResponse {
  calendar: CalendarSchedule[];
}

export const listCalendarSchedules = async (values: {
  month: number;
  year: number;
}) => {
  const searchParams = new URLSearchParams({
    month: String(values.month),
    year: String(values.year),
  });

  const result = await calendarApi<ListCalendarSchedulesResponse>(
    `/?${searchParams}`,
    {
      method: 'GET',
    }
  );

  return result;
};
