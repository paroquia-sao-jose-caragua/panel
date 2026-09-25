'use client';

import { useState } from 'react';
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { forgotPassword } from '@/api/users/forgot-password';
import useTranslator from '@/hooks/use-translator';
import useForgotPasswordSchema from '@/schemas/useForgotPasswordSchema';
import { useFormik } from 'formik';
import * as Input from '@/components/common/input';
import { showAlert } from '@/utils/showAlert';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export const Form = () => {
  const { t } = useTranslator();
  const [isSuccess, setIsSuccess] = useState(false);
  const validationSchema = useForgotPasswordSchema();

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: ({ statusCode, message, errors }) => {
      if (statusCode === 200) {
        setIsSuccess(true);
      } else if (errors) {
        for (const error of errors) {
          formik.setFieldError(error.field, error.message);
        }
      } else {
        showAlert(message || t('something-went-wrong'));
      }
    },
    onError: (error) => {
      console.error(error);
      showAlert(t('something-went-wrong'));
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-4 w-full">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-zinc-900">
            {t('check-your-email')}
          </h3>
          <p className="text-sm text-zinc-600 max-w-sm">
            {t('reset-link-sent')}
          </p>
        </div>
        <Button asChild variant="outline" className="w-full mt-4">
          <Link href={ROUTES.AUTH.LOGIN}>{t('back-to-login')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-3 pb-5">
        <label htmlFor="email" className="text-sm font-medium text-brand-800">
          {t('email')}
        </label>
        <Input.Root error={formik.errors.email} touched={formik.touched.email}>
          <Input.Prefix>
            <Mail className="h-5 w-5 text-brand-300" />
          </Input.Prefix>
          <Input.Control
            id="email"
            type="email"
            placeholder="seu-email@exemplo.com"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </Input.Root>
      </div>

      <Button type="submit" isLoading={isPending} className="w-full mt-2">
        {t('send-reset-link')}
      </Button>

      <div className="flex items-center justify-center pt-4">
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('back-to-login')}</span>
        </Link>
      </div>
    </form>
  );
};
