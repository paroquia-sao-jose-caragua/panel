'use client';

import { listCommunities } from '@/api/communities/list';
import { ChurchCard } from '@/components/features/churches/church-card';
import useCommunitiesStore from '@/stores/useCommunitiesStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const CommunitiesList = () => {
  const { communities, setCommunities } = useCommunitiesStore();

  const { data } = useQuery({
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
      {communities
        .sort((a, b) =>
          a.type === 'parish_church' && b.type === 'chapel' ? -1 : 1
        )
        .map((community) => (
          <ChurchCard key={community.id} community={community} />
        ))}
    </>
  );
};
