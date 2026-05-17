import useCommunitiesStore from '@/stores/useCommunitiesStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { listCommunities } from './list';

export const useCommunities = () => {
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

  return { communities, isPending };
};
