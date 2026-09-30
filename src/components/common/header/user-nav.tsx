'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LogOut,
  Settings,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/users/logout';
import { useNavigate } from '@/hooks/use-navigate';
import useTranslator from '@/hooks/use-translator';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';
import { ConfirmDialog } from '@/components/common/dialog/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserNav() {
  const { t } = useTranslator();
  const navigate = useNavigate();
  const { user, setLoggedOut } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { mutate, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: ({ statusCode }) => {
      if (statusCode === 200) {
        setLoggedOut();
        navigate.replace('/entrar');
      } else {
        showAlert(t('error-logging-out'));
      }
    },
    onError: () => {
      showAlert(t('error-logging-out'));
    },
  });

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'secretary':
      case 'user':
        return 'Secretaria';
      case 'pastoral_agent':
        return 'Agente Pastoral';
      case 'viewer':
      default:
        return 'Visualizador';
    }
  };

  const initial = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer border border-zinc-200/80 shadow-2xs"
            aria-label="Menu do Usuário"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-800 text-brand-100 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 border border-brand-700 shadow-2xs">
              {initial}
            </div>

            <div className="hidden sm:flex flex-col text-left min-w-0">
              <span className="text-xs font-semibold text-zinc-900 truncate max-w-32">
                {user?.name}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {getRoleLabel(user?.role)}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 p-2 rounded-2xl bg-white border border-zinc-200 shadow-xl space-y-1 z-50"
        >
          {/* User Profile Info Card Header */}
          <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-zinc-900 truncate">
                {user?.name}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                {getRoleLabel(user?.role)}
              </span>
            </div>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>

          <DropdownMenuSeparator className="my-1 bg-zinc-100" />

          {/* Navigation Options Group */}
          <DropdownMenuGroup className="space-y-0.5">
            {user?.role !== 'pastoral_agent' && (
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.SETTINGS.HOME}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-700 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-zinc-500" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.HELP.HOME}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-700 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>Central de Ajuda & Manuais</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1 bg-zinc-100" />

          {/* Logout Action */}
          <DropdownMenuItem
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-600 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sair da Conta</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Encerrar Sessão"
        description="Tem certeza que deseja sair do painel administrativo da Paróquia São José?"
        confirmText="Sim, sair"
        cancelText="Cancelar"
        variant="destructive"
        isPending={isLoggingOut}
        onConfirm={async () => {
          await mutate();
        }}
      />
    </>
  );
}
