import { massSchedulesApi } from '@/api/utils/massSchedulesApi';

export const deleteMassScheduleException = async ({
  exceptionId,
}: {
  exceptionId: string;
}) => {
  const result = await massSchedulesApi(`/exceptions/${exceptionId}`, {
    method: 'DELETE',
  });

  return result;
};