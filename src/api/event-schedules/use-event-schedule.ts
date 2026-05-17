import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { getEventSchedule } from './get';
import useEventScheduleStore from '@/stores/useEventScheduleStore';

export const useEventSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const { eventSchedule, setEventSchedule } = useEventScheduleStore();

  const { isPending, data } = useQuery({
    queryKey: ['event-schedule', id],
    queryFn: () => getEventSchedule(id),
    enabled: eventSchedule?.id !== id, // Only fetch if the current event schedule is different from the id
  });

  useEffect(() => {
    if (data?.eventSchedule) {
      setEventSchedule(data.eventSchedule);
    }
  }, [data?.eventSchedule, setEventSchedule]);

  return { eventSchedule, isPending };
};
