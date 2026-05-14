'use client';

import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import { CalendarIcon } from 'lucide-react';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useTranslator from '@/hooks/use-translator';
import { useQuery } from '@tanstack/react-query';
import { listCalendarSchedules } from '@/api/calendar/list';

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export default function CalendarPage() {
  const { t } = useTranslator();

  const [currentMonth, setCurrentMonth] = useState<Month>(
    (dayjs().get('month') + 1) as Month
  );

  const { isPending, data } = useQuery({
    queryKey: ['calendar-schedules', currentMonth],
    queryFn: () =>
      listCalendarSchedules({ month: currentMonth, year: dayjs().get('year') }),
    refetchOnWindowFocus: false,
  });

  const months = useMemo(() => {
    const currentMonth = dayjs().get('month');

    return [
      (currentMonth % 12) + 1,
      ((currentMonth + 1) % 12) + 1,
      ((currentMonth + 2) % 12) + 1,
      ((currentMonth + 3) % 12) + 1,
      ((currentMonth + 4) % 12) + 1,
    ] as Month[];
  }, []);

  const handleChangeMonth = (month: string) => {
    setCurrentMonth(Number.parseInt(month) as Month);
  };

  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[
          { key: 'origin', href: '/', title: 'Agenda', icon: CalendarIcon },
        ]}
      />

      <TypographyH1>Agenda</TypographyH1>

      <Tabs
        defaultValue={months[0].toString()}
        onValueChange={handleChangeMonth}
      >
        <TabsList>
          {months.map((month) => (
            <TabsTrigger key={String(month)} value={month.toString()}>
              {t(`month-${month}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-8">
        <CalendarView schedules={data?.calendar ?? []} isPending={isPending} />
      </div>
    </main>
  );
}
