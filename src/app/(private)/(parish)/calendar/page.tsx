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

  console.log({ filters });

  const handleRemoveFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => {
      const newFilters = prev;

      delete newFilters[filterKey];

      return { ...newFilters };
    });
  };

  return (
    <main className="max-w-300 w-full px-4 pt-20 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[
          { key: 'origin', href: '/', title: 'Agenda', icon: CalendarIcon },
        ]}
      />

      <div className="flex flex-row justify-between w-full">
        <TypographyH1>Agenda</TypographyH1>

        <div className="flex items-center gap-2">
          <Dialog open={openFilter} onOpenChange={setOpenFilter}>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FunnelIcon />
                  Filtros
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Filtros</DialogTitle>
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

          <Link href="/calendar/add-event-schedule" className="hidden md:block">
            <Button>
              <PlusIcon />
              Adicionar Evento
            </Button>
          </Link>
        </div>
      </div>

      {Object.keys(filters).length > 0 && (
        <div className="flex items-center flex-wrap gap-2">
          <p className="text-sm text-zinc-500">Filtros aplicados:</p>
          {filters.communityId && (
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-primary bg-zinc-100 border border-divider">
              Comunidade:{' '}
              {communities.find((c) => c.id === filters.communityId)?.name}
              <button
                type="button"
                className="inline-flex shrink-0 text-xs font-medium text-muted-foreground"
                onClick={() => handleRemoveFilter('communityId')}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <XIcon className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Remover</p>
                  </TooltipContent>
                </Tooltip>
              </button>
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
          <div className="w-full rounded-lg pl-2">
            <div className="flex items-center justify-start gap-2">
              <p className="text-zinc-500">Carregando agenda</p>
              <Spinner className="text-zinc-500" />
            </div>
          </div>
        )}

        {!isPending && <CalendarView schedules={data?.calendar ?? []} />}
      </div>

      <div className="flex flex-row justify-between mt-8">
        {prevMonth && (
          <Button
            variant="ghost"
            disabled={disabledPrevMonth}
            onClick={handlePrevMonth}
            className="pl-0"
          >
            <ChevronLeft /> {t(`month-${prevMonth}`)}
          </Button>
        )}

        {nextMonth && (
          <Button
            variant="ghost"
            disabled={disabledNextMonth}
            onClick={handleNextMonth}
            className="pr-0"
          >
            {t(`month-${nextMonth}`)} <ChevronRight />
          </Button>
        )}
      </div>
    </main>
  );
}
