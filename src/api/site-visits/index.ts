import { api } from '../utils/api';

export interface DailyVisitCount {
  date: string;
  count: number;
}

export interface TopEntryPath {
  path: string;
  count: number;
}

export interface DeviceBreakdown {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface SiteVisitStats {
  todayCount: number;
  last7DaysCount: number;
  currentMonthCount: number;
  totalCount: number;
  periodDays: number;
  dailySeries: DailyVisitCount[];
  deviceBreakdown: DeviceBreakdown;
  topPaths: TopEntryPath[];
}

export async function getSiteVisitStats(days = 30) {
  return api<{ stats: SiteVisitStats }>(`/site-visits/stats?days=${days}`);
}
