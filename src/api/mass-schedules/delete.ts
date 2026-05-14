import { massSchedulesApi } from '@/api/utils/massSchedulesApi';

export const deleteMassSchedule = async ({
  massScheduleId,
}: {
  massScheduleId: string;
}) => {
  const result = await massSchedulesApi(`/${massScheduleId}`, {
    method: 'DELETE',
  });

  return result;
};
