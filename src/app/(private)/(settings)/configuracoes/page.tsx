'use client';

import Link from 'next/link';
import {
  Settings,
  Lock,
  Users,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import useTranslator from '@/hooks/use-translator';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function SettingsHubPage() {
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
      case 'viewer':
      default:
        return t('role-viewer');
    }
  };

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
      {/* Top Breadcrumb */}
      <AppBreadcrumb
        links={[
          {
            key: 'settings',
            href: ROUTES.SETTINGS.HOME,
            title: 'Configurações',
            icon: Settings,
          },
        ]}
      />

      {/* Page Header */}
      <div>
        <TypographyH1>Configurações</TypographyH1>
        <Describe className="mt-1">
          Gerencie a segurança da sua conta, o controle de acessos dos usuários e os dispositivos conectados.
        </Describe>
      </div>

      <div className="h-px bg-zinc-200" />

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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
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

      {/* Subpages Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Alterar Senha */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                Alterar Senha
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Altere sua senha pessoal de acesso ao painel administrativo da paróquia.
              </p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200">
            <Link href={ROUTES.SETTINGS.CHANGE_PASSWORD}>
              <span>Acessar</span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
            </Link>
          </Button>
        </div>

        {/* Card 2: Gestão de Usuários */}
        {currentUser?.role === 'admin' && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                  Gestão de Usuários
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Gerencie administradores, secretárias e agentes pastorais com permissão de acesso.
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200">
              <Link href={ROUTES.SETTINGS.USERS}>
                <span>Acessar</span>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
              </Link>
            </Button>
          </div>
        )}

        {/* Card 3: Dispositivos Conectados */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                Dispositivos Conectados
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Visualize e gerencie os celulares e computadores habilitados para notificações push.
              </p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200">
            <Link href={ROUTES.SETTINGS.DEVICES}>
              <span>Acessar</span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
