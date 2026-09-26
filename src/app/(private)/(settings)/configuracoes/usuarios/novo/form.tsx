'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Mail, User as UserIcon, Lock } from 'lucide-react';
import { createUser } from '@/api/users/create-user';
import { UserRole } from '@/entities/user';
import useTranslator from '@/hooks/use-translator';
import useCreateUserSchema from '@/schemas/useCreateUserSchema';
import { Button } from '@/components/ui/button';
import * as Input from '@/components/common/input';
import { Select, SelectItem } from '@/components/common/select';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';

export const CreateUserForm = () => {
  const { t } = useTranslator();
  const router = useRouter();
  const queryClient = useQueryClient();
  const validationSchema = useCreateUserSchema();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: ({ statusCode, message, errors }) => {
      if (statusCode === 201) {
        showAlert(message || t('user-created-successfully'));
        queryClient.invalidateQueries({ queryKey: ['users'] });
        router.push(ROUTES.SETTINGS.HOME);
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
      name: '',
      email: '',
      role: 'secretary' as UserRole,
      sendInvite: true,
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      mutate({
        name: values.name,
        email: values.email,
        role: values.role,
        sendInvite: values.sendInvite,
        password: values.sendInvite ? undefined : values.password,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="create-name" className="text-sm font-medium text-brand-900">
            {t('user-name')}
          </label>
          <Input.Root
            error={formik.errors.name}
            touched={formik.touched.name}
          >
            <Input.Prefix>
              <UserIcon className="h-5 w-5 text-brand-300" />
            </Input.Prefix>
            <Input.Control
              id="create-name"
              name="name"
              placeholder="Ex: João da Silva"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="create-email" className="text-sm font-medium text-brand-900">
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
              id="create-email"
              name="email"
              type="email"
              placeholder="joao@paroquiasaojose.org.br"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-900">
            {t('user-role')}
          </label>
          <Select
            placeholder={t('user-role')}
            value={formik.values.role}
            onValueChange={(val) => formik.setFieldValue('role', val)}
          >
            <SelectItem text={t('role-secretary')} value="secretary" description="Gestão de avisos, missas e agendamentos" />
            <SelectItem text={t('role-pastoral_agent')} value="pastoral_agent" description="Acesso restrito à própria agenda" />
            <SelectItem text={t('role-admin')} value="admin" description="Acesso administrativo irrestrito" />
            <SelectItem text={t('role-viewer')} value="viewer" description="Apenas visualização de dados" />
          </Select>
        </div>

        <div className="pt-4 border-t border-zinc-200 space-y-4">
          <span className="text-sm font-medium text-zinc-900 block">
            Definição de Acesso
          </span>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-zinc-800 cursor-pointer p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
              <input
                type="radio"
                name="sendInvite"
                checked={formik.values.sendInvite === true}
                onChange={() => formik.setFieldValue('sendInvite', true)}
                className="accent-brand-600 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-medium text-zinc-900">{t('invite-by-email')}</span>
                <p className="text-xs text-zinc-500">
                  Um e-mail será enviado com link exclusivo para o usuário definir sua própria senha.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm text-zinc-800 cursor-pointer p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
              <input
                type="radio"
                name="sendInvite"
                checked={formik.values.sendInvite === false}
                onChange={() => formik.setFieldValue('sendInvite', false)}
                className="accent-brand-600 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-medium text-zinc-900">{t('define-initial-password')}</span>
                <p className="text-xs text-zinc-500">
                  Defina uma senha inicial e forneça diretamente ao novo usuário.
                </p>
              </div>
            </label>
          </div>

          {!formik.values.sendInvite && (
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="create-password" className="text-sm font-medium text-brand-900">
                {t('provisional-password')}
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
                  id="create-password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </Input.Root>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
        <Link href={ROUTES.SETTINGS.HOME}>
          <Button variant="outline" size="lg" type="button">
            {t('cancel')}
          </Button>
        </Link>
        <Button size="lg" type="submit" isLoading={isPending}>
          Cadastrar Usuário
        </Button>
      </div>
    </form>
  );
};
