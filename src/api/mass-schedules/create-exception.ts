import { massSchedulesApi } from '@/api/utils/massSchedulesApi';

export const createMassScheduleException = async ({
  massScheduleId,
  ...values
}: {
  massScheduleId: string;
  exceptionDate: string;
  reason: string;
  startTime: string
}) => {
  const result = await massSchedulesApi(`/${massScheduleId}/exceptions`, {
    method: 'POST',
    body: JSON.stringify(values),
  });

  return result;
};
