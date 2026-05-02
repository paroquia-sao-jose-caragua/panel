import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

const useChurchSchema = () => {
  const { t } = useTranslator();

  const churchSchema = yup.object({
    name: yup
      .string()
      .min(1, t('error-name-min-length'))
      .max(255, t('error-name-max-length')),
    type: yup.string().oneOf(['chapel', 'parish_church']),
    address: yup
      .string()
      .min(1, t('error-address-min-length'))
      .max(500, t('error-address-max-length')),
    coverId: yup.string().required(t('error-cover-required')),
  });

  return churchSchema;
};

export default useChurchSchema;
