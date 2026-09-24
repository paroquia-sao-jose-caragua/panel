'use client';

import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import { MassScheduleItem } from './mass-schedule-item';
import useTranslator from '@/hooks/use-translator';
import useCalendarStore from '@/stores/useCalendarStore';
import { CalendarDays, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useEffect } from 'react';
import { MassScheduleExceptionItem } from './mass-schedule-exception-item';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center shadow-xs">
        <div className="size-16 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] mx-auto mb-4">
          <CalendarDays className="w-8 h-8" />
        </div>
        <h3
          className="text-2xl font-semibold text-zinc-900 mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Nenhum agendamento para este mês
        </h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
          Não há missas ou eventos programados para o período selecionado.
        </p>
        <Button asChild size="sm" className="rounded-full px-6 shadow-md gap-1.5">
          <Link href="/calendar/add-event-schedule">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Adicionar primeiro evento</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10">
      {calendar.map((group) => {
        const { active, exceptions } = group.schedules;
        const totalSchedules = active.length + exceptions.length;

        return (
          <section key={group.date} className="space-y-4">
            {/* Date Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
              <div className="flex items-center gap-3">
                {/* Mini Calendar Date Badge */}
                <div className="flex flex-col items-center justify-center bg-white border border-[#D6A64A]/50 rounded-xl px-2.5 py-1 min-w-[52px] shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#B8872E] tracking-wider">
                    {dayjs(group.date).locale('pt-br').format('ddd')}
                  </span>
                  <span className="text-lg font-bold text-zinc-900 font-mono leading-none">
                    {dayjs(group.date).format('DD')}
                  </span>
                </div>

                <div>
                  <h3
                    className="text-xl sm:text-2xl font-semibold text-zinc-900 capitalize"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {t(`week-day-${group.dayOfWeek}`)},{' '}
                    {dayjs(group.date).locale('pt-br').format('D [de] MMMM')}
                  </h3>
                  <span className="text-xs text-zinc-500 font-medium">
                    {active.length === 0
                      ? 'Nenhum compromisso ativo'
                      : `${active.length} ${active.length === 1 ? 'compromisso ativo' : 'compromissos ativos'}`}
                  </span>
                </div>
              </div>

              {/* Add event button for this day */}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-dashed border-zinc-300 text-zinc-600 hover:border-[#B8872E] hover:text-[#B8872E] hover:bg-[#fefbf6] gap-1.5 text-xs h-8 self-start sm:self-center shrink-0 shadow-2xs"
              >
                <Link href={`/calendar/add-event-schedule?date=${group.date}`}>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar Evento</span>
                </Link>
              </Button>
            </div>

            {/* Active Schedule Cards List */}
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

            {/* Empty state for the day */}
            {totalSchedules === 0 && (
              <div className="bg-white/70 border border-dashed border-zinc-200/90 rounded-2xl p-6 text-center shadow-2xs w-full">
                <p className="text-sm font-medium text-zinc-500">
                  Nenhum agendamento para este dia
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Clique em &quot;Adicionar Evento&quot; para registrar um compromisso.
                </p>
              </div>
            )}

            {/* Exceptions (Cancelled Recurring Masses) */}
            {exceptions.length > 0 && (
              <div className="w-full pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Agendamentos Recorrentes Cancelados ({exceptions.length})
                  </span>
                </div>
                <ul className="space-y-3.5 flex-1 w-full">
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
