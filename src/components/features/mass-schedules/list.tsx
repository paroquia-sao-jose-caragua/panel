import { useMassSchedules } from '@/api/communities/mass-schedules/use-mass-schedules';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { TypographyH3 } from '@/components/ui/typography/h3';
import { ClockIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { ListItem } from './list-item';
import type { MassScheduleType } from './utils/format-mass-schedule-description';

interface MassSchedulesListProps {
  title: string;
  type: MassScheduleType;
  typeFilter: string;
  addHref: string;
  editHrefPattern: (id: string) => string;
}

export const MassSchedulesList = ({
  title,
  type,
  typeFilter,
  addHref,
  editHrefPattern,
}: MassSchedulesListProps) => {
  const { massSchedules } = useMassSchedules();

  const massSchedulesOfType = useMemo(
    () =>
      massSchedules.filter((massSchedule) => massSchedule.type === typeFilter),
    [massSchedules, typeFilter]
  );

  return (
    <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
      <div className="p-6">
        <div className="flex flex-row items-center justify-between">
          <TypographyH3>{title}</TypographyH3>

          <Link href={addHref}>
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
            <ListItem
              key={massSchedule.id}
              massSchedule={massSchedule}
              type={type}
              editHref={editHrefPattern(massSchedule.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
