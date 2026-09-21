import { getCommunityBySlug } from '@/api/communities/get';
import useCommunityStore from '@/stores/useCommunityStore';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export const useCommunity = () => {
  const { slug } = useParams<{ slug: string }>();
  const { community: storeCommunity, setCommunity } = useCommunityStore();

  const { isPending: isQueryPending, isLoading, data } = useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunityBySlug(slug as string),
    enabled: Boolean(slug),
  });

  const currentCommunity =
    data?.community ?? (storeCommunity?.slug === slug ? storeCommunity : null);

  useEffect(() => {
    if (data?.community) {
      setCommunity(data.community);
    }
  }, [data?.community, setCommunity]);

  const isPending = (isQueryPending || isLoading) && !currentCommunity;

  return { community: currentCommunity, isPending };
};
