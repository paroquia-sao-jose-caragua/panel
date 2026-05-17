import { createEventSchedule } from '@/api/event-schedules/create';
import type { EventSchedule } from '@/entities/EventSchedule';
import type { MassSchedule } from '@/entities/MassSchedule';
import { useNavigate } from '@/hooks/use-navigate';
import { formatFullAddress } from '@/utils/formatFullAddress';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';

interface UseCreateEventScheduleProps {
  eventDate?: string;
}

export const useCreateEventSchedule = ({
  eventDate,
}: UseCreateEventScheduleProps) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: createEventSchedule,
  });

  const formik = useFormik({
    initialValues: {
      communityId: '',
      massType: 'ordinary',
      startTime: '',
      endTime: '',
      eventDate,
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: 'Caraguatatuba',
      state: 'SP',
    } as {
      communityId: string;
      title: string;
      type: EventSchedule['type'];
      massType?: MassSchedule['type'] | 'sacramental';
      eventDate: string;
      startTime: string;
      isPrecept?: boolean;
      endTime?: string;
      customLocation?: string;
      street: string;
      number: string;
      district: string;
      zipCode: string;
      city: string;
      state: string;
      orientations?: string;
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(
        {
          communityId: values.communityId,
          title: values.title,
          type: values.type,
          massType: values.massType,
          eventDate: values.eventDate,
          startTime: values.startTime,
          isPrecept: values.isPrecept,
          endTime: values.endTime,
          customLocation: formatFullAddress(values),
          orientations: values.orientations,
        },
        {
          onSuccess: ({ eventSchedule }) => {
            if (eventSchedule) {
              navigate.replace('/calendar');
            }
          },
        }
      );
    },
  });

  return { formik, isPending };
};
