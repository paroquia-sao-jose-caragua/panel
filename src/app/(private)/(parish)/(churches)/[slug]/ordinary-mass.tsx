import { useMassSchedules } from '@/api/communities/mass-schedules/use-mass-schedules';
import { useCommunity } from '@/api/communities/use-community';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TypographyH3 } from '@/components/ui/typography/h3';
import useTranslator from '@/hooks/use-translator';
import { PencilIcon, Plus } from 'lucide-react';
import Link from 'next/link';

export const OrdinaryMass = () => {
  const { t } = useTranslator();
  const { community } = useCommunity();
  const { massSchedules } = useMassSchedules();

  return (
    <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
      <div className="flex flex-row items-center justify-between p-6">
        <TypographyH3>Missas Regulares</TypographyH3>
        <Link href={`/${community?.slug}/add-ordinary-mass`}>
          <Button>
            <Plus />
            Adicionar
          </Button>
        </Link>
      </div>

      <div className="space-y-4 col-span-2 px-6 pb-6">
        {massSchedules.map((massSchedule) => (
          <div
            key={massSchedule.id}
            className="cursor:pointer flex flex-row items-center justify-between bg-brand-0 pl-4 pr-2 py-4 rounded-xl border border-brand-50 hover:shadow-md"
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
                href={`/${community?.slug}/${massSchedule.id}/edit-ordinary-mass`}
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
