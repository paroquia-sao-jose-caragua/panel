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
      recurrenceType: 'weekly',
      startDate: dayjs().format('YYYY-MM-DD'),
      times: [],
    } as {
      title?: string;
      isPrecept: boolean;
      recurrenceType: 'weekly' | 'monthly' | 'week-of-month';
      dayOfWeek?: number;
      dayOfMonth?: number;
      weekOfMonth?: number;
      startDate: string;
      endDate?: string;
      times: { startTime: string; endTime: string }[];
      orientations?: string;
    },
    onSubmit: (values) => {
      mutate(
        {
          ...values,
          communityId: community?.id as string,
          type,
          recurrenceType:
            values.recurrenceType === 'week-of-month'
              ? 'weekly'
              : values.recurrenceType,
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
