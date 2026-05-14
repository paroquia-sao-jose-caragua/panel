import type { Community } from './Community';

type MassSchedule = {
  massScheduleId: string;
  type: 'mass';
  title?: string;
  massType: 'ordinary' | 'devotional' | 'solemnity';
  orientations?: string;
  isPrecept: boolean;
  startTime: string;
  endTime: string;
  community: {
    id: string;
    type: Community['type'];
    name: string;
    address: string;
  };
};

type EventSchedule = {
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
  customLocation?: string;
  orientations?: string;
  startTime: string;
  endTime?: string;
  community: {
    id: string;
    type: Community['type'];
    name: string;
    address: string;
  };
};

export type Schedule = MassSchedule | EventSchedule;

export type CalendarSchedule = {
  date: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dayOfWeekLabel: string;
  schedules: Schedule[];
};
