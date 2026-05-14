'use client';

import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { Clock, MapPin } from 'lucide-react';

type Schedule = CalendarSchedule['schedules'][number];

interface ScheduleItemProps {
  schedule: Schedule;
}

export const ScheduleItem = ({ schedule }: ScheduleItemProps) => {
  const isMass = schedule.type === 'mass';

  return (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-brand-100 hover:border-brand-300 transition-colors">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm text-zinc-900">{schedule.title}</p>

        <p className="text-xs text-zinc-600">{schedule.community.name}</p>
      </div>

      <div className="flex flex-col gap-1 text-xs text-zinc-700">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-brand-500" />
          <span>
            {schedule.startTime}
            {schedule.endTime && ` - ${schedule.endTime}`}
          </span>
        </div>

        {!isMass && 'customLocation' in schedule && schedule.customLocation && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-brand-500" />
            <span>{schedule.customLocation}</span>
          </div>
        )}

        {isMass && 'address' in schedule.community && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-brand-500" />
            <span>{schedule.community.address}</span>
          </div>
        )}
      </div>

      {schedule.orientations && (
        <p className="text-xs text-zinc-600 line-clamp-2">
          {schedule.orientations}
        </p>
      )}

      {isMass && 'isPrecept' in schedule && schedule.isPrecept && (
        <div className="inline-flex w-fit">
          <span className="text-xs font-medium px-2 py-1 bg-brand-50 text-brand-700 rounded">
            Preceito
          </span>
        </div>
      )}
    </div>
  );
};
