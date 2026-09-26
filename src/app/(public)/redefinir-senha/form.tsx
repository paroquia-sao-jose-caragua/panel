'use client';

import { useSearchParams } from 'next/navigation';
import { AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { resetPassword } from '@/api/users/reset-password';
import useTranslator from '@/hooks/use-translator';
import useResetPasswordSchema from '@/schemas/useResetPasswordSchema';
import { useNavigate } from '@/hooks/use-navigate';
import { useFormik } from 'formik';
import * as Input from '@/components/common/input';
import { showAlert } from '@/utils/showAlert';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export const Form = () => {
  const { t } = useTranslator();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const validationSchema = useResetPasswordSchema();

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: ({ statusCode, message, errors }) => {
      if (statusCode === 200) {
        showAlert(message || t('password-changed-successfully'));
        navigate.push(ROUTES.AUTH.LOGIN);
      } else if (errors) {
        for (const error of errors) {
          formik.setFieldError(error.field, error.message);
        }
      } else {
        showAlert(message || t('error-invalid-or-expired-token'));
      }
    },
    onError: (error) => {
      console.error(error);
      showAlert(t('error-invalid-or-expired-token'));
    },
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (!token) {
        showAlert(t('error-invalid-or-expired-token'));
        return;
      }
      mutate({ token, password: values.password });
    },
  });

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-4 w-full">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-zinc-900">
            {t('error-invalid-or-expired-token')}
          </h3>
        </div>
        <Button asChild variant="outline" className="w-full mt-4">
          <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>
            {t('forgot-password')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-3 pb-5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-brand-800"
        >
          {t('new-password')}
        </label>
        <Input.Root
          error={formik.errors.password}
          touched={formik.touched.password}
          helperText={t('password-requirements')}
        >
          <Input.Prefix>
            <Lock className="h-5 w-5 text-brand-300" />
          </Input.Prefix>
          <Input.Control
            id="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </Input.Root>
      </div>

      <div className="flex flex-col gap-3 pb-5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-brand-800"
        >
          {t('confirm-new-password')}
        </label>
        <Input.Root
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        >
          <Input.Prefix>
            <Lock className="h-5 w-5 text-brand-300" />
          </Input.Prefix>
          <Input.Control
            id="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
        </Input.Root>
      </div>

      <Button type="submit" isLoading={isPending} className="w-full mt-2">
        {t('reset-password')}
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
