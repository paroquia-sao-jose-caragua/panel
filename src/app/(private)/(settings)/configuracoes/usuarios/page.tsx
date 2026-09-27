'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Users, Plus, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { listUsers } from '@/api/users/list-users';
import useAuthStore from '@/stores/useAuthStore';
import useTranslator from '@/hooks/use-translator';
import { useDebounce } from '@/hooks/use-debounce';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/common/back-button';
import { ROUTES } from '@/constants/routes';
import { UsersFilters } from '../components/users-filters';
import { UsersTable } from '../components/users-table';

export default function ManageUsersPage() {
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

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <AppBreadcrumb
        links={[
          { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: Settings },
          { key: 'users', href: ROUTES.SETTINGS.USERS, title: 'Gestão de Usuários', icon: Users },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <TypographyH1>Gestão de Usuários & Permissões</TypographyH1>
          <Describe>
            {t('manage-access-desc')}
          </Describe>
        </div>

        <Button asChild size="sm" className="gap-2 shrink-0">
          <Link href={ROUTES.SETTINGS.NEW_USER}>
            <Plus className="w-4 h-4" />
            <span>{t('new-user')}</span>
          </Link>
        </Button>
      </div>

      <div className="h-px bg-zinc-200" />

      {/* Content */}
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
    </main>
  );
}
