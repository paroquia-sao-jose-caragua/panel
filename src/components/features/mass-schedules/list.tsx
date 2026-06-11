import { useMassSchedules } from '@/api/communities/mass-schedules/use-mass-schedules';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TypographyH3 } from '@/components/ui/typography/h3';
import { ClockIcon, InfoIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ListItem } from './list-item';
import type { MassScheduleType } from './utils/format-mass-schedule-description';

interface MassSchedulesListProps {
  title: string;
  type: MassScheduleType;
  typeFilter: string;
  addHref: string;
  editHrefPattern: (id: string) => string;
  info: string;
}

export const MassSchedulesList = ({
  title,
  type,
  typeFilter,
  addHref,
  editHrefPattern,
  info,
}: MassSchedulesListProps) => {
  const { massSchedules } = useMassSchedules();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const massSchedulesOfType = useMemo(
    () =>
      massSchedules.filter((massSchedule) => massSchedule.type === typeFilter),
    [massSchedules, typeFilter]
  );

  return (
    <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
      <div className="p-6">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TypographyH3>{title}</TypographyH3>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-5 w-5 p-0 hover:bg-transparent"
                  onMouseEnter={() => setIsPopoverOpen(true)}
                  onMouseLeave={() => setIsPopoverOpen(false)}
                >
                  <InfoIcon className="h-4 w-4 text-zinc-500 hover:text-zinc-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-80">
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-sm text-zinc-900">{title}</p>
                  <p className="text-sm text-zinc-600">{info}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

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
