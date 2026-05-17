import type { Community } from './Community';
import type { MassScheduleException } from './MassScheduleException';

export type MassSchedule = {
  massScheduleId: string;
  type: 'mass';
  title?: string;
  massType: 'ordinary' | 'devotional' | 'solemnity';
  orientations?: string;
  isPrecept: boolean;
  startTime: string;
  endTime: string;
  cancellationReason?: string;
  community: {
    id: string;
    type: Community['type'];
    coverUrl: string;
    name: string;
    address: string;
  };
};

export type EventSchedule = {
  eventScheduleId: string;
  type: 'event';
  title: string;
  eventType:
    | 'mass'
    | 'pilgrimage'
    | 'service'
    | 'formation'
    | 'feast'
    | 'anniversary'
    | 'conference'
    | 'meeting'
    | 'celebration'
    | 'retreat'
    | 'liturgical_event'
    | 'ordination'
    | 'community_event'
    | 'other';
  massType?: 'ordinary' | 'devotional' | 'solemnity' | 'sacramental';
  isPrecept?: boolean;
  customLocation?: string;
  orientations?: string;
  startTime: string;
  endTime?: string;
  cancellationReason?: string;
  community: {
    id: string;
    type: Community['type'];
    coverUrl: string;
    name: string;
    address: string;
  };
};

export type Schedule = MassSchedule | EventSchedule;

export type ExceptionSchedule = Schedule & {
  exception: MassScheduleException;
};

export type CalendarSchedule = {
  date: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dayOfWeekLabel: string;
  schedules: {
    active: Schedule[];
    exceptions: ExceptionSchedule[];
  };
};
