'use client';

import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FunnelIcon,
  PlusIcon,
  XIcon,
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

export default function CalendarPage() {
  const { t } = useTranslator();
  const { communities, isPending: isLoadingCommunities } = useCommunities();

  const [filters, setFilters] = useState<{
    communityId?: string;
  }>({});
  const [openFilter, setOpenFilter] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Month>(
    (dayjs().get('month') + 1) as Month
  );

  const { isPending, data } = useQuery({
    queryKey: ['calendar-schedules', currentMonth, filters],
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
      communityId: filters.communityId,
    },
    onSubmit: (values) => {
      setFilters(values);
      setOpenFilter(false);
    },
  });

  const months = useMemo(() => {
    const currentMonth = dayjs().get('month');

    return Array.from({ length: 5 }).map(
      (_, index) => ((currentMonth + index) % 12) + 1
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
      const newFilters = prev;

      delete newFilters[filterKey];

      return { ...newFilters };
    });
  };

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      {/* Top Breadcrumb: Página raiz sem botão voltar e apenas o título do menu */}
      <AppBreadcrumb
        links={[
          { key: 'calendar', href: '/agenda', title: 'Agenda', icon: CalendarIcon },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <TypographyH1>Agenda</TypographyH1>

        <div className="flex items-center gap-2">
          <Dialog open={openFilter} onOpenChange={setOpenFilter}>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
                  <FunnelIcon className="w-3.5 h-3.5" />
                  <span>Filtros</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Filtrar Agenda</DialogTitle>
                </DialogHeader>

                <FieldGroup className="px-4 pb-4 gap-2">
                  <Select
                    name="communityId"
                    placeholder="Selecione a comunidade"
                    value={formik.values.communityId}
                    onValueChange={(newValue) =>
                      formik.setFieldValue('communityId', newValue)
                    }
                  >
                    {isLoadingCommunities && (
                      <SelectItem
                        value="none"
                        text="Carregando comunidades..."
                        disabled
                      />
                    )}
                    {!isLoadingCommunities &&
                      communities.map((community) => (
                        <SelectItem
                          key={community.id}
                          value={community.id}
                          text={
                            community.type === 'parish_church'
                              ? `Paróquia ${community.name}`
                              : `Capela ${community.name}`
                          }
                        />
                      ))}
                  </Select>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Limpar Filtros</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    onClick={formik.submitForm}
                    disabled={isPending}
                  >
                    Aplicar Filtros
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <Button asChild size="sm" className="gap-1.5 h-9 text-xs">
            <Link href="/agenda/adicionar-evento">
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Adicionar Evento</span>
            </Link>
          </Button>
        </div>
      </div>

      <Describe className="mb-6">
        Acompanhe a agenda pastoral da paróquia, consulte as missas recorrentes e adicione eventos pontuais para cada comunidade.
      </Describe>

      {Object.keys(filters).length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Filtros aplicados:
          </span>
          {filters.communityId && (
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-200/80 shadow-2xs">
              <span className="text-zinc-500">Comunidade:</span>
              <span className="font-semibold text-zinc-900">
                {communities.find((c) => c.id === filters.communityId)?.name}
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
                    <XIcon className="h-3 w-3" />
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

      <Tabs
        defaultValue={months[0].toString()}
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

      <div className="mt-8">
        {isPending && (
          <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 shadow-xs">
            <Spinner className="text-[#B8872E] w-6 h-6" />
            <p className="text-sm font-medium text-zinc-600">Carregando agendamentos da agenda...</p>
          </div>
        )}

        {!isPending && <CalendarView schedules={data?.calendar ?? []} />}
      </div>

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
  );
}
