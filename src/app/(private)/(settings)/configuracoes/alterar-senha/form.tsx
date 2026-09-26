'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/api/users/change-password';
import useTranslator from '@/hooks/use-translator';
import useChangePasswordSchema from '@/schemas/useChangePasswordSchema';
import { useFormik } from 'formik';
import * as Input from '@/components/common/input';
import { showAlert } from '@/utils/showAlert';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export const ChangePasswordForm = () => {
  const { t } = useTranslator();
  const validationSchema = useChangePasswordSchema();

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: ({ statusCode, message, errors }) => {
      if (statusCode === 200) {
        showAlert(message || t('password-changed-successfully'));
        formik.resetForm();
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
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      mutate({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium text-brand-900"
          >
            {t('current-password')}
          </label>
          <Input.Root
            error={formik.errors.currentPassword}
            touched={formik.touched.currentPassword}
          >
            <Input.Prefix>
              <Lock className="h-5 w-5 text-brand-300" />
            </Input.Prefix>
            <Input.Control
              id="currentPassword"
              type="password"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-brand-900"
          >
            {t('new-password')}
          </label>
          <Input.Root
            error={formik.errors.newPassword}
            touched={formik.touched.newPassword}
            helperText={t('password-requirements')}
          >
            <Input.Prefix>
              <Lock className="h-5 w-5 text-brand-300" />
            </Input.Prefix>
            <Input.Control
              id="newPassword"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-brand-900"
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
      </div>

      <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
        <Link href={ROUTES.SETTINGS.HOME}>
          <Button variant="outline" size="lg" type="button">
            {t('cancel')}
          </Button>
        </Link>
        <Button size="lg" type="submit" isLoading={isPending}>
          {t('save-changes')}
        </Button>
      </div>
    </form>
  );
};
