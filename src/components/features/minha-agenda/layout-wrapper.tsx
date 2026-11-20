'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MinhaAgendaBottomNav } from './bottom-nav';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { FullLoading } from '@/components/ui/loading/full-loading';

interface MinhaAgendaLayoutWrapperProps {
  children: React.ReactNode;
}

const ROOT_TABS = new Set<string>([
  ROUTES.MY_AGENDA.HOME,
  ROUTES.MY_AGENDA.SCHEDULE,
  ROUTES.MY_AGENDA.REQUESTS,
  ROUTES.MY_AGENDA.PROFILE,
]);

export function MinhaAgendaLayoutWrapper({
  children,
}: MinhaAgendaLayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLogged } = useAuthStore();

  const cleanPath = pathname ? pathname.replace(/\/$/, '') : '';
  const isRootTab = ROOT_TABS.has(cleanPath);

  useEffect(() => {
    if (isLogged && user && user.role !== 'pastoral_agent') {
      router.replace(ROUTES.APPOINTMENTS.HOME);
    }
  }, [isLogged, user, router]);

  // Se o usuário logado não for agente pastoral, bloqueia a renderização
  if (isLogged && user && user.role !== 'pastoral_agent') {
    return <FullLoading />;
  }

  return (
    <div
      className={cn(
        'w-full max-w-lg min-h-screen bg-zinc-50 flex flex-col relative shadow-xs border-x border-zinc-200/60 transition-all',
        isRootTab ? 'pb-20' : 'pb-6'
      )}
    >
      <main className="flex-1 flex flex-col">{children}</main>
      {isRootTab && <MinhaAgendaBottomNav />}
    </div>
  );
}
