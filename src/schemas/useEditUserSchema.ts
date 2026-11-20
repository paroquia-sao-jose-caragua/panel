import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

const useEditUserSchema = () => {
  const { t } = useTranslator();

  return yup.object({
    name: yup
      .string()
      .min(3, t('error-name-min-length', { variables: { minLength: 3 } }))
      .max(150, t('error-name-max-length', { variables: { maxLength: 150 } }))
      .required(t('error-name-required')),
    email: yup
      .string()
      .email(t('error-email-invalid'))
      .min(5, t('error-email-min-length', { variables: { minLength: 5 } }))
      .max(200, t('error-email-max-length', { variables: { maxLength: 200 } }))
      .required(t('error-email-required')),
  });
};

export default useEditUserSchema;
