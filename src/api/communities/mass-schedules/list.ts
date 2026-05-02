import { communityApi } from '@/api/utils/communityApi';
import type { MassSchedule } from '@/entities/MassSchedule';
interface ListCommunityMassSchedules {
  massSchedules: MassSchedule[];
}

export const listCommunityMassSchedules = async ({
  communityId,
}: {
  communityId: string;
}) => {
  const result = await communityApi<ListCommunityMassSchedules>(
    `/${communityId}/mass-schedules`
  );

  return result;
};
