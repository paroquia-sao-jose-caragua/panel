'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Settings,
  Lock,
  Users,
  Plus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { listUsers } from '@/api/users/list-users';
import useAuthStore from '@/stores/useAuthStore';
import useTranslator from '@/hooks/use-translator';
import { useDebounce } from '@/hooks/use-debounce';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { UsersFilters } from './components/users-filters';
import { UsersTable } from './components/users-table';

export default function SettingsHubPage() {
  const { t } = useTranslator();
  const { user: currentUser } = useAuthStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading } = useQuery({
    queryKey: [
      'users',
      {
        page,
        search: debouncedSearch,
        role: roleFilter === 'all' ? undefined : roleFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
      },
    ],
    queryFn: () =>
      listUsers({
        page,
        pageSize: 15,
        search: debouncedSearch || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
      }),
    enabled: currentUser?.role === 'admin',
  });

  const users = data?.users || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

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
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-10">
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
          Gerencie a segurança da sua conta e o controle de acessos da paróquia.
        </Describe>
      </div>

      {/* ========================================================= */}
      {/* CARD 1: SEGURANÇA DA CONTA PESSOAL & ALTERAR SENHA        */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-900">
          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
          <h2
            className="text-xl sm:text-2xl font-semibold text-zinc-900"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Segurança da Conta
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-800 font-bold text-xl flex items-center justify-center shrink-0 border-2 border-brand-300">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900 text-base">
                    {currentUser?.name}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    {getRoleLabel(currentUser?.role)}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{currentUser?.email}</p>
                <p className="text-xs text-zinc-400">
                  Mantenha sua conta protegida alterando sua senha de acesso regularmente.
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
              <Link href={ROUTES.SETTINGS.CHANGE_PASSWORD}>
                <Lock className="w-3.5 h-3.5" />
                <span>{t('change-password')}</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CARD 2: GESTÃO DE USUÁRIOS & ACESSOS (APENAS ADMIN)       */}
      {/* ========================================================= */}
      {currentUser?.role === 'admin' && (
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-900">
                <Users className="w-5 h-5 text-brand-600 shrink-0" />
                <h2
                  className="text-xl sm:text-2xl font-semibold text-zinc-900"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Gestão de Usuários & Acessos
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {t('manage-access-desc')}
              </p>
            </div>

            <Button asChild size="sm" className="gap-2 shrink-0">
              <Link href={ROUTES.SETTINGS.NEW_USER}>
                <Plus className="w-4 h-4" />
                <span>{t('new-user')}</span>
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <UsersFilters
              search={search}
              onSearchChange={handleSearchChange}
              role={roleFilter}
              onRoleChange={handleRoleChange}
              status={statusFilter}
              onStatusChange={handleStatusChange}
            />

            <UsersTable users={users} isLoading={isLoading} />

            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-zinc-500">
                  Total: {meta.total} usuários • Página {page} de {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {t('page-prev')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    {t('page-next')}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
