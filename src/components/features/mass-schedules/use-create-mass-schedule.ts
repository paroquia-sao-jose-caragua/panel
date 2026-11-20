import { createMassSchedule } from '@/api/communities/mass-schedules/create';
import { useCommunity } from '@/api/communities/use-community';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from '@/hooks/use-navigate';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFormik } from 'formik';

interface UseCreateMassScheduleProps {
  type: 'ordinary' | 'devotional';
}

export const useCreateMassSchedule = ({ type }: UseCreateMassScheduleProps) => {
  const { community } = useCommunity();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: createMassSchedule,
  });

  const formik = useFormik({
    initialValues: {
      isPrecept: false,
      isSolemn: false,
      recurrenceType: 'weekly',
      startDate: dayjs().format('YYYY-MM-DD'),
      startTime: '',
    } as {
      title?: string;
      isPrecept: boolean;
      isSolemn: boolean;
      recurrenceType: 'weekly' | 'monthly' | 'week-of-month';
      dayOfWeek?: 0 | 2 | 1 | 3 | 4 | 5 | 6;
      dayOfMonth?: number;
      weekOfMonth?: number;
      startDate: string;
      endDate?: string;
      startTime: string;
      orientations?: string;
    },
    onSubmit: (values) => {
      mutate(
        {
          communityId: community?.id as string,
          type: values.isSolemn ? 'solemnity' : type,
          title: values?.title,
          isPrecept: values.isPrecept,
          recurrenceType:
            values.recurrenceType === 'week-of-month'
              ? 'monthly'
              : values.recurrenceType,
          dayOfWeek: values?.dayOfWeek,
          dayOfMonth: values?.dayOfMonth,
          weekOfMonth: values?.weekOfMonth,
          startDate: values.startDate,
          endDate: values?.endDate,
          startTime: values.startTime,
          orientations: values?.orientations,
        },
        {
          onSuccess: ({ massSchedule, statusCode, message }) => {
            if (massSchedule) {
              navigate.replace(ROUTES.COMMUNITIES.DETAILS(community?.slug || ''));
            }
          },
        }
      );
    },
  });

  return { formik, isPending };
};
