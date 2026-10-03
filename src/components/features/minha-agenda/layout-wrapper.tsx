'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MinhaAgendaBottomNav } from './bottom-nav';
import { cn } from '@/lib/utils';

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
  const cleanPath = pathname ? pathname.replace(/\/$/, '') : '';
  const isRootTab = ROOT_TABS.has(cleanPath);

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
