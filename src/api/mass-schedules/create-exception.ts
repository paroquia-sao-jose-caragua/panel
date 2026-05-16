import { massSchedulesApi } from '@/api/utils/massSchedulesApi';
import type { MassScheduleException } from '@/entities/MassScheduleException';

interface ResponseData {
  massScheduleException: MassScheduleException;
}

export const createMassScheduleException = async ({
  massScheduleId,
  ...values
}: {
  massScheduleId: string;
  exceptionDate: string;
  reason: string;
  startTime: string;
}) => {
  const result = await massSchedulesApi<ResponseData, 'reason'>(
    `/${massScheduleId}/exceptions`,
    {
      method: 'POST',
      body: JSON.stringify(values),
    }
  );

  return result;
};
