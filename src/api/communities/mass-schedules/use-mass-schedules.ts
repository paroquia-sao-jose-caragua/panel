import useCommunityStore from '@/stores/useCommunityStore';
import { useQuery } from '@tanstack/react-query';
import { listCommunityMassSchedules } from './list';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export const useMassSchedules = () => {
  const { slug } = useParams<{ slug: string }>();
  const { community, massSchedules: storeMassSchedules, setMassSchedules } = useCommunityStore();

  const communityId = community?.slug === slug ? community.id : undefined;

  const { isPending: isQueryPending, isLoading, data } = useQuery({
    queryKey: ['community-mass-schedules', slug, communityId],
    queryFn: () =>
      listCommunityMassSchedules({ communityId: communityId as string }),
    refetchOnWindowFocus: false,
    enabled: Boolean(communityId),
  });

  const currentSchedules = data?.massSchedules ?? storeMassSchedules;

  useEffect(() => {
    if (data?.massSchedules) {
      setMassSchedules(data.massSchedules);
    }
  }, [data?.massSchedules, setMassSchedules]);

  const isPending = communityId
    ? (isQueryPending || isLoading) && (!currentSchedules || currentSchedules.length === 0)
    : false;

  return { massSchedules: currentSchedules, isPending };
};
