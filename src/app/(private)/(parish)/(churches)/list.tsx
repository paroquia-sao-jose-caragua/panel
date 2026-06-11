'use client';

import { useCommunities } from '@/api/communities/use-communities';
import { AddCardNavigation } from '@/components/common/add-card-navigation';
import { ChurchCard } from '@/components/features/churches/church-card';
import { ChurchCardSkeleton } from '@/components/features/churches/church-card-skeleton';

export const CommunitiesList = () => {
  const { communities, isPending } = useCommunities();

  return (
    <>
      {isPending &&
        Array.from({ length: 3 }).map(() => (
          <ChurchCardSkeleton key={crypto.randomUUID()} />
        ))}

      {!isPending &&
        communities
          .sort((a, b) =>
            a.type === 'parish_church' && b.type === 'chapel' ? -1 : 1
          )
          .map((community) => (
            <ChurchCard key={community.id} community={community} />
          ))}

      {!isPending && (
        <AddCardNavigation
          title="Adicione uma igreja"
          subtitle="para gerenciar a programação e as informações de cada comunidade da paróquia."
          href="/add"
        />
      )}
    </>
    );
  };
