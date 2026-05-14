'use client';

import { createMassScheduleException } from '@/api/mass-schedules/create-exception';
import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { useMutation } from '@tanstack/react-query';
import { MapPin, X } from 'lucide-react';

type Schedule = CalendarSchedule['schedules'][number];

interface ScheduleItemProps {
  exceptionDate: string;
  schedule: Schedule;
}

export const ScheduleItem = ({ exceptionDate, schedule }: ScheduleItemProps) => {
  const isMass = schedule.type === 'mass';
  
  const {mutate, isPending} = useMutation({
    mutationFn: createMassScheduleException,
    networkMode: 'always'
  })

  const handleCancel = () => {
    if (schedule.type !== 'mass') return;

    mutate({
      massScheduleId: schedule.massScheduleId,
      exceptionDate,
      startTime: schedule.startTime,
      reason: ''
    })
  }

  return (
    <li className="group rounded-xl border border-brand-100 bg-brand-0 p-4 transition sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm tabular-nums text-muted-foreground">
          {schedule.startTime} — {schedule.endTime}
        </p>

        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
          onClick={handleCancel}
        >
          Desmarcar
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="flex items-end justify-between gap-4 mt-2 flex-wrap">
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
