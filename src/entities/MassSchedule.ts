export type MassSchedule = {
  id: string;
  communityId: string;
  title?: string;
  type: 'ordinary' | 'devotional' | 'solemnity';
  orientations?: string;
  isPrecept: boolean;
  recurrenceType: 'weekly' | 'monthly';
  dayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayOfMonth?: number;
  weekOfMonth?: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
  startTime: string; // "HH:MM"
};
