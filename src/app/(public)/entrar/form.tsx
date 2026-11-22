'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/users/login';
import useTranslator from '@/hooks/use-translator';
import useLoginSchema from '@/schemas/useLoginSchema';
import useAuthStore from '@/stores/useAuthStore';
import { useNavigate } from '@/hooks/use-navigate';
import { useFormik } from 'formik';
import * as Input from '@/components/common/input';
import { showAlert } from '@/utils/showAlert';
import { Button } from '@/components/ui/button';

export const Form = () => {
  const { t } = useTranslator();
  const navigate = useNavigate();
  const validationSchema = useLoginSchema();
  const { setLogged } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ message, statusCode, token, user, errors }) => {
      if (statusCode === 200) {
        setLogged({ token, user });
        navigate.push('/');
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
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-1 pb-5">
        <label htmlFor="email" className="text-sm font-medium text-brand-800">
          Email
        </label>
        <Input.Root error={formik.errors.email} touched={formik.touched.email}>
          <Input.Control
            id="email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </Input.Root>
      </div>

      <div className="flex flex-col gap-1 pb-5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-brand-800"
        >
          Senha
        </label>
        <Input.Root
          error={formik.errors.password}
          touched={formik.touched.password}
        >
          <Input.Control
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar senha' : 'Revelar senha'}
            className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer shrink-0"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </Input.Root>
      </div>

      <Button size="lg" type="submit" isLoading={isPending} className="w-full mt-2">
        Entrar
      </Button>
    </form>
  );
};
