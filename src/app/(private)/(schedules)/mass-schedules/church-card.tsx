import { listCommunityMassSchedules } from '@/api/communities/mass-schedules/list';
import Button from '@/components/Button';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export interface ChurchCardProps {
  community: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    type: 'parish_church' | 'chapel';
    address: string;
    coverId: string;
    coverUrl: string;
  };
}

export const ChurchCard = ({ community }: ChurchCardProps) => {
  const [open, setOpen] = useState(false);
  const [parent] = useAutoAnimate();

  const { data } = useQuery({
    queryKey: ['community-mass-schedules', community.id],
    queryFn: () => listCommunityMassSchedules({ communityId: community.id }),
    refetchOnWindowFocus: false,
    enabled: open,
  });

  const massSchedules = data?.massSchedules || [];

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg shadow-sm bg-white hover:ring-1 hover:ring-brand-300 transition cursor-pointer outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 overflow-hidden"
    >
      <Collapsible.Trigger className="group w-full group flex items-center gap-3 rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-brand-400 outline-none transition-colors">
        <Image
          src={community.coverUrl}
          width={48}
          height={48}
          alt=""
          className="rounded-full object-cover w-12 h-12"
        />
        <span className="font-medium text-lg text-brand-900">{community.name}</span>
        <ChevronDown className="ml-auto h-5 w-5 text-brand-500 group-hover:text-brand-500 group-data-[state=open]:rotate-180 transition-transform" />
      </Collapsible.Trigger>
      <Collapsible.Content ref={parent}>
        <div className='p-2'>
          <div className='rounded-lg border border-zinc-200 flex flex-row items-center justify-between px-3 py-3'>
            <span className="text-md">Missas Regulares</span>
            <Button>Adicionar</Button>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
