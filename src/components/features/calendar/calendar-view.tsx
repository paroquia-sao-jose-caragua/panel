'use client';

import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { ScheduleItem } from './schedule-item';
import useTranslator from '@/hooks/use-translator';

interface CalendarViewProps {
  schedules: CalendarSchedule[];
  isPending: boolean;
}

export const CalendarView = ({ schedules, isPending }: CalendarViewProps) => {
  const { t } = useTranslator();

  if (isPending) {
    return (
      <div className="w-full rounded-lg shadow-sm bg-white p-6">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-zinc-500">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="w-full rounded-lg shadow-sm bg-white p-6">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-zinc-500">Nenhum agendamento para este mês</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {schedules.map((day) => (
        <div
          key={day.date}
          className="rounded-lg shadow-sm bg-white overflow-hidden"
        >
          <div className="bg-gradient-to-r from-brand-50 to-brand-25 px-6 py-3 border-b border-brand-100">
            <p className="font-semibold text-zinc-900">
              {t(`week-day-${day.dayOfWeek}`)},{' '}
              {new Date(day.date).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>

          <div className="grid gap-3 p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {day.schedules.map((schedule, idx) => (
              <ScheduleItem
                key={`${day.date}-${schedule.type}-${idx}`}
                schedule={schedule}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
