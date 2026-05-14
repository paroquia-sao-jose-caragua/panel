'use client';

import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { ScheduleItem } from './schedule-item';
import useTranslator from '@/hooks/use-translator';
import { Plus } from 'lucide-react';

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
    <div className="w-full space-y-8">
      {schedules.map((group) => (
        <section key={group.date} className="flex flex-col items-start gap-4">
          <h2 className="text-lg font-medium text-primary">
            {t(`week-day-${group.dayOfWeek}`)},{' '}
            {new Date(group.date).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
            })}
          </h2>

          {group.schedules.length > 0 && (
            <ul className="space-y-4 flex-1 w-full">
              {group.schedules.map((schedule, idx) => (
                <ScheduleItem
                  key={`${group.date}-${schedule.type}-${idx}`}
                  schedule={schedule}
                />
              ))}
            </ul>
          )}

          {group.schedules.length === 0 && (
            <p className="text-zinc-500 mb-2">
              Nenhum agendamento para este dia
            </p>
          )}

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-transparent px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Novo Compromisso Eventual
          </button>
        </section>
      ))}
    </div>
  );
};
