import type { Community } from '@/entities/Community';
import { communityApi } from '../utils/communityApi';

interface GetCommunityBySlugResponse {
  community: Community;
}

export const getCommunityBySlug = async (slug: string) => {
  const result = await communityApi<GetCommunityBySlugResponse>(`/${slug}`);

  return result;
};
