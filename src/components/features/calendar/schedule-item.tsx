'use client';

import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { MapPin, X } from 'lucide-react';

type Schedule = CalendarSchedule['schedules'][number];

interface ScheduleItemProps {
  schedule: Schedule;
}

export const ScheduleItem = ({ schedule }: ScheduleItemProps) => {
  const isMass = schedule.type === 'mass';

  return (
    <li className="group rounded-xl border border-brand-100 bg-brand-0 p-4 transition sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm tabular-nums text-muted-foreground">
          {schedule.startTime} — {schedule.endTime}
        </p>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
        >
          Desmarcar
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="flex items-end justify-between gap-4 mt-2">
        <div>
          <p className="mt-1 text-base font-semibold text-foreground">
            {isMass ? 'Santa Missa' : 'Compromisso Eventual'}
          </p>
          {schedule.title && (
            <p className="mt-1 text-sm text-muted-foreground">
              {schedule.title}
            </p>
          )}
        </div>
        <div className="mt-3 flex justify-end">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            {schedule.community.type === 'parish_church'
              ? 'Paróquia '
              : 'Capela '}
            {schedule.community.name}
            <MapPin className="h-3 w-3" />
          </span>
        </div>
      </div>
    </li>
  );
};
