'use client';

import React from 'react';
import { Phone, Mail, Building2, CheckCircle2, XCircle, KeyRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAppointmentServices } from '@/api/appointments/use-appointments';
import { useCommunities } from '@/api/communities/use-communities';
import { listUsers } from '@/api/users/list-users';
import { Badge } from '@/components/ui/badge';
import type { AppointmentService } from '@/entities/appointment-service';
import type { PastoralAgentFormValues } from './types';

interface AgentConfirmStepProps {
  values: PastoralAgentFormValues;
  mode: 'create' | 'edit';
}

export const AgentConfirmStep = ({ values, mode }: AgentConfirmStepProps) => {
  const { services } = useAppointmentServices();
  const { communities } = useCommunities();
  const { data: usersData } = useQuery({
    queryKey: ['users-for-agent'],
    queryFn: () => listUsers({ pageSize: 100 }),
    enabled: !!values.userId,
  });

  const selectedServices = (services as AppointmentService[]).filter((s: AppointmentService) => (values.serviceIds || []).includes(s.id));
  const selectedCommunity = communities.find((c) => c.id === values.communityId);
  const linkedUser = usersData?.users.find((u) => u.id === values.userId);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-4">
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider block mb-1">
            {mode === 'create' ? 'Revisão do Novo Cadastro' : 'Revisão das Alterações'}
          </span>
          <h2 className="text-xl font-bold text-zinc-900">
            {values.title ? `${values.title} ` : ''}
            {values.name}
          </h2>
          <span className="text-sm text-zinc-600 font-medium">
            {values.actingRole}
          </span>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2">
          {values.active ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300">
              Agente Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-zinc-100 text-zinc-600 border-zinc-300">
              Inativo
            </Badge>
          )}

          {values.acceptsAppointments ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300">
              Recebendo Agendamentos Públicos
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
              Agenda Pública Pausada
            </Badge>
          )}
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-xl text-sm">
          <div>
            <span className="text-xs text-zinc-400 font-medium block mb-0.5">
              WhatsApp / Contato
            </span>
            <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-500" />
              {values.phone}
            </span>
          </div>

          <div>
            <span className="text-xs text-zinc-400 font-medium block mb-0.5">
              E-mail
            </span>
            <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              {values.email || 'Não informado'}
            </span>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs text-zinc-400 font-medium block mb-0.5">
              Comunidade Principal
            </span>
            <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              {selectedCommunity?.name || 'Todas as comunidades (Paróquia Geral)'}
            </span>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-zinc-200/60">
            <span className="text-xs text-zinc-400 font-medium block mb-0.5">
              Acesso ao Painel Administrativo
            </span>
            <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
              {linkedUser
                ? `${linkedUser.name} (${linkedUser.email}) — Acesso liberado a "Meus Atendimentos"`
                : 'Nenhum usuário vinculado (apenas registro operacional)'}
            </span>
          </div>
        </div>

        {/* Serviços Habilitados */}
        <div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
            Serviços de Atendimento Habilitados ({selectedServices.length}):
          </span>

          {selectedServices.length === 0 ? (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-xl">
              Nenhum serviço selecionado. O agente não estará apto a receber agendamentos de nenhum tipo de serviço no site.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedServices.map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center gap-2 p-3 bg-brand-50/60 border border-brand-200 rounded-xl text-xs font-medium text-brand-900"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>{svc.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
