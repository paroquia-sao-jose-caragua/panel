'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Info,
  History,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useAppointments } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { AppointmentCard } from '@/components/features/minha-agenda/appointment-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function MinhaAgendaSchedulePage() {
  const { appointments, isPending } = useAppointments();

  // Current selected date state (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format('YYYY-MM-DD')
  );

  // Current viewing month
  const [currentMonth, setCurrentMonth] = useState(() => dayjs());

  // Month title formatted, e.g. "Outubro 2026"
  const monthTitle = useMemo(() => {
    const raw = currentMonth.locale('pt-br').format('MMMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [currentMonth]);

  // Center date for the 7-day strip (O dia de hoje fica no centro!)
  const centerDate = useMemo(() => {
    const today = dayjs();
    if (currentMonth.isSame(today, 'month')) {
      return today;
    }
    const targetDay = Math.min(today.date(), currentMonth.daysInMonth());
    return currentMonth.date(targetDay);
  }, [currentMonth]);

  // Generate 7-day strip with centerDate (HOJE no mês atual) exactly at the center (index 3)
  const weekDays = useMemo(() => {
    const days = [];
    for (let offset = -3; offset <= 3; offset++) {
      days.push(centerDate.add(offset, 'day'));
    }
    return days;
  }, [centerDate]);

  // Appointments mapping by date for indicators (only confirmed)
  const confirmedByDate = useMemo(() => {
    const map = new Map<string, number>();
    if (!appointments) return map;

    appointments.forEach((app) => {
      if (app.status === 'confirmed' && app.appointmentDate) {
        map.set(
          app.appointmentDate,
          (map.get(app.appointmentDate) || 0) + 1
        );
      }
    });
    return map;
  }, [appointments]);

  // Appointments for currently selected date
  const dayAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter(
        (app) =>
          app.status === 'confirmed' &&
          app.appointmentDate === selectedDate
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate]);

  // Label for selected date, e.g. "Quinta-feira, 1 de outubro"
  const selectedDateLabel = useMemo(() => {
    const d = dayjs(selectedDate).locale('pt-br');
    const raw = d.format('dddd, D [de] MMMM');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [selectedDate]);

  const handlePrevMonth = () => {
    const prev = currentMonth.subtract(1, 'month');
    setCurrentMonth(prev);
    const targetDay = Math.min(dayjs().date(), prev.daysInMonth());
    setSelectedDate(prev.date(targetDay).format('YYYY-MM-DD'));
  };

  const handleNextMonth = () => {
    const next = currentMonth.add(1, 'month');
    setCurrentMonth(next);
    const targetDay = Math.min(dayjs().date(), next.daysInMonth());
    setSelectedDate(next.date(targetDay).format('YYYY-MM-DD'));
  };

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Minha Agenda"
        rightAction={
          <div className="p-1 text-brand-300">
            <CalendarIcon className="w-5 h-5" />
          </div>
        }
      />

      <div className="px-4 pt-4 pb-8 space-y-6">
        {/* Month Navigator */}
        <section className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Mês anterior"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-base font-bold text-zinc-900 tracking-tight">
              {monthTitle}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Próximo mês"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Strip */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((d) => {
              const dateStr = d.format('YYYY-MM-DD');
              const isSelected = dateStr === selectedDate;
              const hasAppointments = (confirmedByDate.get(dateStr) || 0) > 0;
              const isToday = dateStr === dayjs().format('YYYY-MM-DD');

              // Weekday short, e.g. "Seg", "Ter", ...
              const weekDayName = d.locale('pt-br').format('ddd');
              const capWeekDay =
                weekDayName.charAt(0).toUpperCase() +
                weekDayName.slice(1, 3);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    'flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer relative select-none group',
                    isSelected
                      ? 'bg-brand-900 text-white shadow-xs'
                      : isToday
                      ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200/80'
                      : 'hover:bg-zinc-100 text-zinc-600'
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-semibold mb-1',
                      isSelected ? 'text-brand-300' : 'text-zinc-400'
                    )}
                  >
                    {capWeekDay}
                  </span>

                  <span
                    className={cn(
                      'text-sm font-bold tracking-tight',
                      isSelected ? 'text-white' : 'text-zinc-800',
                      isToday && !isSelected && 'text-brand-800 underline'
                    )}
                  >
                    {d.format('DD')}
                  </span>

                  {/* Indicator dot */}
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full mt-1 transition-opacity',
                      hasAppointments
                        ? isSelected
                          ? 'bg-brand-300'
                          : 'bg-emerald-600'
                        : 'opacity-0'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Day Schedule Title */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-zinc-900">
              {selectedDateLabel}
            </h2>
            <span className="text-xs font-medium text-zinc-500">
              {dayAppointments.length === 1
                ? '1 atendimento'
                : `${dayAppointments.length} atendimentos`}
            </span>
          </div>

          {/* List of day appointments */}
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : dayAppointments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-zinc-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-700">
                Nenhum atendimento confirmado nesta data
              </p>
              <p className="text-xs text-zinc-400">
                Os horários livres continuam disponíveis conforme sua grade semanal.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((app) => (
                <AppointmentCard key={app.id} appointment={app} />
              ))}
            </div>
          )}
        </section>

        {/* Informational Warning Note */}
        <section className="p-3.5 rounded-2xl bg-zinc-100/80 border border-zinc-200/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-600 leading-relaxed">
            A agenda pode estar sujeita a alterações. Em caso de cancelamento, você
            e o solicitante serão comunicados.
          </p>
        </section>

        {/* Discrete Archive Link */}
        <section className="pt-2 text-center">
          <Link
            href={ROUTES.MY_AGENDA.ARCHIVE}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors py-2 px-3 rounded-lg hover:bg-zinc-100 group"
          >
            <span>Ver histórico de atendimentos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      </div>
    </div>
  );
}
