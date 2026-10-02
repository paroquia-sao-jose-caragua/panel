'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Clock,
  CalendarOff,
  LogOut,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useMyPastoralAgent } from '@/api/appointments/use-appointments';
import { logout } from '@/api/users/logout';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { ROUTES } from '@/constants/routes';
import { ConfirmDialog } from '@/components/common/dialog/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { showAlert } from '@/utils/showAlert';
import useAuthStore from '@/stores/useAuthStore';

export default function MinhaAgendaPerfilPage() {
  const router = useRouter();
  const { user, setLoggedOut } = useAuthStore();
  const { agent: myAgent, isPending } = useMyPastoralAgent();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { mutate: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: ({ statusCode }) => {
      if (statusCode === 200) {
        setLoggedOut();
        router.replace('/entrar');
      } else {
        showAlert('Erro ao encerrar a sessão.');
      }
    },
    onError: () => {
      showAlert('Erro ao encerrar a sessão.');
    },
  });

  const agentDisplayName =
    myAgent?.name || user?.name || 'Agente Pastoral';
  const agentTitle = myAgent?.title ? `${myAgent.title} ` : '';
  const actingRole = myAgent?.actingRole || 'Agente Pastoral';

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader title="Meu Perfil" />

      <div className="px-4 pt-4 pb-12 space-y-6">
        {/* Pastoral Agent Profile Card */}
        <section className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-4">
            {/* Avatar circle */}
            <div className="w-16 h-16 rounded-full bg-brand-800 border-2 border-brand-500/40 text-brand-100 flex items-center justify-center text-xl font-bold font-serif shadow-xs">
              {agentDisplayName.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight leading-snug truncate">
                {agentTitle}
                {agentDisplayName}
              </h2>
              <span className="text-xs font-semibold text-brand-800 inline-block mt-0.5">
                {actingRole}
              </span>
              <span className="text-[11px] text-zinc-400 truncate mt-0.5">
                {myAgent?.email || user?.email}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
            {myAgent?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>{myAgent.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>Acesso restrito à agenda pessoal do agente</span>
            </div>
          </div>
        </section>

        {/* Section: Configurações da Agenda */}
        <section className="space-y-3">
          <div className="px-1">
            <h3 className="text-sm font-bold text-zinc-900">
              Configurações da agenda
            </h3>
            <p className="text-xs text-zinc-500">
              Personalize seus horários de atendimento e períodos indisponíveis.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs divide-y divide-zinc-100 overflow-hidden">
            {/* Minha Disponibilidade */}
            <Link
              href={ROUTES.MY_AGENDA.SETTINGS.AVAILABILITY}
              className="flex items-center justify-between p-4 hover:bg-zinc-50 transition active:scale-[0.99] group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 group-hover:text-brand-800 transition-colors">
                    Minha disponibilidade
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Definir dias e horários recorrentes
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Bloqueios */}
            <Link
              href={ROUTES.MY_AGENDA.SETTINGS.BLOCKS}
              className="flex items-center justify-between p-4 hover:bg-zinc-50 transition active:scale-[0.99] group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <CalendarOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 group-hover:text-brand-800 transition-colors">
                    Bloqueios de agenda
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Férias, retiros e datas indisponíveis
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </section>

        {/* Section: Ajuda & Suporte */}
        <section className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs divide-y divide-zinc-100 overflow-hidden">
          <Link
            href={ROUTES.HELP.APPOINTMENTS}
            className="flex items-center justify-between p-4 hover:bg-zinc-50 transition active:scale-[0.99] group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">
                  Manual do Agente Pastoral
                </h4>
                <p className="text-xs text-zinc-500">Dúvidas sobre a agenda</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </Link>
        </section>

        {/* Section: Logout */}
        <section className="pt-2">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full h-12 rounded-2xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-semibold text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sair da conta</span>
          </button>
        </section>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Sair da conta"
        description="Tem certeza de que deseja encerrar a sua sessão na agenda pastoral?"
        confirmText="Sim, sair"
        cancelText="Voltar"
        variant="destructive"
        isPending={isLoggingOut}
        onConfirm={() => doLogout()}
      />
    </div>
  );
}
