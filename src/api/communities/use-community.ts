import { getCommunityBySlug } from '@/api/communities/get';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const useCommunity = () => {
  const { slug } = useParams<{ slug: string }>();

  const { isPending, data } = useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunityBySlug(slug),
  });

  const community = data?.community;

  return { community, isPending };
};
