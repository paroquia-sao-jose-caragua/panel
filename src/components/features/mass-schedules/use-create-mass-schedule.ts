import { createMassSchedule } from '@/api/communities/mass-schedules/create';
import { useCommunity } from '@/api/communities/use-community';
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
      times: [],
    } as {
      title?: string;
      isPrecept: boolean;
      isSolemn: boolean;
      recurrenceType: 'weekly' | 'monthly' | 'week-of-month';
      dayOfWeek?: 0 | 2 | 1 | 3 | 4 | 5 | 6;
      dayOfMonth?: number;
      monthOfYear?: number;
      weekOfMonth?: number;
      startDate: string;
      endDate?: string;
      times: { startTime: string; endTime: string }[];
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
              : values.isSolemn
                ? 'yearly'
                : values.recurrenceType,
          dayOfWeek: values?.dayOfWeek,
          dayOfMonth: values?.dayOfMonth,
          weekOfMonth: values?.weekOfMonth,
          monthOfYear: values?.monthOfYear,
          startDate: values.startDate,
          endDate: values?.endDate,
          times: values.times,
          orientations: values?.orientations,
        },
        {
          onSuccess: ({ massSchedule, fields, statusCode, message }) => {
            if (massSchedule) {
              navigate.replace(`/${community?.slug}`);
            }
          },
        }
      );
    },
  });

  return { formik, isPending };
};
