'use client';

import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { MassScheduleItem } from './mass-schedule-item';
import useTranslator from '@/hooks/use-translator';
import useCalendarStore from '@/stores/useCalendarStore';
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useEffect } from 'react';
import { MassScheduleExceptionItem } from './mass-schedule-exception-item';
import Link from 'next/link';
import { EventScheduleItem } from './event-schedule-item';

interface CalendarViewProps {
  schedules: CalendarSchedule[];
}

export const CalendarView = ({ schedules }: CalendarViewProps) => {
  const { t } = useTranslator();
  const { calendar, setCalendar } = useCalendarStore();

  useEffect(() => {
    if (schedules.length > 0) {
      setCalendar(schedules);
    }
  }, [schedules, setCalendar]);

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
      {calendar.map((group) => {
        const { active, exceptions } = group.schedules;
        const totalSchedules = active.length + exceptions.length;

        return (
          <section key={group.date} className="flex flex-col items-start gap-4">
            <h2 className="text-lg font-medium text-primary">
              {t(`week-day-${group.dayOfWeek}`)},{' '}
              {dayjs(group.date).locale('pt-br').format('D [de] MMMM')}
            </h2>

            {active.length > 0 && (
              <ul className="space-y-4 flex-1 w-full">
                {active.map((schedule, idx) =>
                  schedule.type === 'mass' ? (
                    <MassScheduleItem
                      key={`${group.date}-${schedule.type}-active-${idx}`}
                      exceptionDate={group.date}
                      schedule={schedule}
                    />
                  ) : (
                    <EventScheduleItem
                      key={`${group.date}-${schedule.type}-active-${idx}`}
                      schedule={schedule}
                    />
                  )
                )}
              </ul>
            )}

            {totalSchedules === 0 && (
              <p className="text-zinc-500 mb-2">
                Nenhum agendamento para este dia
              </p>
            )}

            <Link href={`/calendar/add-event-schedule?date=${group.date}`}>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-transparent px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                Adicionar Compromisso Eventual
              </button>
            </Link>

            {exceptions.length > 0 && (
              <div className="w-full pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Agendamentos Cancelados
                </p>
                <ul className="space-y-4 flex-1 w-full">
                  {exceptions.map((schedule, idx) => (
                    <MassScheduleExceptionItem
                      key={`${group.date}-${schedule.type}-exception-${idx}`}
                      schedule={schedule}
                    />
                  ))}
                </ul>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
