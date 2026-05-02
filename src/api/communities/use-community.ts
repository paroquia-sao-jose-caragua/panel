import { getCommunityBySlug } from '@/api/communities/get';
import useCommunityStore from '@/stores/useCommunityStore';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export const useCommunity = () => {
  const { slug } = useParams<{ slug: string }>();
  const { community, setCommunity } = useCommunityStore();

  const { isPending, data } = useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunityBySlug(slug),
    enabled: community?.slug !== slug, // Only fetch if the current community is different from the slug
  });

  useEffect(() => {
    if (data?.community) {
      setCommunity(data.community);
    }
  }, [data?.community, setCommunity]);

  return { community, isPending };
};
