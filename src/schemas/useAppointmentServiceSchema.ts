import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

export const useAppointmentServiceSchema = () => {
  const { t } = useTranslator();

  return yup.object({
    title: yup
      .string()
      .min(2, t('service-title-required'))
      .max(150)
      .required(t('service-title-required')),
    category: yup
      .string()
      .oneOf(['clergy_sacramental', 'home_visit', 'pastoral'], t('service-category-required'))
      .required(t('service-category-required')),
    defaultDurationMinutes: yup
      .number()
      .min(5)
      .max(480)
      .required(t('service-duration-required')),
    requiresAddress: yup.boolean().default(false),
    active: yup.boolean().default(true),
    description: yup.string().nullable().optional(),
  });
};

export default useAppointmentServiceSchema;
