'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getUser } from '@/api/users/get-user';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import useTranslator from '@/hooks/use-translator';
import { ShieldAlert } from 'lucide-react';
import { Describe } from '@/components/ui/typography/describe';
import { ResetUserPasswordForm } from './form';

interface ResetPasswordPageProps {
  params: Promise<{ id: string }>;
}

export default function ResetUserPasswordPage({ params }: ResetPasswordPageProps) {
  const { id } = use(params);
  const { t } = useTranslator();
  const { user: currentUser } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: currentUser?.role === 'admin' && Boolean(id),
  });

  if (currentUser?.role !== 'admin') {
    return (
      <div className="w-full lg:col-start-2">
        <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
          <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
            <BackButton href={ROUTES.SETTINGS.HOME} />
          </div>
          <Separator />
        </header>
        <main className="w-full max-w-200 px-4 py-16 mx-auto lg:px-8 flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <TypographyH1>{t('unauthorized-access')}</TypographyH1>
          <Describe>{t('error-page-desc-1')}</Describe>
        </main>
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.SETTINGS.HOME} />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>{t('admin-reset-password-modal-title')}</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {user ? `Escolha a forma de redefinir o acesso de ${user.name}` : 'Redefina a senha de acesso do usuário'}
              </span>
            </div>
          </div>
        </div>

        <Separator />
      </header>

      <main className="w-full max-w-200 px-4 pt-8 pb-12 mx-auto lg:px-8">
        {isLoading || !user ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        ) : (
          <ResetUserPasswordForm user={user} />
        )}
      </main>
    </div>
  );
}
