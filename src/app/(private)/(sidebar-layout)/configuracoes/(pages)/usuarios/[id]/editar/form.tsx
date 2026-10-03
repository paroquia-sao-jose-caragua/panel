'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Mail, User as UserIcon } from 'lucide-react';
import { updateUser } from '@/api/users/update-user';
import { User } from '@/entities/user';
import useTranslator from '@/hooks/use-translator';
import useEditUserSchema from '@/schemas/useEditUserSchema';
import { Button } from '@/components/ui/button';
import * as Input from '@/components/common/input';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';

interface EditUserFormProps {
  user: User;
}

export const EditUserForm = ({ user }: EditUserFormProps) => {
  const { t } = useTranslator();
  const router = useRouter();
  const queryClient = useQueryClient();
  const validationSchema = useEditUserSchema();

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: ({ statusCode, message, errors }) => {
      if (statusCode === 200) {
        showAlert(message || t('user-updated-successfully'));
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', user.id] });
        router.push(ROUTES.SETTINGS.USERS);
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
      name: user.name,
      email: user.email,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      mutate({
        id: user.id,
        name: values.name,
        email: values.email,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="font-semibold text-zinc-900">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-name"
            className="text-sm font-medium text-brand-900"
          >
            {t('user-name')}
          </label>
          <Input.Root error={formik.errors.name} touched={formik.touched.name}>
            <Input.Prefix>
              <UserIcon className="h-5 w-5 text-brand-300" />
            </Input.Prefix>
            <Input.Control
              id="edit-name"
              name="name"
              placeholder="Ex: João da Silva"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-email"
            className="text-sm font-medium text-brand-900"
          >
            {t('email')}
          </label>
          <Input.Root
            error={formik.errors.email}
            touched={formik.touched.email}
          >
            <Input.Prefix>
              <Mail className="h-5 w-5 text-brand-300" />
            </Input.Prefix>
            <Input.Control
              id="edit-email"
              name="email"
              type="email"
              placeholder="joao@paroquiasaojose.org.br"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </Input.Root>
        </div>
      </div>

      <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
        <Link href={ROUTES.SETTINGS.USERS}>
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
