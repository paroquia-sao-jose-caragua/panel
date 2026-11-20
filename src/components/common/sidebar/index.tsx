'use client';

import {
  Calendar,
  Church,
  Megaphone,
  Menu,
  X,
  Users,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  FileText,
  CalendarOff,
  Tag,
  FileSpreadsheet,
  AlertCircle,
  Repeat,
  Archive,
  Globe,
  Lock,
  Smartphone,
} from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Button } from '@/components/ui/button';
import { NavItem } from './nav-item';
import { Profile } from './profile';
import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import type { PanelArea } from '@/stores/useAreaStore';
import { useAppointments, useMyPastoralAgent } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { isAppointmentExpired } from '@/utils/appointment';

export const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();
  const { user: currentUser } = useAuthStore();

  const handleClose = () => setOpen(false);

  const isPastoralAgent = user?.role === 'pastoral_agent';
  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);

  // Determine effective area from pathname and role
  const effectiveArea: PanelArea = useMemo(() => {
    if (
      isPastoralAgent ||
      pathname.startsWith('/agenda-pastoral') ||
      pathname.startsWith('/atendimentos')
    ) {
      return 'agenda';
    }
    if (
      pathname.startsWith('/programacao-e-eventos') ||
      pathname.startsWith('/programacao-paroquial') ||
      pathname.startsWith('/avisos')
    ) {
      return 'events';
    }
    if (pathname.startsWith('/configuracoes')) {
      return 'settings';
    }
    return 'parish';
  }, [pathname, isPastoralAgent]);

  // Query pending appointments to show badge on "Solicitações" (only future requests)
  const { appointments: pendingAppointments } = useAppointments({
    status: 'pending',
    agentId: isPastoralAgent ? myAgent?.id : undefined,
  });
  const pendingCount = useMemo(() => {
    if (!pendingAppointments) return 0;
    return pendingAppointments.filter(
      (app) => app.status === 'pending' && !isAppointmentExpired(app)
    ).length;
  }, [pendingAppointments]);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'print:hidden fixed top-0 right-0 left-0 z-20 flex flex-col gap-3 border-b border-zinc-200 bg-brand-gradient py-2 md:py-4 data-[state=open]:bottom-0 lg:right-auto lg:bottom-0 lg:border-r lg:border-brand-700/30 lg:pt-4 lg:pb-5 transition-all duration-300',
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      )}
    >
      {/* Sidebar Header / Logo */}
      <div
        className={cn(
          'flex items-center justify-between px-4 lg:px-5',
          isCollapsed && 'lg:justify-center lg:px-2'
        )}
      >
        {/* Mobile Logo: /logo-mark-dark.png */}
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
            isCollapsed
              ? 'w-10 h-10 rounded-full shrink-0'
              : 'h-16 w-auto'
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
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content
        forceMount
        className="flex flex-1 flex-col gap-4 overflow-y-auto data-[state=closed]:hidden lg:data-[state=closed]:flex px-3"
      >
        <div className="h-px bg-brand-700/30 my-1 mx-1" />

        {/* Area 1: AGENDA PASTORAL */}
        {effectiveArea === 'agenda' && (
          <div className="space-y-4">
            {/* Group 1: Agenda Pastoral / Operação */}
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  Agenda Pastoral
                </div>
              )}
              <NavItem
                title="Início"
                icon={Home}
                exactMatch
                links={[
                  {
                    title: 'Início',
                    href: ROUTES.APPOINTMENTS.HOME,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Agenda"
                icon={Calendar}
                links={[
                  {
                    title: 'Agenda',
                    href: ROUTES.APPOINTMENTS.AGENDA,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Solicitações"
                icon={FileText}
                badge={pendingCount > 0 ? pendingCount : undefined}
                links={[
                  {
                    title: 'Solicitações',
                    href: ROUTES.APPOINTMENTS.LIST,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Bloqueios"
                icon={CalendarOff}
                links={[
                  {
                    title: 'Bloqueios',
                    href: ROUTES.APPOINTMENTS.BLOCKS,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Arquivos"
                icon={Archive}
                links={[
                  {
                    title: 'Arquivos',
                    href: ROUTES.APPOINTMENTS.ARCHIVE,
                  },
                ]}
                onLinkClick={handleClose}
              />
            </div>

            {/* Non-agent configuration section */}
            {!isPastoralAgent && (
              <>
                <div className="h-px bg-brand-700/30 mx-1" />

                {/* Group 2: Configuração */}
                <div className="space-y-1">
                  {!isCollapsed && (
                    <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                      Configuração
                    </div>
                  )}
                  <NavItem
                    title="Agentes pastorais"
                    icon={Users}
                    links={[
                      {
                        title: 'Agentes pastorais',
                        href: ROUTES.PASTORAL_AGENTS.HOME,
                      },
                    ]}
                    onLinkClick={handleClose}
                  />
                  <NavItem
                    title="Categorias de atendimento"
                    icon={Tag}
                    links={[
                      {
                        title: 'Categorias de atendimento',
                        href: ROUTES.APPOINTMENT_SERVICES.HOME,
                      },
                    ]}
                    onLinkClick={handleClose}
                  />
                  <NavItem
                    title="Atendimentos online"
                    icon={Globe}
                    links={[
                      {
                        title: 'Atendimentos online',
                        href: ROUTES.APPOINTMENTS.ONLINE_SETTINGS,
                      },
                    ]}
                    onLinkClick={handleClose}
                  />
                </div>

                <div className="h-px bg-brand-700/30 mx-1" />

                {/* Group 3: Relatórios */}
                <div className="space-y-1">
                  {!isCollapsed && (
                    <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                      Relatórios
                    </div>
                  )}
                  <NavItem
                    title="Pauta de atendimentos"
                    icon={FileSpreadsheet}
                    links={[
                      {
                        title: 'Pauta de atendimentos',
                        href: ROUTES.APPOINTMENTS.REPORT,
                      },
                    ]}
                    onLinkClick={handleClose}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Area 2: PROGRAMAÇÃO & EVENTOS */}
        {effectiveArea === 'events' && (
          <div className="space-y-4">
            {/* Group 1: Programação & Eventos */}
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  Programação & Eventos
                </div>
              )}
              <NavItem
                title="Início"
                icon={Home}
                exactMatch
                links={[
                  {
                    title: 'Início',
                    href: ROUTES.CALENDAR.HOME,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Calendário Paroquial"
                icon={Calendar}
                exactMatch
                links={[
                  {
                    title: 'Calendário Paroquial',
                    href: ROUTES.CALENDAR.VIEW,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Programação Recorrente"
                icon={Repeat}
                exactMatch
                links={[
                  {
                    title: 'Programação Recorrente',
                    href: ROUTES.CALENDAR.RECURRING,
                  },
                ]}
                onLinkClick={handleClose}
              />
            </div>

            <div className="h-px bg-brand-700/30 mx-1" />

            {/* Group 2: Comunicação & Avisos */}
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  Comunicação & Avisos
                </div>
              )}
              <NavItem
                title="Banners"
                icon={Megaphone}
                exactMatch
                links={[
                  {
                    title: 'Banners',
                    href: ROUTES.ANNOUNCEMENTS.HOME,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Faixa de Alerta"
                icon={AlertCircle}
                exactMatch
                links={[
                  {
                    title: 'Faixa de Alerta',
                    href: ROUTES.ANNOUNCEMENTS.ALERT,
                  },
                ]}
                onLinkClick={handleClose}
              />
            </div>
          </div>
        )}

        {/* Area 3: DADOS DA PARÓQUIA */}
        {effectiveArea === 'parish' && (
          <div className="space-y-4">
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  Dados da Paróquia
                </div>
              )}
              <NavItem
                title="Início"
                icon={Church}
                exactMatch
                links={[
                  {
                    title: 'Comunidades & Capelas',
                    href: ROUTES.COMMUNITIES.HOME,
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
                    href: ROUTES.CLERGY.HOME,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Secretaria & Doações"
                icon={Building2}
                links={[
                  {
                    title: 'Secretaria & Doações',
                    href: ROUTES.SECRETARIAT.HOME,
                  },
                ]}
                onLinkClick={handleClose}
              />
            </div>
          </div>
        )}

         {/* Area 4: COMUNICAÇÃO */}

        {/* Area 5: CONFIGURAÇÕES */}
        {effectiveArea === 'settings' && (
          <div className="space-y-4">
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  Configurações
                </div>
              )}
              <NavItem
                title="Home"
                icon={Home}
                exactMatch
                links={[
                  {
                    title: 'Home',
                    href: ROUTES.SETTINGS.HOME,
                  },
                ]}
                onLinkClick={handleClose}
              />
              <NavItem
                title="Gerenciar Acesso"
                icon={Lock}
                links={[
                  {
                    title: 'Gerenciar Acesso',
                    href: ROUTES.SETTINGS.MANAGE_LOGIN,
                  },
                ]}
                onLinkClick={handleClose}
              />

              {currentUser?.role === 'admin' && (
                <NavItem
                  title="Gestão de Usuários"
                  icon={Users}
                  links={[
                    {
                      title: 'Gestão de Usuários & Permissões',
                      href: ROUTES.SETTINGS.USERS,
                    },
                  ]}
                  onLinkClick={handleClose}
                />
              )}

              {currentUser?.role === 'admin' && (
                <NavItem
                  title="Dispositivos Conectados"
                  icon={Smartphone}
                  links={[
                    {
                      title: 'Dispositivos Conectados',
                      href: ROUTES.SETTINGS.DEVICES,
                    },
                  ]}
                  onLinkClick={handleClose}
                />
              )}
            </div>
          </div>
        )}

        {/* Bottom Section: Settings & User Profile & Collapse Button */}
        <div className="mt-auto space-y-2 pt-2">
          <div className="h-px bg-brand-700/30 mx-1 mb-2" />

          {/* Mobile Profile Display */}
          <div className="lg:hidden pt-2">
            <Profile />
          </div>

          {/* Desktop Collapse Toggle */}
          <div className="hidden lg:block pt-1">
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
                <TooltipContent
                  side="right"
                  className="bg-brand-900 text-brand-100 border border-brand-700 shadow-md"
                >
                  Expandir menu
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={toggleCollapsed}
                className="w-full flex items-center gap-3 hover:text-white hover:bg-brand-700/40 transition-colors rounded-xl px-3 py-2 text-sm font-medium cursor-pointer justify-start"
              >
                <PanelLeftClose className="h-4 w-4 shrink-0 text-brand-300" />
                <span className="text-brand-100">Recolher menu</span>
              </Button>
            )}
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
