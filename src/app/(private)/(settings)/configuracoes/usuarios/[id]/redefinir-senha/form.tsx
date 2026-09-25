'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { adminResetPassword } from '@/api/users/admin-reset-password';
import { User } from '@/entities/user';
import useTranslator from '@/hooks/use-translator';
import { Button } from '@/components/ui/button';
import * as Input from '@/components/common/input';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';

interface ResetUserPasswordFormProps {
  user: User;
}

export const ResetUserPasswordForm = ({ user }: ResetUserPasswordFormProps) => {
  const { t } = useTranslator();
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'manual'>('email');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: adminResetPassword,
    onSuccess: ({ statusCode, message }) => {
      if (statusCode === 200) {
        showAlert(message || t('reset-password-success'));
        router.push(ROUTES.SETTINGS.HOME);
      } else {
        showAlert(message || t('something-went-wrong'));
      }
    },
    onError: (error) => {
      console.error(error);
      showAlert(t('something-went-wrong'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'manual') {
      if (!password || password.length < 8) {
        setPasswordError(
          t('error-password-min-length', { variables: { minLength: 8 } })
        );
        return;
      }
      mutate({ id: user.id, password, sendEmail: false });
    } else {
      mutate({ id: user.id, sendEmail: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
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

        <div className="space-y-4">
          <span className="text-sm font-medium text-zinc-900 block">
            Método de Redefinição
          </span>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-zinc-800 cursor-pointer p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
              <input
                type="radio"
                name="resetMethod"
                checked={method === 'email'}
                onChange={() => {
                  setMethod('email');
                  setPasswordError('');
                }}
                className="accent-brand-600 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-medium text-zinc-900">{t('admin-reset-method-email')}</span>
                <p className="text-xs text-zinc-500">
                  Dispara um e-mail transacional com token seguro para {user.email}.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm text-zinc-800 cursor-pointer p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
              <input
                type="radio"
                name="resetMethod"
                checked={method === 'manual'}
                onChange={() => setMethod('manual')}
                className="accent-brand-600 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-medium text-zinc-900">{t('admin-reset-method-manual')}</span>
                <p className="text-xs text-zinc-500">
                  Defina uma nova senha temporária para entregar diretamente ao usuário.
                </p>
              </div>
            </label>
          </div>

          {method === 'manual' && (
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="admin-reset-pwd" className="text-sm font-medium text-brand-900">
                {t('provisional-password')}
              </label>
              <Input.Root error={passwordError} touched={Boolean(passwordError)}>
                <Input.Prefix>
                  <Lock className="h-5 w-5 text-brand-300" />
                </Input.Prefix>
                <Input.Control
                  id="admin-reset-pwd"
                  type="password"
                  value={password}
                  placeholder="Mínimo 8 caracteres"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                />
              </Input.Root>
              <span className="text-xs text-zinc-500">
                {t('password-requirements')}
              </span>
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
          {t('confirm')}
        </Button>
      </div>
    </form>
  );
};
