import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';
import useAddressSchema from './useAdressSchema';

const useChurchSchema = () => {
  const { t } = useTranslator();

  const addressSchema = useAddressSchema();

  const churchSchema = yup
    .object({
      name: yup
        .string()
        .min(5, t('error-name-min-length', { variables: { min: 5 } }))
        .max(255, t('error-name-max-length', { variables: { max: 255 } })),
      type: yup.string().oneOf(['chapel', 'parish_church']),
      coverId: yup.string().required(t('error-cover-required')),
      heroSubtitle: yup.string().max(500).optional().nullable(),
      aboutTitle: yup.string().max(255).optional().nullable(),
      aboutDescription: yup.string().optional().nullable(),
      historySummary: yup.string().optional().nullable(),
      patronName: yup.string().max(255).optional().nullable(),
      patronDescription: yup.string().optional().nullable(),
      patronPhotoId: yup.string().optional().nullable(),
      phone: yup.string().max(50).optional().nullable(),
      email: yup.string().email().optional().nullable(),
      officeHours: yup.string().max(500).optional().nullable(),
    })
    .concat(addressSchema);

  return churchSchema;
};

export default useChurchSchema;

