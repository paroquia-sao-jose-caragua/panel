import useCommunityStore from '@/stores/useCommunityStore';
import { useQuery } from '@tanstack/react-query';
import { listCommunityMassSchedules } from './list';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export const useMassSchedules = () => {
  const { slug } = useParams<{ slug: string }>();
  const { community, massSchedules, setMassSchedules } = useCommunityStore();

  const { isPending, data } = useQuery({
    queryKey: ['community-mass-schedules', slug],
    queryFn: () =>
      listCommunityMassSchedules({ communityId: community?.id as string }),
    refetchOnWindowFocus: false,
    enabled: community?.id !== undefined && community?.slug === slug, // Only fetch if we have a community ID and the slug matches
  });

  useEffect(() => {
    if (data?.massSchedules) {
      setMassSchedules(data.massSchedules);
    }
  }, [data?.massSchedules, setMassSchedules]);

  return { massSchedules, isPending };
};
