'use client';

import { AppHeader } from '@/components/common/header';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  X,
} from 'lucide-react';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useTranslator from '@/hooks/use-translator';
import { useQuery } from '@tanstack/react-query';
import { listCalendarSchedules } from '@/api/calendar/list';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Select, SelectItem } from '@/components/common/select';
import { useFormik } from 'formik';
import { useCommunities } from '@/api/communities/use-communities';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export default function ParochialCalendarPage() {
  const { t } = useTranslator();
  const { communities, isPending: isLoadingCommunities } = useCommunities();

  const [filters, setFilters] = useState<{
    communityId?: string;
    scheduleType?: 'all' | 'mass' | 'event';
  }>({
    scheduleType: 'all',
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Month>(
    (dayjs().get('month') + 1) as Month
  );

  const { isPending, data } = useQuery({
    queryKey: ['calendar-schedules', currentMonth, filters.communityId],
    queryFn: () =>
      listCalendarSchedules({
        month: currentMonth,
        year: dayjs().get('year'),
        communityId: filters.communityId,
      }),
    refetchOnWindowFocus: false,
  });

  const formik = useFormik({
    initialValues: {
      communityId: filters.communityId ?? '',
      scheduleType: filters.scheduleType ?? 'all',
    },
    onSubmit: (values) => {
      setFilters({
        communityId: values.communityId ? values.communityId : undefined,
        scheduleType: values.scheduleType as 'all' | 'mass' | 'event',
      });
      setOpenFilter(false);
    },
  });

  const months = useMemo(() => {
    const month = dayjs().get('month');

    return Array.from({ length: 6 }).map(
      (_, index) => ((month + index) % 12) + 1
    ) as Month[];
  }, []);

  const { disabledNextMonth, disabledPrevMonth, prevMonth, nextMonth } =
    useMemo(() => {
      const disabledPrevMonth =
        isPending || months.length === 0 || currentMonth === months[0];

      const disabledNextMonth =
        isPending ||
        months.length === 0 ||
        currentMonth === months[months.length - 1];

      const prevMonth = currentMonth === 1 ? 12 : ((currentMonth - 1) as Month);
      const nextMonth = currentMonth === 12 ? 1 : ((currentMonth + 1) as Month);

      return { disabledPrevMonth, disabledNextMonth, prevMonth, nextMonth };
    }, [currentMonth, isPending, months]);

  const handleChangeMonth = (month: string) => {
    setCurrentMonth(Number.parseInt(month) as Month);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 1 ? 12 : ((prev - 1) as Month)));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => ((prev % 12) + 1) as Month);
  };

  const handleRemoveFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  // Filter schedules by scheduleType if specified
  const filteredCalendarData = useMemo(() => {
    if (!data?.calendar) return [];
    if (!filters.scheduleType || filters.scheduleType === 'all') {
      return data.calendar;
    }

    return data.calendar.map((day) => {
      const filteredActive = day.schedules.active.filter((s) => {
        if (filters.scheduleType === 'mass') return s.type === 'mass';
        if (filters.scheduleType === 'event') return s.type === 'event';
        return true;
      });

      const filteredExceptions = day.schedules.exceptions.filter((s) => {
        if (filters.scheduleType === 'mass') return s.type === 'mass';
        if (filters.scheduleType === 'event') return s.type === 'event';
        return true;
      });

      return {
        ...day,
        schedules: {
          active: filteredActive,
          exceptions: filteredExceptions,
        },
      };
    });
  }, [data?.calendar, filters.scheduleType]);

  const selectedCommunityName = communities.find(
    (c) => c.id === filters.communityId
  )?.name;

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'programacao-e-eventos',
            href: ROUTES.CALENDAR.HOME,
            title: 'Programação & Eventos',
            icon: CalendarIcon,
          },
          {
            key: 'calendario',
            href: ROUTES.CALENDAR.VIEW,
            title: 'Calendário Paroquial',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <TypographyH1>Calendário Paroquial</TypographyH1>
            <Describe className="mt-1">
              Acompanhe a programação litúrgica e pastoral da paróquia, consulte as
              missas e visualize os eventos pontuais de cada comunidade.
            </Describe>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {/* Filter Dialog */}
            <Dialog open={openFilter} onOpenChange={setOpenFilter}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtros</span>
                  {(filters.communityId || filters.scheduleType !== 'all') && (
                    <span className="w-2 h-2 rounded-full bg-[#B8872E]" />
                  )}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filtrar Calendário</DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                  className="space-y-4 pt-2"
                >
                  <FieldGroup className="gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Comunidade
                    </label>
                    <Select
                      name="communityId"
                      placeholder="Todas as comunidades"
                      value={formik.values.communityId}
                      onValueChange={(val) =>
                        formik.setFieldValue('communityId', val === 'all' ? '' : val)
                      }
                    >
                      <SelectItem value="all" text="Todas as comunidades" />
                      {!isLoadingCommunities &&
                        communities.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            text={
                              c.type === 'parish_church'
                                ? `Paróquia ${c.name}`
                                : `Capela ${c.name}`
                            }
                          />
                        ))}
                    </Select>
                  </FieldGroup>

                  <FieldGroup className="gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Tipo de Compromisso
                    </label>
                    <Select
                      name="scheduleType"
                      placeholder="Todos os tipos"
                      value={formik.values.scheduleType}
                      onValueChange={(val) => formik.setFieldValue('scheduleType', val)}
                    >
                      <SelectItem value="all" text="Todos (Missas e Eventos)" />
                      <SelectItem value="mass" text="Apenas Missas Recorrentes" />
                      <SelectItem value="event" text="Apenas Eventos Pontuais" />
                    </Select>
                  </FieldGroup>

                  <DialogFooter className="pt-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          formik.resetForm();
                          setFilters({ scheduleType: 'all' });
                        }}
                      >
                        Limpar Filtros
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      Aplicar Filtros
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button asChild size="sm" className="gap-1.5 h-9 text-xs">
              <Link href={ROUTES.CALENDAR.ADD_EVENT}>
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Evento</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Active Filters Badges */}
        {(filters.communityId || (filters.scheduleType && filters.scheduleType !== 'all')) && (
          <div className="flex items-center flex-wrap gap-2 my-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Filtros:
            </span>

            {selectedCommunityName && (
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-200/80 shadow-2xs">
                <span className="text-zinc-500">Comunidade:</span>
                <span className="font-semibold text-zinc-900">
                  {selectedCommunityName}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="h-4 w-4 p-0 text-zinc-400 hover:text-zinc-800 ml-1"
                      onClick={() => handleRemoveFilter('communityId')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Remover</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {filters.scheduleType && filters.scheduleType !== 'all' && (
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-200/80 shadow-2xs">
                <span className="text-zinc-500">Tipo:</span>
                <span className="font-semibold text-zinc-900">
                  {filters.scheduleType === 'mass'
                    ? 'Missas Recorrentes'
                    : 'Eventos Pontuais'}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="h-4 w-4 p-0 text-zinc-400 hover:text-zinc-800 ml-1"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, scheduleType: 'all' }))
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Remover</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        )}

        {/* Month Selector Tabs */}
        <Tabs
          defaultValue={months[0]?.toString()}
          value={currentMonth.toString()}
          onValueChange={handleChangeMonth}
          className="w-full border-b border-separate mt-4"
        >
          <TabsList variant="line">
            {months.map((month) => (
              <TabsTrigger key={String(month)} value={month.toString()}>
                {t(`month-${month}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Calendar View Area */}
        <div className="mt-8">
          {isPending && (
            <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 shadow-xs">
              <Spinner className="text-[#B8872E] w-6 h-6" />
              <p className="text-sm font-medium text-zinc-600">
                Carregando agendamentos do calendário...
              </p>
            </div>
          )}

          {!isPending && <CalendarView schedules={filteredCalendarData} />}
        </div>

        {/* Prev / Next Month Navigation Footer */}
        <div className="flex flex-row justify-between items-center mt-10 pt-4 border-t border-zinc-200/80">
          {prevMonth && (
            <Button
              variant="outline"
              size="sm"
              disabled={disabledPrevMonth}
              onClick={handlePrevMonth}
              className="gap-1.5 text-xs h-9 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t(`month-${prevMonth}`)}</span>
            </Button>
          )}

          {nextMonth && (
            <Button
              variant="outline"
              size="sm"
              disabled={disabledNextMonth}
              onClick={handleNextMonth}
              className="gap-1.5 text-xs h-9 shadow-2xs ml-auto"
            >
              <span>{t(`month-${nextMonth}`)}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
