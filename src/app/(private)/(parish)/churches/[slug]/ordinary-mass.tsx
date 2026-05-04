import { useMassSchedules } from '@/api/communities/mass-schedules/use-mass-schedules';
import { useCommunity } from '@/api/communities/use-community';
import { Button } from '@/components/ui/button';
import { TypographyH3 } from '@/components/ui/typography/h3';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const OrdinaryMass = () => {
  const { community } = useCommunity();

  const { massSchedules } = useMassSchedules();

  return (
    <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
      <div className="flex flex-row items-center justify-between p-6">
        <TypographyH3>Missas Regulares</TypographyH3>
        <Link href={`/churches/${community?.slug}/add-ordinary-mass`}>
          <Button>
            <Plus />
            Adicionar
          </Button>
        </Link>
      </div>
    </div>
  );
};
