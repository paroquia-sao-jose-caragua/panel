import { eventSchedulesApi } from '../utils/eventSchedulesApi';

export const deleteEventSchedule = async (id: string) => {
  const result = await eventSchedulesApi(`/${id}`, {
    method: 'DELETE',
  });

  return result;
};
