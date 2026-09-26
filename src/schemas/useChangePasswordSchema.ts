import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

const useChangePasswordSchema = () => {
  const { t } = useTranslator();

  return yup.object({
    currentPassword: yup
      .string()
      .required(t('error-password-required')),
    newPassword: yup
      .string()
      .min(8, t('error-password-min-length', { variables: { minLength: 8 } }))
      .max(100, t('error-password-max-length', { variables: { maxLength: 100 } }))
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        t('password-requirements')
      )
      .required(t('error-password-required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], t('passwords-must-match'))
      .required(t('error-password-required')),
  });
};

export default useChangePasswordSchema;
