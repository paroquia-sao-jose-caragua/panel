'use client';

import Link from 'next/link';
import {
  Settings,
  Lock,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import useTranslator from '@/hooks/use-translator';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function ManageLoginPage() {
  const { t } = useTranslator();
  const { user: currentUser } = useAuthStore();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return t('role-admin');
      case 'secretary':
      case 'user':
        return t('role-secretary');
      case 'pastoral_agent':
        return t('role-pastoral_agent');
      // case 'viewer':
      default:
        return t('role-viewer');
    }
  };

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'settings',
            href: ROUTES.SETTINGS.HOME,
            title: 'Configurações',
            icon: Settings,
          },
        ]}
      />
      
      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">

      {/* Page Header */}
      <div>
        <TypographyH1>Gerenciar Acesso</TypographyH1>
        <Describe className="mt-1">
          Altere as configurações de acesso do seu usuário.
        </Describe>
      </div>

      {/* Profile Account Header Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-800 font-bold text-xl flex items-center justify-center shrink-0 border-2 border-brand-300">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 text-base">
                {currentUser?.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                {getRoleLabel(currentUser?.role)}
              </span>
            </div>
            <p className="text-sm text-zinc-500">{currentUser?.email}</p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
          <Link href={ROUTES.SETTINGS.CHANGE_PASSWORD}>
            <Lock className="w-3.5 h-3.5" />
            <span>{t('change-password')}</span>
          </Link>
        </Button>
      </div>

    </main>
    </>
  );
}
