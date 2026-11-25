import type { Schedule } from '@/entities/CalendarSchedule';

/**
 * Formats the display title for a calendar schedule item.
 * Prepends "Santa Missa – " when the item is a mass and has a title.
 */
export function formatScheduleTitle(schedule: Schedule): string {
  const isMass =
    schedule.type === 'mass' ||
    (schedule.type === 'event' && schedule.eventType === 'mass');
  const title = schedule.title?.trim();

  if (isMass) {
    return title ? `Santa Missa – ${title}` : 'Santa Missa';
  }

  return title || 'Celebração';
}
