import type { Community } from '@/entities/Community';
import { communityApi } from '../utils/communityApi';

interface UpdateCommunityResponse {
  community: Community;
}

export interface UpdateCommunityParams {
  id: string;
  name: string;
  type: string;
  address: string;
  coverId?: string;
  heroSubtitle?: string | null;
  aboutTitle?: string | null;
  aboutDescription?: string | null;
  historySummary?: string | null;
  patronName?: string | null;
  patronDescription?: string | null;
  patronPhotoId?: string | null;
  phone?: string | null;
  email?: string | null;
  officeHours?: string | null;
  photos?: {
    id?: string;
    photoId: string;
    caption?: string | null;
    orderIndex?: number;
  }[];
}

export const updateCommunity = async ({
  id,
  ...values
}: UpdateCommunityParams) => {
  const result = await communityApi<UpdateCommunityResponse>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });

  return result;
};

