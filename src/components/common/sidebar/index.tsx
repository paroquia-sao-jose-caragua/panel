'use client';

import { Calendar, Church, Megaphone, Menu, X, Users, Building2, Settings } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Button } from '@/components/ui/button';
import { NavItem } from './nav-item';
import { Profile } from './profile';
import { useState } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { ROUTES } from '@/constants/routes';

export const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();

  const handleClose = () => setOpen(false);

  const settingsLinks = [
    {
      title: 'Configurações',
      href: ROUTES.SETTINGS.HOME,
    },
  ];

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="fixed top-0 right-0 left-0 z-20 flex flex-col gap-4 border-b border-zinc-200 bg-brand-gradient py-2 md:py-4 data-[state=open]:bottom-0 lg:right-auto lg:border-r lg:pt-4 lg:pb-8 lg:data-[state=closed]:-bottom-px lg:w-90"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <img src="/logo-mark-dark.png" alt="" height={80} width={240} />
        <Collapsible.Trigger asChild className="lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto text-brand-300 hover:text-white hover:bg-brand-700/40 focus-visible:ring-2 focus-visible:ring-brand-400"
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

        <div className="space-y-0.5 px-4">
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
            title="Agenda"
            icon={Calendar}
            links={[
              {
                title: 'Agenda',
                href: '/agenda',
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
          {/* <NavItem
            title="Ministérios"
            icon={Users}
            links={[
              {
                title: 'Clérigos',
                href: '/clerigos',
              },
              {
                title: 'Pastorais',
                href: '/pastorais',
              },
            ]}
            onLinkClick={handleClose}
          /> */}
          {/* <NavItem
            title="Agenda"
            icon={Calendar}
            links={[
              {
                title: 'Eventos',
                href: '/agenda',
              },
              {
                title: 'Programação Completa',
                href: '/agenda',
              },
            ]}
            onLinkClick={handleClose}
          />
          <NavItem
            title="Blog"
            icon={MessageSquare}
            links={[
              {
                title: 'Avisos',
                href: '/comunicados',
              },
              {
                title: 'Notícias',
                href: '/noticias',
              },
              {
                title: 'Artigos',
                href: '/artigos',
              },
            ]}
            onLinkClick={handleClose}
          />
          <NavItem
            title="Galeria"
            icon={Image}
            links={[
              {
                title: 'Fotos',
                href: '/fotos',
              },
              {
                title: 'Vídeos',
                href: '/videos',
              },
              {
                title: 'Álbuns',
                href: '/albuns',
              },
            ]}
            onLinkClick={handleClose}
          /> */}
        </div>

        <div className="mt-auto flex flex-col gap-6 ">
          <div className="h-px bg-brand-700/30" />

          <nav className="space-y-0.5 px-4">
            <NavItem
              title="Configurações"
              icon={Settings}
              links={settingsLinks}
              onLinkClick={handleClose}
            />
          </nav>

          <div className="h-px bg-brand-700/30" />

          <div className="px-6">
            <Profile />
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
