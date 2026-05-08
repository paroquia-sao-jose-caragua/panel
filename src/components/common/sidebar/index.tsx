'use client';

import {
  Calendar,
  Church,
  Cog,
  Home,
  Image,
  LifeBuoy,
  Menu,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Logo } from './logo';
import * as Collapsible from '@radix-ui/react-collapsible';
import { NavItem } from './nav-item';
import { Profile } from './profile';
import { useState } from 'react';

export const AppSidebar = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="fixed top-0 right-0 left-0 z-20 flex flex-col gap-6 border-b border-zinc-200 bg-brand-gradient py-2 md:py-4 data-[state=open]:bottom-0 lg:right-auto lg:border-r lg:py-8 lg:data-[state=closed]:bottom-0 lg:w-90"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Logo />
        <Collapsible.Trigger asChild className="lg:hidden">
          <button
            type="button"
            className="ml-auto rounded-md p-2 hover:cursor-pointer hover:bg-brand-700/30 focus-visible:ring-2 focus-visible:ring-brand-400 outline-none transition-colors"
          >
            <Menu className="h-6 w-6 text-brand-300" />
          </button>
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
            title="Agenda"
            icon={Calendar}
            links={[
              {
                title: 'schedule',
                href: '/calendar',
              },
            ]}
            onLinkClick={handleClose}
          />
          <NavItem
            title="Ministérios"
            icon={Users}
            links={[
              {
                title: 'Clérigos',
                href: '/clergies',
              },
              {
                title: 'Pastorais',
                href: '/pastorals',
              },
            ]}
            onLinkClick={handleClose}
          />
          {/* <NavItem
            title="Agenda"
            icon={Calendar}
            links={[
              {
                title: 'Eventos',
                href: '/events',
              },
              {
                title: 'Programação Completa',
                href: '/full-schedule',
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
                href: '/notices',
              },
              {
                title: 'Notícias',
                href: '/news',
              },
              {
                title: 'Artigos',
                href: '/articles',
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
                href: '/photos',
              },
              {
                title: 'Vídeos',
                href: '/videos',
              },
              {
                title: 'Álbuns',
                href: '/albums',
              },
            ]}
            onLinkClick={handleClose}
          /> */}
        </div>

        <div className="mt-auto flex flex-col gap-6 ">
          {/* <div className="h-px bg-brand-700/30" />

          <nav className="space-y-0.5 px-4">
            <NavItem
              title="Suporte"
              icon={LifeBuoy}
              links={[
                {
                  title: 'FAQ',
                  href: '/faq',
                },
              ]}
              onLinkClick={handleClose}
            />
            <NavItem
              title="Configurações"
              icon={Cog}
              links={[
                {
                  title: 'Alterar Senha',
                  href: '/change-password',
                },
                {
                  title: 'Gerenciar Acessos',
                  href: '/manage-access',
                },
              ]}
              onLinkClick={handleClose}
            />
          </nav> */}

          <div className="h-px bg-brand-700/30" />

          <div className="px-6">
            <Profile />
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
