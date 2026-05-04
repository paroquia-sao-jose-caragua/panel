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
    })
    .concat(addressSchema);

  return churchSchema;
};

export default useChurchSchema;
