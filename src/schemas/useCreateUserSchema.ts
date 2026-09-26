import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

const useCreateUserSchema = () => {
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
    role: yup
      .string()
      .oneOf(['admin', 'secretary', 'user', 'pastoral_agent', 'viewer'])
      .required(t('error-required')),
    sendInvite: yup.boolean().default(true),
    password: yup.string().when('sendInvite', {
      is: false,
      then: (schema) =>
        schema
          .min(8, t('error-password-min-length', { variables: { minLength: 8 } }))
          .max(100, t('error-password-max-length', { variables: { maxLength: 100 } }))
          .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)/,
            t('password-requirements')
          )
          .required(t('error-password-required')),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};

export default useCreateUserSchema;
