'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { ptBR } from 'react-day-picker/locale';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  X,
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FieldGroup } from '@/components/ui/field';
import { Select, SelectItem } from '@/components/common/select';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/common/back-button';
import {
  useAppointments,
  usePastoralAgents,
  useAppointmentServices,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import { AppointmentCalendarItem } from '@/components/features/appointments/appointment-calendar-item';
import {
  AppointmentWhatsAppDialog,
  type WhatsAppTemplateType,
} from '@/components/features/appointments/appointment-whatsapp-dialog';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

dayjs.locale('pt-br');

function AppointmentsAgendaContent() {
  const searchParams = useSearchParams();
  const queryDate = searchParams?.get('date');

  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';
  const isStaffSecretaryOrAdmin =
    user?.role === 'admin' || user?.role === 'secretary';

  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents, isPending: isLoadingAgents } = usePastoralAgents();
  const { services, isPending: isLoadingServices } = useAppointmentServices();

  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  // Selected date state (defaults to queryDate if valid, otherwise today)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (queryDate && dayjs(queryDate).isValid()) {
      return queryDate;
    }
    return dayjs().format('YYYY-MM-DD');
  });

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

  // Calendar popover state
  const [openCalendarPicker, setOpenCalendarPicker] = useState(false);

  // Secondary filters state
  const [filters, setFilters] = useState<{
    agentId?: string;
    serviceId?: string;
  }>({});
  const [openFilter, setOpenFilter] = useState(false);
  const [tempAgentId, setTempAgentId] = useState<string>('all');
  const [tempServiceId, setTempServiceId] = useState<string>('all');

  // Cancellation and WhatsApp state
  const [cancellingAppointment, setCancellingAppointment] =
    useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [processingAppointmentId, setProcessingAppointmentId] = useState<
    string | null
  >(null);

  const [whatsAppDialogState, setWhatsAppDialogState] = useState<{
    open: boolean;
    appointment: Appointment | null;
    template: WhatsAppTemplateType;
    cancellationReason?: string;
  }>({
    open: false,
    appointment: null,
    template: 'reminder',
  });

  // Rolling list of days (past 60 to next 120 days)
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

  // Stable query window of appointments around current date
  const { queryStartDate, queryEndDate } = useMemo(() => {
    const d = dayjs(selectedDate);
    return {
      queryStartDate: d.subtract(45, 'day').format('YYYY-MM-DD'),
      queryEndDate: d.add(75, 'day').format('YYYY-MM-DD'),
    };
  }, [Math.floor(dayjs(selectedDate).diff(dayjs(), 'day') / 45)]);

  const effectiveAgentId = isPastoralAgent ? myAgent?.id : filters.agentId;

  // Query appointments for the visible window
  const { appointments, isPending, updateStatus } = useAppointments({
    startDate: queryStartDate,
    endDate: queryEndDate,
    status: 'confirmed',
    agentId: effectiveAgentId,
  });

  // Client-side filtering by service if selected
  const filteredAppointments = useMemo(() => {
    let list = (appointments || []).filter(
      (app) => app.status === 'confirmed'
    );
    if (filters.serviceId) {
      list = list.filter((app) => app.serviceId === filters.serviceId);
    }
    return list;
  }, [appointments, filters.serviceId]);

  // Appointment counts per date for horizontal strip indicators
  const confirmedByDate = useMemo(() => {
    const map = new Map<string, number>();
    filteredAppointments.forEach((app) => {
      if (app.appointmentDate) {
        map.set(
          app.appointmentDate,
          (map.get(app.appointmentDate) || 0) + 1
        );
      }
    });
    return map;
  }, [filteredAppointments]);

  // Appointments for the currently selected day
  const dayAppointments = useMemo(() => {
    return filteredAppointments
      .filter((app) => app.appointmentDate === selectedDate)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [filteredAppointments, selectedDate]);

  // Dynamic month title derived from selected date
  const monthTitle = useMemo(() => {
    const raw = dayjs(selectedDate).locale('pt-br').format('MMMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [selectedDate]);

  // Formatted label for selected date, e.g. "Sábado, 3 de outubro"
  const selectedDateLabel = useMemo(() => {
    const d = dayjs(selectedDate).locale('pt-br');
    const raw = d.format('dddd, D [de] MMMM');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [selectedDate]);

  const isCurrentSelectedToday = selectedDate === todayStr;
  const hasActiveFilters = Boolean(filters.agentId || filters.serviceId);

  // Center a given date element in the container
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

  // Initial centering
  useEffect(() => {
    const targetDate =
      queryDate && dayjs(queryDate).isValid()
        ? queryDate
        : selectedDateRef.current;

    const frame = requestAnimationFrame(() => {
      centerDateInView(targetDate, false);
    });
    const timer = setTimeout(() => {
      centerDateInView(targetDate, false);
    }, 100);
    const timer2 = setTimeout(() => {
      centerDateInView(targetDate, false);
    }, 250);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [centerDateInView, queryDate]);

  // Sync when query parameter 'date' changes
  useEffect(() => {
    if (queryDate && dayjs(queryDate).isValid()) {
      setSelectedDate(queryDate);
      centerDateInView(queryDate, false);
    }
  }, [queryDate, centerDateInView]);

  // Center date on window resize
  useEffect(() => {
    const handleResize = () => {
      centerDateInView(selectedDateRef.current, false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [centerDateInView]);

  // Click on a date in the strip
  const handleDateClick = useCallback(
    (dateStr: string) => {
      if (hasDraggedRef.current) return;
      setSelectedDate(dateStr);
      centerDateInView(dateStr, true);
    },
    [centerDateInView]
  );

  // Chevron step back/forward
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

  // Scroll detection
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
      const containerCenter = containerRect.left + containerRect.width / 2;

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

      if (closestDate && closestDate !== selectedDateRef.current) {
        setSelectedDate(closestDate);
      }
    }, 100);
  }, []);

  // Mouse drag handlers
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

  // Filter dialog handlers
  const handleApplyFilter = () => {
    setFilters({
      agentId: tempAgentId === 'all' ? undefined : tempAgentId,
      serviceId: tempServiceId === 'all' ? undefined : tempServiceId,
    });
    setOpenFilter(false);
  };

  const handleClearFilter = () => {
    setFilters({});
    setTempAgentId('all');
    setTempServiceId('all');
    setOpenFilter(false);
  };

  // Cancellation submission
  const handleCancelSubmit = async () => {
    if (!cancellingAppointment) return;
    const finalReason =
      cancellationReason.trim() || 'Houve um imprevisto na agenda pastoral';

    setProcessingAppointmentId(cancellingAppointment.id);
    try {
      await updateStatus({
        id: cancellingAppointment.id,
        status: 'cancelled',
        cancellationReason: finalReason,
      });

      const appointmentCancelled: Appointment = {
        ...cancellingAppointment,
        status: 'cancelled',
        cancellationReason: finalReason,
      };

      setCancellingAppointment(null);
      setCancellationReason('');

      if (isStaffSecretaryOrAdmin) {
        setWhatsAppDialogState({
          open: true,
          appointment: appointmentCancelled,
          template: 'cancellation',
          cancellationReason: finalReason,
        });
      }
    } finally {
      setProcessingAppointmentId(null);
    }
  };

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'agenda-pastoral',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agenda Pastoral',
            icon: CalendarCheck,
          },
          {
            key: 'agenda',
            href: ROUTES.APPOINTMENTS.AGENDA,
            title: 'Agenda',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        <div className="mb-2">
          <BackButton href={ROUTES.APPOINTMENTS.HOME} />
        </div>

        {/* 1. Header: Title, Subtitle, and ONLY "+ Novo atendimento" on the right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <TypographyH1>Agenda de Atendimentos</TypographyH1>
            <Describe className="mt-1">
              Visualização cronológica dos atendimentos confirmados distribuídos por dia e horário.
            </Describe>
          </div>
        </div>

        {/* 2. Horizontal Date Strip Navigation */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3 overflow-hidden">
          {/* Top Bar of Date Strip: Month title, chevrons, today button, calendar popover, and secondary filters */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handlePrevDay}
                aria-label="Dia anterior"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight capitalize font-serif">
                {monthTitle}
              </span>

              <button
                type="button"
                onClick={handleNextDay}
                aria-label="Próximo dia"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {!isCurrentSelectedToday && (
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 px-2.5 py-0.5 rounded-full transition active:scale-95 cursor-pointer ml-1"
                >
                  <ArrowLeft className="w-2.5 h-2.5 text-brand-700" />
                  <span>Hoje</span>
                </button>
              )}

              {/* Popover to jump directly to any date */}
              <Popover
                open={openCalendarPicker}
                onOpenChange={setOpenCalendarPicker}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
                    title="Escolher uma data específica"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dayjs(selectedDate).toDate()}
                    defaultMonth={dayjs(selectedDate).toDate()}
                    captionLayout="dropdown"
                    lang="pt-BR"
                    locale={ptBR}
                    onSelect={(date) => {
                      if (date) {
                        const dateStr = dayjs(date).format('YYYY-MM-DD');
                        setSelectedDate(dateStr);
                        centerDateInView(dateStr, true);
                        setOpenCalendarPicker(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Secondary Filters Button */}
            {isStaffSecretaryOrAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenFilter(true)}
                className={cn(
                  'gap-1.5 h-8 text-xs cursor-pointer shadow-2xs',
                  hasActiveFilters
                    ? 'border-[#11291f] text-[#11291f] bg-brand-50/50'
                    : 'text-zinc-600'
                )}
              >
                <Filter className="w-3.5 h-3.5 text-zinc-500" />
                <span>Filtros</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#11291f]" />
                )}
              </Button>
            )}
          </div>

          {/* Rolling Days Strip */}
          <div className="relative flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevDay}
              aria-label="Dia anterior"
              className="hidden sm:flex shrink-0 w-8 h-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 transition shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex items-center gap-1.5 overflow-x-auto select-none py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing flex-1"
            >
              {/* Left spacer so the active day centers accurately */}
              <div
                className="shrink-0 pointer-events-none"
                style={{ width: 'calc(50% - 36px)' }}
                aria-hidden="true"
              />

              {daysList.map((d) => {
                const dateStr = d.format('YYYY-MM-DD');
                const isSelected = dateStr === selectedDate;
                const hasAppointments = (confirmedByDate.get(dateStr) || 0) > 0;
                const isToday = dateStr === todayStr;

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
                      'flex flex-col items-center py-2 px-2.5 rounded-xl transition-all cursor-pointer relative select-none shrink-0 box-content min-w-[52px]',
                      isSelected
                        ? 'bg-[#11291f] text-white shadow-xs scale-105 z-10'
                        : isToday
                        ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200/80 hover:bg-brand-100'
                        : 'hover:bg-zinc-100 text-zinc-600'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] font-semibold mb-0.5 tracking-tight',
                        isSelected ? 'text-[#D6A64A]' : 'text-zinc-400'
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
                        isSelected
                          ? 'bg-[#D6A64A]'
                          : hasAppointments
                          ? 'bg-emerald-600'
                          : 'opacity-0'
                      )}
                    />
                  </button>
                );
              })}

              {/* Right spacer so the active day centers accurately */}
              <div
                className="shrink-0 pointer-events-none"
                style={{ width: 'calc(50% - 36px)' }}
                aria-hidden="true"
              />
            </div>

            <button
              type="button"
              onClick={handleNextDay}
              aria-label="Próximo dia"
              className="hidden sm:flex shrink-0 w-8 h-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 transition shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Active Filters Tag (Discrete) */}
        {hasActiveFilters && (
          <div className="flex items-center flex-wrap gap-2 mt-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Filtro ativo:
            </span>

            {filters.agentId && (
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium text-zinc-800 bg-white border border-zinc-200/80 shadow-2xs">
                <span className="text-zinc-500">Agente:</span>
                <span className="font-semibold text-zinc-900">
                  {agents?.find((a) => a.id === filters.agentId)?.name ||
                    'Agente'}
                </span>
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-800 ml-1 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, agentId: undefined }))
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {filters.serviceId && (
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium text-zinc-800 bg-white border border-zinc-200/80 shadow-2xs">
                <span className="text-zinc-500">Categoria:</span>
                <span className="font-semibold text-zinc-900">
                  {services?.find((s) => s.id === filters.serviceId)?.title ||
                    'Categoria'}
                </span>
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-800 ml-1 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, serviceId: undefined }))
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleClearFilter}
              className="text-xs text-brand-800 font-semibold hover:underline ml-1 cursor-pointer"
            >
              Limpar todos
            </button>
          </div>
        )}

        {/* 5. Conteúdo do Dia: Header outside cards with title, count, and "+ Adicionar atendimento" */}
        <section className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 capitalize font-serif">
                  {selectedDateLabel}
                </h2>
                {isCurrentSelectedToday && (
                  <Badge
                    className="bg-[#11291f] text-white border-transparent font-sans text-xs px-2.5 py-0.5 font-semibold rounded-full shadow-xs"
                  >
                    Hoje
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
                {dayAppointments.length === 0
                  ? '0 atendimentos confirmados'
                  : `${dayAppointments.length} ${
                      dayAppointments.length === 1
                        ? 'atendimento confirmado'
                        : 'atendimentos confirmados'
                    }`}
              </p>
            </div>

            <Button
              asChild
              size="sm"
              className="gap-1.5 h-9 text-xs cursor-pointer shadow-2xs bg-[#11291f] text-white hover:bg-[#1a3d2e] shrink-0 self-start sm:self-center"
            >
              <Link href={ROUTES.APPOINTMENTS.ADD_WITH_DATE(selectedDate)}>
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar atendimento</span>
              </Link>
            </Button>
          </div>

          {/* Appointments of Selected Day */}
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          ) : dayAppointments.length === 0 ? (
            /* 7. Dia sem atendimentos */
            <div className="bg-white border border-dashed border-zinc-200/90 rounded-2xl p-10 sm:p-14 text-center shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-900">
                  Nenhum atendimento confirmado nesta data
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                  Os horários livres continuam disponíveis conforme sua grade semanal.
                </p>
              </div>
            </div>
          ) : (
            /* 6. Cards dos Atendimentos */
            <ul className="space-y-3">
              {dayAppointments.map((app) => (
                <AppointmentCalendarItem
                  key={app.id}
                  appointment={app}
                  onCancel={(appointment) => {
                    setCancellingAppointment(appointment);
                    setCancellationReason('');
                  }}
                  onOpenWhatsApp={(appointment) => {
                    setWhatsAppDialogState({
                      open: true,
                      appointment,
                      template: 'reminder',
                    });
                  }}
                  isStaff={isStaffSecretaryOrAdmin}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* 8. Filtros Dialog */}
      <Dialog open={openFilter} onOpenChange={setOpenFilter}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filtros da Agenda</DialogTitle>
            <DialogDescription>
              Filtre os atendimentos por agente pastoral responsável ou categoria de atendimento.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="px-4 pb-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                Agente Pastoral
              </label>
              <Select
                name="agentId"
                placeholder="Todos os agentes pastorais"
                value={tempAgentId}
                onValueChange={(val) => setTempAgentId(val)}
              >
                <SelectItem value="all" text="Todos os agentes pastorais" />
                {isLoadingAgents && (
                  <SelectItem value="loading" text="Carregando agentes..." disabled />
                )}
                {!isLoadingAgents &&
                  (agents || []).map((agent) => (
                    <SelectItem
                      key={agent.id}
                      value={agent.id}
                      text={`${agent.title ? `${agent.title} ` : ''}${agent.name}`}
                    />
                  ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                Categoria / Serviço
              </label>
              <Select
                name="serviceId"
                placeholder="Todas as categorias"
                value={tempServiceId}
                onValueChange={(val) => setTempServiceId(val)}
              >
                <SelectItem value="all" text="Todas as categorias" />
                {isLoadingServices && (
                  <SelectItem value="loading" text="Carregando categorias..." disabled />
                )}
                {!isLoadingServices &&
                  (services || []).map((service) => (
                    <SelectItem
                      key={service.id}
                      value={service.id}
                      text={service.title}
                    />
                  ))}
              </Select>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClearFilter}>
              Limpar Filtros
            </Button>
            <Button
              type="button"
              className="bg-[#11291f] text-white hover:bg-[#1a3d2e]"
              onClick={handleApplyFilter}
              disabled={isPending}
            >
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Dialog */}
      <Dialog
        open={!!cancellingAppointment}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setCancellingAppointment(null);
            setCancellationReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Atendimento</DialogTitle>
            <DialogDescription>
              Informe o motivo do cancelamento do atendimento de{' '}
              <strong className="text-zinc-900">
                {cancellingAppointment?.requesterName || 'Fiel'}
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="px-4 pb-2">
            <Input
              name="reason"
              placeholder="Ex: Imprevisto com o sacerdote, recesso paroquial..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setCancellingAppointment(null);
                setCancellationReason('');
              }}
              disabled={!!processingAppointmentId}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleCancelSubmit}
              isLoading={!!processingAppointmentId}
              loadingText="Cancelando..."
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Dialog */}
      <AppointmentWhatsAppDialog
        open={whatsAppDialogState.open}
        onOpenChange={(open) =>
          setWhatsAppDialogState((prev) => ({ ...prev, open }))
        }
        appointment={whatsAppDialogState.appointment}
        initialTemplate={whatsAppDialogState.template}
        cancellationReason={whatsAppDialogState.cancellationReason}
      />
    </>
  );
}

export default function AppointmentsAgendaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-4">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      }
    >
      <AppointmentsAgendaContent />
    </Suspense>
  );
}
