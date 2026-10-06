'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Plus,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { listCalendarSchedules } from '@/api/calendar/list';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export default function EventsAndProgrammingHomePage() {
  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  // Mini-calendar state (month view and selected date)
  const [calendarMonthDate, setCalendarMonthDate] = useState(() =>
    dayjs().startOf('month')
  );
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const currentMonthNum = calendarMonthDate.month() + 1;
  const currentYearNum = calendarMonthDate.year();

  // Query calendar schedules for the visible month + next month for seamless nextDays counts
  const { data: calendarData, isPending: isLoadingCalendar } = useQuery({
    queryKey: ['home-calendar-schedules', currentMonthNum, currentYearNum],
    queryFn: async () => {
      const resCurr = await listCalendarSchedules({
        month: currentMonthNum,
        year: currentYearNum,
      });

      const nextM = calendarMonthDate.add(1, 'month');
      const resNext = await listCalendarSchedules({
        month: nextM.month() + 1,
        year: nextM.year(),
      });

      return {
        calendar: [...(resCurr.calendar || []), ...(resNext.calendar || [])],
      };
    },
    refetchOnWindowFocus: false,
  });

  // Monday-based month grid calculation
  const monthStart = calendarMonthDate.startOf('month');
  const daysInMonth = calendarMonthDate.endOf('month').date();
  // Monday = 0, Tuesday = 1, ..., Sunday = 6
  const startDayOfWeekMonday = (monthStart.day() + 6) % 7;

  // Previous month padding days
  const prevMonth = calendarMonthDate.subtract(1, 'month');
  const daysInPrevMonth = prevMonth.endOf('month').date();
  const prevMonthDays = Array.from({ length: startDayOfWeekMonday }).map((_, i) => {
    return daysInPrevMonth - startDayOfWeekMonday + 1 + i;
  });

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

  // Next month padding days to complete multiple of 7
  const totalCells = startDayOfWeekMonday + daysInMonth;
  const nextMonthPadding = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonthDays = Array.from({ length: nextMonthPadding }).map((_, i) => i + 1);

  // Determine dot indicators for each calendar day
  const getDayDots = (dateStr: string) => {
    const dayData = calendarData?.calendar?.find((d) => d.date === dateStr);
    if (!dayData || dayData.schedules.active.length === 0) return [];

    const dots: ('mass' | 'celebration' | 'event' | 'other')[] = [];
    const hasMass = dayData.schedules.active.some((s) => s.type === 'mass');
    const hasCelebration = dayData.schedules.active.some(
      (s) =>
        s.type === 'event' &&
        (s.eventType === 'celebration' ||
          s.eventType === 'liturgical_event' ||
          s.eventType === 'feast')
    );
    const hasEvent = dayData.schedules.active.some(
      (s) =>
        s.type === 'event' &&
        s.eventType !== 'celebration' &&
        s.eventType !== 'liturgical_event' &&
        s.eventType !== 'feast'
    );
    const hasOther = dayData.schedules.exceptions.length > 0;

    if (hasMass) dots.push('mass');
    if (hasCelebration) dots.push('celebration');
    if (hasEvent) dots.push('event');
    if (hasOther) dots.push('other');

    return dots;
  };

  // Schedules for today / selected day
  const activeDayData = useMemo(() => {
    if (!calendarData?.calendar) return null;
    return calendarData.calendar.find((d) => d.date === selectedDate);
  }, [calendarData, selectedDate]);

  const todaySchedules = useMemo(() => {
    return activeDayData?.schedules.active || [];
  }, [activeDayData]);

  // Next 5 upcoming days
  const nextDays = useMemo(() => {
    return Array.from({ length: 5 }).map((_, index) => {
      const dateObj = dayjs().add(index + 1, 'day').locale('pt-br');
      const dateString = dateObj.format('YYYY-MM-DD');

      const dayData = calendarData?.calendar?.find((d) => d.date === dateString);
      const count = dayData?.schedules.active.length || 0;

      return {
        date: dateString,
        dayNum: dateObj.format('DD'),
        monthShort: dateObj.format('MMM').replace('.', '').toUpperCase(),
        dayOfWeek: dateObj.format('dddd'),
        count,
      };
    });
  }, [calendarData]);

  // Helper for community pill style and short name
  const getCommunityPillData = (communityName: string) => {
    const lower = communityName.toLowerCase();
    if (lower.includes('matriz')) {
      return {
        label: 'Matriz',
        className: 'bg-[#fef8ed] text-[#8a5b14] border border-[#f2dfb8]',
      };
    }
    if (lower.includes('edwiges')) {
      return {
        label: 'Santa Edwiges',
        className: 'bg-[#faf5ff] text-[#6b21a8] border border-[#e9d5ff]',
      };
    }
    if (lower.includes('rosário') || lower.includes('rosario')) {
      return {
        label: 'Nossa Senhora do Rosário',
        className: 'bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd]',
      };
    }
    if (lower.includes('família') || lower.includes('familia')) {
      return {
        label: 'Sagrada Família',
        className: 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]',
      };
    }
    if (lower.includes('sagrado coração') || lower.includes('coracao')) {
      return {
        label: 'Sagrado Coração de Jesus',
        className: 'bg-[#fff1f2] text-[#be123c] border border-[#fecdd3]',
      };
    }
    return {
      label: communityName,
      className: 'bg-zinc-100 text-zinc-800 border border-zinc-200',
    };
  };

  const isViewingToday = selectedDate === todayStr;

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'programacao-e-eventos',
            href: ROUTES.CALENDAR.HOME,
            title: 'Programação e Eventos',
            icon: CalendarIcon,
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
        {/* Top Header Section (Without Icon in Title as requested) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <TypographyH1>Programação e Eventos</TypographyH1>
            <Describe className="mt-1">
              Organize a programação pastoral e os eventos das comunidades da paróquia.
            </Describe>
          </div>

          <div className="self-start sm:self-center shrink-0">
            <Button
              asChild
              className="bg-[#11291f] text-white hover:bg-[#1a3d2e] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-xs shrink-0 self-start sm:self-center cursor-pointer gap-1.5"
            >
              <Link href={ROUTES.CALENDAR.ADD_EVENT}>
                <Plus className="w-4 h-4" />
                <span>Novo evento</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 2-Column Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Programação de hoje (compromissos do dia)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-zinc-700 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 font-serif">
                      {isViewingToday
                        ? 'Programação de hoje'
                        : `Programação de ${dayjs(selectedDate).locale('pt-br').format('D [de] MMMM')}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {!isViewingToday && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(todayStr)}
                      className="text-xs text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 h-8.5 rounded-xl cursor-pointer"
                    >
                      Voltar para hoje
                    </Button>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 h-8.5 rounded-xl cursor-pointer self-start sm:self-center shadow-2xs hover:bg-zinc-50"
                  >
                    <Link href={ROUTES.CALENDAR.VIEW}>
                      <span>Ver calendário completo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingCalendar && (
                <div className="p-12 flex flex-col items-center justify-center gap-3">
                  <Spinner className="text-[#B8872E] w-6 h-6" />
                  <p className="text-xs text-zinc-500">
                    Carregando compromissos do dia...
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoadingCalendar && todaySchedules.length === 0 && (
                <div className="p-10 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500/70 mx-auto" />
                  <h4 className="text-sm font-bold text-zinc-800">
                    {isViewingToday
                      ? 'Nenhuma celebração agendada para hoje'
                      : 'Nenhuma celebração agendada para esta data'}
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    {isViewingToday
                      ? 'A paróquia não possui missas ou eventos programados para o dia de hoje.'
                      : 'Não há celebrações ou eventos agendados para a data selecionada.'}
                  </p>
                </div>
              )}

              {/* Today's Schedules List */}
              {!isLoadingCalendar && todaySchedules.length > 0 && (
                <div className="divide-y divide-zinc-100">
                  {todaySchedules.map((schedule, idx) => {
                    const isMass = schedule.type === 'mass';
                    const pill = getCommunityPillData(schedule.community.name);

                    return (
                      <div
                        key={`${selectedDate}-${schedule.type}-${idx}`}
                        className="py-4 px-2 sm:px-4 flex items-center justify-between gap-4 hover:bg-zinc-50/70 rounded-xl transition-colors"
                      >
                        {/* Horário */}
                        <div className="font-bold text-sm text-zinc-900 w-14 shrink-0 font-mono">
                          {schedule.startTime}
                        </div>

                        {/* Título & Comunidade */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-zinc-900 truncate">
                            {schedule.title || (isMass ? 'Missa' : 'Celebração')}
                          </h4>
                          <p className="text-xs text-zinc-500 truncate mt-0.5 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{schedule.community.name}</span>
                            {schedule.type === 'event' &&
                              'customLocation' in schedule &&
                              schedule.customLocation && (
                                <span className="text-zinc-400">
                                  · {schedule.customLocation}
                                </span>
                              )}
                          </p>
                        </div>

                        {/* Badge Recorrente / Evento */}
                        <div className="hidden sm:block shrink-0">
                          {isMass ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                              Recorrente
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/80">
                              Evento
                            </span>
                          )}
                        </div>

                        {/* Community Pill on the Right */}
                        <div className="shrink-0">
                          <span
                            className={cn(
                              'inline-block text-[11px] sm:text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap',
                              pill.className
                            )}
                          >
                            {pill.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Calendário + Próximos dias                 */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* 1. CARD: CALENDÁRIO */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                <CalendarIcon className="w-5 h-5 text-zinc-700 shrink-0" />
                <h3 className="text-xl font-bold text-zinc-900 font-serif">
                  Calendário
                </h3>
              </div>

              {/* Month Navigation (< < Outubro 2026 > >) */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setCalendarMonthDate((prev) => prev.subtract(1, 'year'))
                    }
                    className="h-6 w-6 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                    title="Ano anterior"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setCalendarMonthDate((prev) => prev.subtract(1, 'month'))
                    }
                    className="h-6 w-6 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                    title="Mês anterior"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <span className="font-bold text-sm text-zinc-900 capitalize">
                  {monthStart.locale('pt-br').format('MMMM YYYY')}
                </span>

                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setCalendarMonthDate((prev) => prev.add(1, 'month'))
                    }
                    className="h-6 w-6 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                    title="Próximo mês"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setCalendarMonthDate((prev) => prev.add(1, 'year'))
                    }
                    className="h-6 w-6 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                    title="Próximo ano"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Day Headers (Seg, Ter, Qua, Qui, Sex, Sáb, Dom) */}
              <div className="grid grid-cols-7 text-center text-xs text-zinc-500 font-medium">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-y-1 text-center font-mono text-xs">
                {/* Previous month muted days */}
                {prevMonthDays.map((dayNum) => (
                  <div
                    key={`prev-${dayNum}`}
                    className="h-9 flex flex-col items-center justify-center text-zinc-400 opacity-60"
                  >
                    <span>{dayNum}</span>
                  </div>
                ))}

                {/* Current month days */}
                {currentMonthDays.map((dayNum) => {
                  const dateStr = monthStart
                    .date(dayNum)
                    .format('YYYY-MM-DD');
                  const isSelected = dateStr === selectedDate;
                  const dots = getDayDots(dateStr);

                  return (
                    <button
                      key={`curr-${dayNum}`}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className="h-9 flex flex-col items-center justify-center relative cursor-pointer group"
                    >
                      <span
                        className={cn(
                          'w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition-all',
                          isSelected
                            ? 'bg-[#183424] text-white shadow-2xs font-bold'
                            : 'text-zinc-800 group-hover:bg-zinc-100'
                        )}
                      >
                        {dayNum}
                      </span>

                      {/* Colored dots indicators */}
                      {dots.length > 0 && !isSelected && (
                        <div className="flex items-center justify-center gap-0.5 absolute bottom-0.5">
                          {dots.map((dotType, i) => (
                            <span
                              key={i}
                              className={cn(
                                'w-1 h-1 rounded-full',
                                dotType === 'mass' && 'bg-emerald-600',
                                dotType === 'celebration' && 'bg-purple-600',
                                dotType === 'event' && 'bg-amber-500',
                                dotType === 'other' && 'bg-blue-500'
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Next month muted days */}
                {nextMonthDays.map((dayNum) => (
                  <div
                    key={`next-${dayNum}`}
                    className="h-9 flex flex-col items-center justify-center text-zinc-400 opacity-60"
                  >
                    <span>{dayNum}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-3 border-t border-zinc-100 flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Missas</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Celebrações</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Eventos</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Outros</span>
                </span>
              </div>
            </div>

            {/* 2. CARD: PRÓXIMOS DIAS (Substituindo Comunidades, no estilo da Agenda Pastoral) */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                <CalendarDays className="w-5 h-5 text-zinc-700 shrink-0" />
                <h3 className="text-xl font-bold text-zinc-900 font-serif">
                  Próximos dias
                </h3>
              </div>

              <div className="divide-y divide-zinc-100">
                {nextDays.map((day) => (
                  <Link
                    key={day.date}
                    href={`${ROUTES.CALENDAR.VIEW}?date=${day.date}`}
                    className="py-3.5 flex items-center justify-between group hover:bg-zinc-50 px-2 -mx-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center min-w-10">
                      <span className="text-lg font-bold text-zinc-900 leading-none">
                        {day.dayNum}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                        {day.monthShort}
                      </span>
                    </div>

                    {/* Count */}
                    <div className="flex-1 text-left px-4">
                      <span className="text-xs sm:text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                        {day.count}{' '}
                        {day.count === 1 ? 'celebração' : 'celebrações'}
                      </span>
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
