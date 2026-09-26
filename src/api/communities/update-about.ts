import type { Community } from '@/entities/Community';
import { communityApi } from '../utils/communityApi';

interface UpdateCommunityAboutResponse {
  community: Community;
}

export interface UpdateCommunityAboutParams {
  id: string;
  heroSubtitle?: string | null;
  aboutTitle?: string | null;
  aboutDescription?: string | null;
  historySummary?: string | null;
}

export const updateCommunityAbout = async ({
  id,
  ...values
}: UpdateCommunityAboutParams) => {
  const result = await communityApi<UpdateCommunityAboutResponse>(`/${id}/about`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });

  return result;
};
