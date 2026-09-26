import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

const useForgotPasswordSchema = () => {
  const { t } = useTranslator();

  return yup.object({
    email: yup
      .string()
      .email(t('error-email-invalid'))
      .min(5, t('error-email-min-length', { variables: { minLength: 5 } }))
      .max(200, t('error-email-max-length', { variables: { maxLength: 200 } }))
      .required(t('error-email-required')),
  });
};

export default useForgotPasswordSchema;
