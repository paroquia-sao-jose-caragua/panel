'use client';

import { listCommunities } from '@/api/communities/list';
import { AddCardNavigation } from '@/components/common/add-card-navigation';
import { ChurchCard } from '@/components/features/churches/church-card';
import { ChurchCardSkeleton } from '@/components/features/churches/church-card-skeleton';
import useCommunitiesStore from '@/stores/useCommunitiesStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const CommunitiesList = () => {
  const { communities, setCommunities } = useCommunitiesStore();

  const { data, isPending } = useQuery({
    queryKey: ['communities'],
    queryFn: listCommunities,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.communities) {
      setCommunities(data.communities);
    }
  }, [data?.communities, setCommunities]);

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
