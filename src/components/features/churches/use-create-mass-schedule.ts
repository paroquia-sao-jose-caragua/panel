import { createMassSchedule } from '@/api/communities/mass-schedules/create';
import { useCommunity } from '@/api/communities/use-community';
import { useNavigate } from '@/hooks/use-navigate';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFormik } from 'formik';

interface UseCreateMassScheduleProps {
  type: 'ordinary';
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
      isPrecept: boolean;
      recurrenceType: 'weekly' | 'monthly';
      dayOfWeek?: number;
      dayOfMonth?: number;
      startDate: string;
      endDate?: string;
      times: { startTime: string; endTime: string }[];
    },
    onSubmit: (values) => {
      mutate(
        {
          communityId: community?.id as string,
          type,
          ...values,
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
