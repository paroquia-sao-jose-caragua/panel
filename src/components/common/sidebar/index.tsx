'use client';

import {
  Calendar,
  Church,
  Megaphone,
  Menu,
  X,
  Users,
  Building2,
  Settings,
  CalendarCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Button } from '@/components/ui/button';
import { NavItem } from './nav-item';
import { Profile } from './profile';
import { useState } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  const handleClose = () => setOpen(false);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'print:hidden fixed top-0 right-0 left-0 z-20 flex flex-col gap-4 border-b border-zinc-200 bg-brand-gradient py-2 md:py-4 data-[state=open]:bottom-0 lg:right-auto lg:bottom-0 lg:border-r lg:pt-4 lg:pb-6 transition-all duration-300',
        isCollapsed ? 'lg:w-20' : 'lg:w-80'
      )}
    >
      {/* Sidebar Header / Logo */}
      <div className={cn('flex items-center justify-between px-4 lg:px-6', isCollapsed && 'lg:justify-center lg:px-2')}>
        {/* Mobile Logo: Always /logo-mark-dark.png */}
        <img
          src="/logo-mark-dark.png"
          alt="Paróquia São José"
          className={cn(
            'lg:hidden transition-all duration-200 object-contain',
            open ? 'h-10 sm:h-12' : 'h-12'
          )}
        />

        {/* Desktop Logo: Swaps icon/full mark based on isCollapsed */}
        <img
          src={isCollapsed ? '/logo-icon-212x212.png' : '/logo-mark-dark.png'}
          alt="Paróquia São José"
          className={cn(
            'hidden lg:block transition-all duration-200 object-contain',
            isCollapsed ? 'w-10 h-10 rounded-full shrink-0' : 'h-16 w-auto'
          )}
        />
        <Collapsible.Trigger asChild className="lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto text-brand-300 hover:text-white hover:bg-brand-700/40 focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content
        forceMount
        className="flex flex-1 flex-col gap-6 data-[state=closed]:hidden lg:data-[state=closed]:flex"
      >
        <div className="h-px bg-brand-700/30" />

        {/* Main Navigation Items */}
        <div className={cn('space-y-0.5 px-4', isCollapsed && 'lg:px-2.5')}>
          {user?.role === 'pastoral_agent' ? (
            <NavItem
              title="Atendimentos"
              icon={CalendarCheck}
              collapsedHref={ROUTES.APPOINTMENTS.HOME}
              links={[
                {
                  title: 'Meus Atendimentos',
                  href: ROUTES.APPOINTMENTS.LIST,
                },
                {
                  title: 'Novo Agendamento',
                  href: ROUTES.APPOINTMENTS.ADD,
                },
                {
                  title: 'Relatório & Pauta (PDF)',
                  href: ROUTES.APPOINTMENTS.REPORT,
                },
              ]}
              onLinkClick={handleClose}
            />
          ) : (
            <>
              <NavItem
                title="Início"
                icon={Church}
                links={[
                  {
                    title: 'Início',
                    href: '/',
                  },
                ]}
                onLinkClick={handleClose}
              />

              <NavItem
                title="Clérigos"
                icon={Users}
                links={[
                  {
                    title: 'Clérigos',
                    href: '/clerigos',
                  },
                ]}
                onLinkClick={handleClose}
              />

              <NavItem
                title="Banners & Avisos"
                icon={Megaphone}
                links={[
                  {
                    title: 'Gerenciar Avisos',
                    href: '/avisos',
                  },
                ]}
                onLinkClick={handleClose}
              />

              <NavItem
                title="Programação Paroquial"
                icon={Calendar}
                links={[
                  {
                    title: 'Programação Paroquial',
                    href: '/agenda',
                  },
                ]}
                onLinkClick={handleClose}
              />

              <NavItem
                title="Agendamentos"
                icon={CalendarCheck}
                collapsedHref={ROUTES.APPOINTMENTS.HOME}
                links={[
                  {
                    title: 'Agendamentos',
                    href: ROUTES.APPOINTMENTS.HOME,
                  },
                ]}
                onLinkClick={handleClose}
              />

              <NavItem
                title="Secretaria & Contribuição"
                icon={Building2}
                links={[
                  {
                    title: 'Secretaria & Contribuição',
                    href: '/secretaria',
                  },
                ]}
                onLinkClick={handleClose}
              />
            </>
          )}
        </div>

        {/* Mobile Only: Profile and Settings section */}
        <div className="mt-auto flex flex-col gap-2 px-4 pb-2 lg:hidden">
          <div className="h-px bg-brand-700/30 mb-2" />
          {user?.role !== 'pastoral_agent' && (
            <NavItem
              title="Configurações"
              icon={Settings}
              links={[
                {
                  title: 'Configurações',
                  href: ROUTES.SETTINGS.HOME,
                },
              ]}
              onLinkClick={handleClose}
            />
          )}
          <Profile />
        </div>

        {/* Desktop Only: Sidebar Collapse Toggle */}
        <div className="mt-auto hidden lg:flex flex-col px-3 pt-2">
          <div className="h-px bg-brand-700/30 mb-2" />

          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={toggleCollapsed}
                  className="w-full flex items-center justify-center text-brand-300 hover:text-white hover:bg-brand-700/40 transition-colors rounded-xl p-2.5 cursor-pointer"
                >
                  <PanelLeftOpen className="h-5 w-5 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-brand-900 text-brand-100 border border-brand-700 shadow-md">
                Expandir menu
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={toggleCollapsed}
              className="w-full flex items-center gap-3 text-brand-300 hover:text-white hover:bg-brand-700/40 transition-colors rounded-xl px-3 py-2 text-xs font-medium cursor-pointer justify-start"
            >
              <PanelLeftClose className="h-5 w-5 shrink-0" />
              <span>Recolher menu</span>
            </Button>
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
