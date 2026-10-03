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
import {
  CalendarOff,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  useMyPastoralAgent,
  useAgentBlockedDates,
} from '@/api/appointments/use-appointments';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { cn } from '@/lib/utils';
import type { AgentBlockedDate } from '@/entities/pastoral-agent';

function BloqueiosContent() {
  const searchParams = useSearchParams();
  const queryDate = searchParams?.get('date');

  const { agent: myAgent, isPending: isAgentPending } = useMyPastoralAgent();
  const agentId = myAgent?.id || '';

  const {
    blockedDates,
    isPending: isBlockedPending,
    removeBlockedDate,
  } = useAgentBlockedDates(agentId);

  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  // Compute first blocked date: first from today onwards, or first overall if none in the future
  const firstBlockedDate = useMemo(() => {
    if (!blockedDates || blockedDates.length === 0) return null;

    const sortedFuture = [...blockedDates]
      .filter((b) => b.blockedDate >= todayStr)
      .sort((a, b) => a.blockedDate.localeCompare(b.blockedDate));

    if (sortedFuture.length > 0) {
      return sortedFuture[0].blockedDate;
    }

    const sortedAll = [...blockedDates].sort((a, b) =>
      a.blockedDate.localeCompare(b.blockedDate)
    );
    return sortedAll[0].blockedDate;
  }, [blockedDates, todayStr]);

  // Selected date state: defaults to queryDate, or firstBlockedDate (if available), or today
  const [selectedDate, setSelectedDate] = useState(() => {
    if (queryDate && dayjs(queryDate).isValid()) {
      return queryDate;
    }
    return todayStr;
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

  // Deletion state
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

  // Map of blocks grouped by date
  const blockedByDate = useMemo(() => {
    const map = new Map<string, AgentBlockedDate[]>();
    if (!blockedDates) return map;

    blockedDates.forEach((b) => {
      if (b.blockedDate) {
        const list = map.get(b.blockedDate) || [];
        list.push(b);
        map.set(b.blockedDate, list);
      }
    });
    return map;
  }, [blockedDates]);

  // Generate a continuous rolling range of days (-60 to +120 days)
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

  // Month title for the rolling strip
  const monthTitle = useMemo(() => {
    const raw = dayjs(selectedDate).locale('pt-br').format('MMMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [selectedDate]);

  const isCurrentSelectedToday = selectedDate === todayStr;

  // Blocks for currently selected date
  const dayBlocks = useMemo(() => {
    return blockedByDate.get(selectedDate) || [];
  }, [blockedByDate, selectedDate]);

  // Label for selected date
  const selectedDateLabel = useMemo(() => {
    const d = dayjs(selectedDate).locale('pt-br');
    const raw = d.format('dddd, D [de] MMMM');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [selectedDate]);

  // Center given date element in the container
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

  // Position today in center on initial mount (fallback)
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

  // Auto-select and center the first blocked date as soon as blocked dates are loaded (or queryDate)
  const hasAutoCentered = useRef(false);

  useEffect(() => {
    if (hasAutoCentered.current) return;

    if (queryDate && dayjs(queryDate).isValid()) {
      hasAutoCentered.current = true;
      setSelectedDate(queryDate);
      const frame = requestAnimationFrame(() => centerDateInView(queryDate, false));
      const timer = setTimeout(() => centerDateInView(queryDate, false), 150);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
      };
    }

    if (firstBlockedDate) {
      hasAutoCentered.current = true;
      setSelectedDate(firstBlockedDate);
      const frame = requestAnimationFrame(() =>
        centerDateInView(firstBlockedDate, false)
      );
      const timer = setTimeout(
        () => centerDateInView(firstBlockedDate, false),
        150
      );
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
      };
    }
  }, [firstBlockedDate, queryDate, centerDateInView]);

  // Click on a day
  const handleDateClick = useCallback(
    (dateStr: string) => {
      if (hasDraggedRef.current) return;
      setSelectedDate(dateStr);
      centerDateInView(dateStr, true);
    },
    [centerDateInView]
  );

  // Chevron arrow navigation
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

  // Scroll listener for drag centering
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestDate = '';
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

  const handleConfirmDelete = async () => {
    if (!deletingBlockId) return;
    try {
      await removeBlockedDate(deletingBlockId);
      setDeletingBlockId(null);
    } catch {
      // Handled
    }
  };

  const isInitialLoading = isAgentPending || isBlockedPending;

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Bloqueios de Agenda"
        backHref={ROUTES.MY_AGENDA.PROFILE}
        rightAction={
          <Link
            href={ROUTES.MY_AGENDA.SETTINGS.NEW_BLOCK_WITH_DATE(selectedDate)}
            aria-label="Novo bloqueio"
            className="p-1.5 rounded-full text-brand-300 hover:text-white hover:bg-brand-800 transition active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </Link>
        }
      />

      <div className="px-4 pt-4 pb-28 space-y-6">
        {/* Month Navigator & Rolling Days Strip (Identical to Agenda) */}
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
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 px-2 py-0.5 rounded-full transition active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-2.5 h-2.5 text-brand-700" />
                  <span>Hoje</span>
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
            {/* Left spacer so first day can be centered */}
            <div
              className="shrink-0 pointer-events-none"
              style={{ width: 'calc(50% - 26px)' }}
              aria-hidden="true"
            />

            {daysList.map((d) => {
              const dateStr = d.format('YYYY-MM-DD');
              const isSelected = dateStr === selectedDate;
              const hasBlocks = (blockedByDate.get(dateStr)?.length || 0) > 0;
              const isToday = dateStr === todayStr;

              const weekDayName = d.locale('pt-br').format('ddd');
              const capWeekDay =
                weekDayName.charAt(0).toUpperCase() + weekDayName.slice(1, 3);

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
                      'text-sm font-bold',
                      isSelected
                        ? 'text-white'
                        : isToday
                        ? 'text-brand-900'
                        : 'text-zinc-800'
                    )}
                  >
                    {d.format('D')}
                  </span>

                  {/* Indicator Dot for Blocked Day */}
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full mt-1 transition-opacity',
                      hasBlocks
                        ? isSelected
                          ? 'bg-rose-300 opacity-100'
                          : 'bg-rose-600 opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </button>
              );
            })}

            {/* Right spacer */}
            <div
              className="shrink-0 pointer-events-none"
              style={{ width: 'calc(50% - 26px)' }}
              aria-hidden="true"
            />
          </div>
        </section>

        {/* Selected Date Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-zinc-800 tracking-tight">
              {selectedDateLabel}
            </h2>
            {dayBlocks.length > 0 ? (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">
                {dayBlocks.length === 1 ? '1 bloqueio' : `${dayBlocks.length} bloqueios`}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Livre</span>
              </span>
            )}
          </div>

          {isInitialLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : dayBlocks.length > 0 ? (
            <div className="space-y-3">
              {dayBlocks.map((block) => {
                const isFullDay = !block.startTime || !block.endTime;

                return (
                  <div
                    key={block.id}
                    className="p-4 bg-white rounded-2xl border border-rose-100 shadow-2xs hover:border-rose-200 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80">
                          <CalendarOff className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold text-rose-800">
                          {isFullDay
                            ? 'Dia inteiro bloqueado'
                            : `${block.startTime} — ${block.endTime}`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeletingBlockId(block.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        title="Remover bloqueio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-zinc-800">
                      {block.reason || 'Indisponibilidade pastoral'}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                      <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>
                        {isFullDay
                          ? 'Sem agendamentos neste dia'
                          : `Indisponível das ${block.startTime} às ${block.endTime}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center bg-white rounded-2xl border border-zinc-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100/80 flex items-center justify-center mx-auto shadow-2xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900">
                  Data disponível para atendimentos
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Não há nenhum bloqueio registrado para este dia. Fiéis podem solicitar
                  atendimentos conforme sua grade.
                </p>
              </div>

              <div className="pt-1">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-zinc-300 hover:bg-zinc-50 text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Link href={ROUTES.MY_AGENDA.SETTINGS.NEW_BLOCK_WITH_DATE(selectedDate)}>
                    <Plus className="w-3.5 h-3.5 text-brand-800" />
                    <span>Bloquear este dia</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 py-3">
        <div className="max-w-lg mx-auto">
          <Button
            asChild
            className="w-full h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-md active:scale-[0.99] gap-2 cursor-pointer"
          >
            <Link href={ROUTES.MY_AGENDA.SETTINGS.NEW_BLOCK_WITH_DATE(selectedDate)}>
              <Plus className="w-4 h-4 text-brand-300" />
              <span>Novo bloqueio</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={Boolean(deletingBlockId)}
        onOpenChange={(open) => !open && setDeletingBlockId(null)}
        onConfirm={handleConfirmDelete}
        title="Remover bloqueio de data"
        description="Tem certeza de que deseja remover este bloqueio? A data voltará a ficar disponível para novos agendamentos na paróquia."
      />
    </div>
  );
}

export default function MinhaAgendaBloqueiosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-1 p-4 space-y-4">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      }
    >
      <BloqueiosContent />
    </Suspense>
  );
}
