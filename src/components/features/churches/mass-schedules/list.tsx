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

interface MassSchedulesListProps {
  type: 'ordinary' | 'devotional';
}

export const MassSchedulesList = ({ type }: MassSchedulesListProps) => {
  const { t } = useTranslator();
  const { community } = useCommunity();
  const { massSchedules } = useMassSchedules();

  const massSchedulesOfType = useMemo(
    () => massSchedules.filter((massSchedule) => massSchedule.type === type),
    [massSchedules, type]
  );

  return (
    <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
      <div className="flex flex-row items-center justify-between p-6">
        <TypographyH3>{t(`${type}-masses`)}</TypographyH3>
        <Link href={`/${community?.slug}/add-${type}-mass`}>
          <Button>
            <Plus />
            Adicionar
          </Button>
        </Link>
      </div>

      <div className="space-y-4 col-span-2 px-6 pb-6">
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
            <span className="text-md font-medium text-zinc-700">
              {massSchedule.recurrenceType === 'weekly' &&
              massSchedule.dayOfWeek !== undefined
                ? t(`week-day-${massSchedule.dayOfWeek}`)
                : null}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-md font-medium text-brand-800">
                {massSchedule.times.map((time) => time.startTime).join(', ')}
              </span>
              <Link
                href={`/${community?.slug}/${type}-mass/${massSchedule.id}/edit`}
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
  );
};
