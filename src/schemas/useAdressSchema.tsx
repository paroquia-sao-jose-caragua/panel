import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

const useAddressSchema = () => {
  const { t } = useTranslator();

  const addressSchema = yup.object({
    street: yup
      .string()
      .min(1, t('error-street-min-length'))
      .max(255, t('error-street-max-length')),
    streetNumber: yup
      .string()
      .min(1, t('error-street-number-min-length'))
      .max(20, t('error-street-number-max-length')),
    district: yup
      .string()
      .min(1, t('error-district-min-length'))
      .max(255, t('error-district-max-length')),
    city: yup
      .string()
      .min(1, t('error-city-min-length'))
      .max(255, t('error-city-max-length')),
    state: yup
      .string()
      .min(2, t('error-state-min-length'))
      .max(255, t('error-state-max-length')),
    zipCode: yup
      .string()
      .min(1, t('error-zip-code-min-length'))
      .max(20, t('error-zip-code-max-length')),
  });

  return addressSchema;
};

export default useAddressSchema;
