import type { Community } from '@/entities/Community';
import { communityApi } from '../utils/communityApi';

interface UpdateCommunityPatronResponse {
  community: Community;
}

export interface UpdateCommunityPatronParams {
  id: string;
  patronName?: string | null;
  patronDescription?: string | null;
  patronPhotoId?: string | null;
}

export const updateCommunityPatron = async ({
  id,
  ...values
}: UpdateCommunityPatronParams) => {
  const result = await communityApi<UpdateCommunityPatronResponse>(`/${id}/patron`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });

  return result;
};
