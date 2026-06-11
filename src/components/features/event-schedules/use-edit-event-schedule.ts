import { updateEventSchedule } from '@/api/event-schedules/update';
import { useEventSchedule } from '@/api/event-schedules/use-event-schedule';
import type { EventSchedule } from '@/entities/EventSchedule';
import type { MassSchedule } from '@/entities/MassSchedule';
import { useNavigate } from '@/hooks/use-navigate';
import useEventScheduleStore from '@/stores/useEventScheduleStore';
import { formatFullAddress, parseFullAddress } from '@/utils/formatFullAddress';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';

export const useEditEventSchedule = () => {
  const navigate = useNavigate();
  const { eventSchedule } = useEventSchedule();
  const { setEventSchedule } = useEventScheduleStore();

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: updateEventSchedule,
  });

  const formik = useFormik({
    initialValues: {
      communityId: eventSchedule?.communityId,
      title: eventSchedule?.title,
      type: eventSchedule?.type,
      massType: eventSchedule?.massType,
      eventDate: eventSchedule?.eventDate,
      startTime: eventSchedule?.startTime,
      isPrecept: eventSchedule?.isPrecept,
      endTime: eventSchedule?.endTime,
      ...parseFullAddress(eventSchedule?.customLocation),
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
          eventScheduleId: eventSchedule?.id as string,
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
              setEventSchedule(eventSchedule);
              navigate.replace('/calendar');
            }
          },
        }
      );
    },
  });

  return { formik, isPending };
};
