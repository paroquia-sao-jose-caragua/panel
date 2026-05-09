import { useMassSchedules } from '@/api/communities/mass-schedules/use-mass-schedules';
import { useCommunity } from '@/api/communities/use-community';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TypographyH3 } from '@/components/ui/typography/h3';
import useTranslator from '@/hooks/use-translator';
import { ClockIcon, PencilIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export const DevotionalMassesList = () => {
  const { t } = useTranslator();
  const { community } = useCommunity();
  const { massSchedules } = useMassSchedules();

  const massSchedulesOfType = useMemo(
    () =>
      massSchedules.filter(
        (massSchedule) => massSchedule.type === 'devotional'
      ),
    [massSchedules]
  );

  return (
    <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
      <div className="p-6">
        <div className="flex flex-row items-center justify-between">
          <TypographyH3>{t('devotional-masses')}</TypographyH3>

          <Link href={`/${community?.slug}/add-devotional-mass`}>
            <Button>
              <Plus />
              Adicionar
            </Button>
          </Link>
        </div>

        <div className="space-y-4 col-span-2 mt-4">
          {massSchedulesOfType.length === 0 && (
            <Empty className="border-2 border-dashed">
              <EmptyHeader>
                <EmptyMedia className="text-zinc-300">
                  <ClockIcon className="h-10 w-10" />
                </EmptyMedia>
                <EmptyTitle className="text-zinc-500 text-md">
                  Nenhum horário adicionado ainda
                </EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}

          {massSchedulesOfType.map((massSchedule) => (
            <div
              key={massSchedule.id}
              className="cursor:pointer flex flex-row items-center justify-between bg-brand-0 pl-4 pr-2 py-4 rounded-xl border border-brand-50"
            >
              <div className="flex flex-col">
                <span className="text-md font-medium text-zinc-700">
                  {massSchedule.title}
                </span>
                <span className="text-sm text-zinc-600">
                  {massSchedule.dayOfMonth
                    ? `Dia ${massSchedule.dayOfMonth} de cada mês`
                    : null}
                  {massSchedule.weekOfMonth
                    ? `${massSchedule?.dayOfWeek ? t(`week-day-${massSchedule.dayOfWeek}`) : ''} na ${massSchedule.weekOfMonth === 5 ? 'última' : `${massSchedule.weekOfMonth}ª`} semana do mês`
                    : null}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-md font-medium text-brand-800">
                  {massSchedule.times.map((time) => time.startTime).join(', ')}
                </span>
                <Link
                  href={`/${community?.slug}/devotional-mass/${massSchedule.id}/edit`}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon-lg">
                        <PencilIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Editar</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
