'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  Info,
  Clock,
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

  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  // Current selected date state (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format('YYYY-MM-DD')
  );

  const selectedDateRef = useRef(selectedDate);
  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  // Strip scrolling and element refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Desktop mouse dragging support
  const isMouseDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftStartRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  // Generate a continuous rolling range of days (60 days in past to 120 days in future)
  const daysList = useMemo(() => {
    const today = dayjs();
    const selected = dayjs(selectedDate);
    const defaultStart = today.subtract(60, 'day');
    const defaultEnd = today.add(120, 'day');

    const start = selected.isBefore(defaultStart)
      ? selected.subtract(30, 'day')
      : defaultStart;
    const end = selected.isAfter(defaultEnd)
      ? selected.add(30, 'day')
      : defaultEnd;

    const count = end.diff(start, 'day');
    const list = [];
    for (let i = 0; i <= count; i++) {
      list.push(start.add(i, 'day'));
    }
    return list;
  }, [Math.floor(dayjs(selectedDate).diff(dayjs(), 'day') / 60)]);

  // Month title formatted based on currently selected/centered date, e.g. "Outubro 2026"
  const monthTitle = useMemo(() => {
    const raw = dayjs(selectedDate).locale('pt-br').format('MMMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [selectedDate]);

  const isCurrentSelectedToday = selectedDate === todayStr;

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

  // Center a given date element in the container using viewport-independent getBoundingClientRect
  const centerDateInView = useCallback(
    (dateStr: string, smooth: boolean = true) => {
      const container = scrollContainerRef.current;
      const element = dayRefs.current.get(dateStr);
      if (!container || !element) return;

      isProgrammaticScroll.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      const elementCenter = elementRect.left + elementRect.width / 2;
      const diff = elementCenter - containerCenter;

      if (Math.abs(diff) > 1) {
        container.scrollTo({
          left: container.scrollLeft + diff,
          behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
        });
      }

      scrollTimeoutRef.current = setTimeout(
        () => {
          isProgrammaticScroll.current = false;
        },
        smooth ? 450 : 100
      );
    },
    []
  );

  // Position today in center on initial mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      centerDateInView(selectedDateRef.current, false);
    });
    const timer = setTimeout(() => {
      centerDateInView(selectedDateRef.current, false);
    }, 100);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [centerDateInView]);

  // Keep selected date centered when window or viewport resizes
  useEffect(() => {
    const handleResize = () => {
      centerDateInView(selectedDateRef.current, false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [centerDateInView]);

  // Click on a day
  const handleDateClick = useCallback(
    (dateStr: string) => {
      if (hasDraggedRef.current) return;
      setSelectedDate(dateStr);
      centerDateInView(dateStr, true);
    },
    [centerDateInView]
  );

  // Chevron arrow navigation (rolls days and centers)
  const handlePrevDay = useCallback(() => {
    const prevDate = dayjs(selectedDateRef.current)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    setSelectedDate(prevDate);
    centerDateInView(prevDate, true);
  }, [centerDateInView]);

  const handleNextDay = useCallback(() => {
    const nextDate = dayjs(selectedDateRef.current)
      .add(1, 'day')
      .format('YYYY-MM-DD');
    setSelectedDate(nextDate);
    centerDateInView(nextDate, true);
  }, [centerDateInView]);

  const handleGoToToday = useCallback(() => {
    setSelectedDate(todayStr);
    centerDateInView(todayStr, true);
  }, [todayStr, centerDateInView]);

  // Debounced scroll listener to detect center date when scrolling with touch/trackpad/mouse
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (isProgrammaticScroll.current) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter =
        containerRect.left + containerRect.width / 2;

      let closestDate = selectedDateRef.current;
      let minDistance = Infinity;

      dayRefs.current.forEach((el, dateStr) => {
        const elRect = el.getBoundingClientRect();
        const elCenter = elRect.left + elRect.width / 2;
        const distance = Math.abs(elCenter - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestDate = dateStr;
        }
      });

      if (closestDate) {
        if (closestDate !== selectedDateRef.current) {
          setSelectedDate(closestDate);
        }

        // Snap the closest date to the exact center
        const closestEl = dayRefs.current.get(closestDate);
        if (closestEl) {
          const elRect = closestEl.getBoundingClientRect();
          const elCenter = elRect.left + elRect.width / 2;
          const diff = elCenter - containerCenter;
          if (Math.abs(diff) > 1) {
            container.scrollTo({
              left: container.scrollLeft + diff,
              behavior: 'smooth',
            });
          }
        }
      }
    }, 100);
  }, []);

  // Desktop mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftStartRef.current = container.scrollLeft;
    hasDraggedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    container.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      if (hasDraggedRef.current) {
        handleScroll();
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Minha Agenda"
        hideBackButton
        rightAction={
          <Link
            href={ROUTES.MY_AGENDA.NEW_WITH_DATE(selectedDate)}
            aria-label="Agendar atendimento"
            className="p-1.5 rounded-full text-brand-300 hover:text-white hover:bg-brand-800 transition active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <CalendarPlus className="w-5 h-5" />
          </Link>
        }
      />

      <div className="px-4 pt-4 pb-8 space-y-6">
        {/* Month Navigator & Rolling Days Strip */}
        <section className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-2xs space-y-3 overflow-hidden">
          {/* Header with Chevrons and dynamic month title */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handlePrevDay}
              aria-label="Dia anterior"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-zinc-900 tracking-tight capitalize">
                {monthTitle}
              </span>
              {!isCurrentSelectedToday && (
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="text-[11px] font-semibold text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 px-2 py-0.5 rounded-full transition active:scale-95 cursor-pointer"
                >
                  Hoje
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextDay}
              aria-label="Próximo dia"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Horizontally Rolling Weekday Strip */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex items-center gap-1.5 overflow-x-auto select-none py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
          >
            {/* Left spacer so the first day can be perfectly centered */}
            <div
              className="shrink-0 pointer-events-none"
              style={{ width: 'calc(50% - 26px)' }}
              aria-hidden="true"
            />

            {daysList.map((d) => {
              const dateStr = d.format('YYYY-MM-DD');
              const isSelected = dateStr === selectedDate;
              const hasAppointments = (confirmedByDate.get(dateStr) || 0) > 0;
              const isToday = dateStr === todayStr;

              // Weekday short, e.g. "Seg", "Ter", ...
              const weekDayName = d.locale('pt-br').format('ddd');
              const capWeekDay =
                weekDayName.charAt(0).toUpperCase() +
                weekDayName.slice(1, 3);

              return (
                <button
                  key={dateStr}
                  ref={(el) => {
                    if (el) {
                      dayRefs.current.set(dateStr, el);
                    } else {
                      dayRefs.current.delete(dateStr);
                    }
                  }}
                  type="button"
                  onClick={() => handleDateClick(dateStr)}
                  className={cn(
                    'flex flex-col items-center py-2 px-1.5 rounded-xl transition-all cursor-pointer relative select-none shrink-0 w-[52px]',
                    isSelected
                      ? 'bg-brand-900 text-white shadow-xs scale-105 z-10'
                      : isToday
                      ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200/80 hover:bg-brand-100'
                      : 'hover:bg-zinc-100 text-zinc-600'
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-semibold mb-0.5 tracking-tight',
                      isSelected ? 'text-brand-300' : 'text-zinc-400'
                    )}
                  >
                    {capWeekDay}
                  </span>

                  <span
                    className={cn(
                      'text-base font-bold tracking-tight',
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

            {/* Right spacer so the last day can be perfectly centered */}
            <div
              className="shrink-0 pointer-events-none"
              style={{ width: 'calc(50% - 26px)' }}
              aria-hidden="true"
            />
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
