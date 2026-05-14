import { useMassSchedules } from '@/api/communities/mass-schedules/use-mass-schedules';
import { useCommunity } from '@/api/communities/use-community';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { TypographyH3 } from '@/components/ui/typography/h3';
import useTranslator from '@/hooks/use-translator';
import { ClockIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { ListItem } from './list-item';

export const OrdinaryMassesList = () => {
  const { t } = useTranslator();
  const { community } = useCommunity();
  const { massSchedules } = useMassSchedules();

  const massSchedulesOfType = useMemo(
    () =>
      massSchedules.filter((massSchedule) => massSchedule.type === 'ordinary'),
    [massSchedules]
  );

  return (
    <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
      <div className="p-6">
        <div className="flex flex-row items-center justify-between">
          <TypographyH3>{t('ordinary-masses')}</TypographyH3>

          <Link href={`/${community?.slug}/add-ordinary-mass`}>
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
            <ListItem key={massSchedule.id} massSchedule={massSchedule} />
          ))}
        </div>
      </div>
    </div>
  );
};
