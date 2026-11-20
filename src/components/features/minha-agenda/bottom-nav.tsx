'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Inbox, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useAppointments } from '@/api/appointments/use-appointments';

export function MinhaAgendaBottomNav() {
  const pathname = usePathname();

  // Fetch appointments to count pending requests
  const { appointments } = useAppointments();

  const pendingCount = React.useMemo(() => {
    if (!appointments) return 0;
    return appointments.filter((a) => a.status === 'pending').length;
  }, [appointments]);

  // Guard: Hide bottom nav on internal subpages with back button
  const isRootTab = React.useMemo(() => {
    if (!pathname) return true;
    const cleanPath = pathname.replace(/\/$/, '');
    return (
      cleanPath === ROUTES.MY_AGENDA.HOME ||
      cleanPath === ROUTES.MY_AGENDA.SCHEDULE ||
      cleanPath === ROUTES.MY_AGENDA.REQUESTS ||
      cleanPath === ROUTES.MY_AGENDA.PROFILE
    );
  }, [pathname]);

  if (!isRootTab) {
    return null;
  }

  const navItems = [
    {
      label: 'Início',
      href: ROUTES.MY_AGENDA.HOME,
      icon: Home,
      exact: true,
    },
    {
      label: 'Agenda',
      href: ROUTES.MY_AGENDA.SCHEDULE,
      icon: Calendar,
      exact: false,
    },
    {
      label: 'Solicitações',
      href: ROUTES.MY_AGENDA.REQUESTS,
      icon: Inbox,
      badge: pendingCount > 0 ? pendingCount : undefined,
      exact: false,
    },
    {
      label: 'Perfil',
      href: ROUTES.MY_AGENDA.PROFILE,
      icon: User,
      exact: false,
    },
  ];

  const isCurrentActive = (item: (typeof navItems)[number]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      aria-label="Navegação da Agenda Pastoral"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 min-h-16">
        {navItems.map((item) => {
          const active = isCurrentActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-200 select-none outline-none group',
                active
                  ? 'bg-brand-700/10 text-brand-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60 active:scale-95'
              )}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200 group-hover:scale-105',
                    active ? 'stroke-[2.5px] text-brand-800' : 'stroke-[1.8px]'
                  )}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-3 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-amber-600 rounded-full shadow-xs animate-in zoom-in-75">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] tracking-tight mt-1 transition-colors',
                  active ? 'font-bold text-brand-800' : 'font-medium'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
