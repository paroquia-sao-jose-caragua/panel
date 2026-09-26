import { communityApi } from '../../utils/communityApi';
import type { CommunityPhoto } from '@/entities/Community';

interface UpdateCommunityPhotosResponse {
  photos: CommunityPhoto[];
}

export const updateCommunityPhotos = async ({
  communityId,
  photos,
}: {
  communityId: string;
  photos: {
    id?: string;
    photoId: string;
    caption?: string | null;
    orderIndex?: number;
  }[];
}) => {
  const result = await communityApi<UpdateCommunityPhotosResponse>(
    `/${communityId}/photos`,
    {
      method: 'PUT',
      body: JSON.stringify({ photos }),
    }
  );

  return result;
};
