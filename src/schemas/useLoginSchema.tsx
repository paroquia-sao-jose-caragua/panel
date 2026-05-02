import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

const useLoginSchema = () => {
  const { t } = useTranslator();

  const emailSchema = yup.object({
    email: yup
      .string()
      .email(t('error-email-invalid'))
      .min(5, t('error-email-min-length', { variables: { minLength: 5 } }))
      .max(200, t('error-email-max-length', { variables: { maxLength: 200 } }))
      .required(t('error-email-required')),
    password: yup
      .string()
      .min(8, t('error-password-min-length', { variables: { minLength: 8 } }))
      .max(
        100,
        t('error-password-max-length', { variables: { maxLength: 100 } })
      )
      .required(t('error-password-required')),
  });
  return emailSchema;
};

export default useLoginSchema;
