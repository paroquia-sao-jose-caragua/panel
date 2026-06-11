import { updateMassSchedule } from '@/api/mass-schedules/update';
import { useCommunity } from '@/api/communities/use-community';
import { useNavigate } from '@/hooks/use-navigate';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useParams } from 'next/navigation';
import useCommunityStore from '@/stores/useCommunityStore';

interface UseCreateMassScheduleProps {
  type: 'ordinary' | 'devotional';
}

export const useEditMassSchedule = ({ type }: UseCreateMassScheduleProps) => {
  const { community } = useCommunity();
  const navigate = useNavigate();
  const params = useParams<{ id: string; slug: string }>();
  const { massSchedules } = useCommunityStore();

  // Find the specific mass schedule by ID
  const massSchedule = massSchedules?.find((ms) => ms.id === params.id);

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: updateMassSchedule,
  });

  const formik = useFormik({
    initialValues: {
      title: massSchedule?.title,
      orientations: massSchedule?.orientations,
      isPrecept: Boolean(massSchedule?.isPrecept),
      isSolemn: massSchedule?.type === 'solemnity',
      recurrenceType: massSchedule?.recurrenceType || 'weekly',
      dayOfWeek: massSchedule?.dayOfWeek,
      dayOfMonth: massSchedule?.dayOfMonth,
      weekOfMonth: massSchedule?.weekOfMonth,
      monthOfYear: massSchedule?.monthOfYear,
      startDate: massSchedule?.startDate
        ? dayjs(massSchedule.startDate).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      endDate: massSchedule?.endDate
        ? dayjs(massSchedule.endDate).format('YYYY-MM-DD')
        : undefined,
      times: massSchedule?.times || [],
    } as {
      title?: string;
      isPrecept: boolean;
      isSolemn: boolean;
      orientations?: string;
      recurrenceType: 'weekly' | 'monthly' | 'week-of-month';
      dayOfWeek?: 0 | 2 | 1 | 3 | 4 | 5 | 6;
      dayOfMonth?: number;
      weekOfMonth?: number;
      monthOfYear?: number;
      startDate: string;
      endDate?: string;
      times: { startTime: string; endTime: string }[];
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(
        {
          ...values,
          massScheduleId: params.id,
          type: values.isSolemn ? 'solemnity' : type,
          recurrenceType:
            values.recurrenceType === 'week-of-month'
              ? 'monthly'
              : values.isSolemn
                ? 'yearly'
                : values.recurrenceType,
        },
        {
          onSuccess: ({ massSchedule, statusCode, message }) => {
            if (massSchedule && statusCode === 200) {
              navigate.replace(`/${community?.slug}`);
              showAlert('Missa atualizada com sucesso!');
            } else {
              showAlert(`Erro ao atualizar missa: ${message}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro ao atualizar missa: ${error.message}`);
          },
        }
      );
    },
  });

  return { formik, isPending, massSchedule };
};
