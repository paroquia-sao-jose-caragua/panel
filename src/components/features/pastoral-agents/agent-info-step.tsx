'use client';

import React from 'react';
import { User, Phone, Mail, Building2, CheckCircle2, KeyRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommunities } from '@/api/communities/use-communities';
import { useAppointmentServices } from '@/api/appointments/use-appointments';
import { listUsers } from '@/api/users/list-users';
import type { PastoralAgentFormValues } from './types';

interface AgentInfoStepProps {
  values: PastoralAgentFormValues;
  onChange: <K extends keyof PastoralAgentFormValues>(
    field: K,
    value: PastoralAgentFormValues[K]
  ) => void;
  errors: Record<string, string>;
}

const COMMON_ROLES = [
  'Pároco',
  'Diácono',
  'Vigário Paroquial',
  'Ministro da Sagrada Comunhão (MESC)',
  'Pastoral da Saúde',
  'Acolhimento Paroquial',
];

export const AgentInfoStep = ({ values, onChange, errors }: AgentInfoStepProps) => {
  const { communities, isPending: isLoadingCommunities } = useCommunities();
  const { services, isPending: isLoadingServices } = useAppointmentServices();
  const { data: usersData, isPending: isLoadingUsers } = useQuery({
    queryKey: ['users-for-agent'],
    queryFn: () => listUsers({ pageSize: 100 }),
  });
  const users = usersData?.users || [];

  const toggleService = (serviceId: string) => {
    const current = values.serviceIds || [];
    if (current.includes(serviceId)) {
      onChange(
        'serviceIds',
        current.filter((id) => id !== serviceId)
      );
    } else {
      onChange('serviceIds', [...current, serviceId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dados Básicos */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-700" />
            <span>Identificação e Atuação do Agente</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Informe o nome, título e o papel pastoral desempenhado na paróquia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Título / Tratamento
            </label>
            <Input
              value={values.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Ex: Pe., Diác., Min., Ir."
              className="h-10"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Como o agente é chamado pelos fiéis.
            </span>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Nome Completo *
            </label>
            <Input
              value={values.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Ex: Pe. André, João Carlos da Silva"
              className={`h-10 ${errors.name ? 'border-red-500 focus-error' : ''}`}
            />
            {errors.name && (
              <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Função / Atuação Pastoral *
          </label>
          <Input
            value={values.actingRole}
            onChange={(e) => onChange('actingRole', e.target.value)}
            placeholder="Ex: Pároco, Diácono, Ministro da Eucaristia (MESC), Pastoral da Saúde"
            className={`h-10 ${errors.actingRole ? 'border-red-500 focus-error' : ''}`}
          />
          {errors.actingRole && (
            <span className="text-xs text-red-500 mt-1 block">{errors.actingRole}</span>
          )}

          {/* Sugestões rápidas de papel */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-zinc-400 mr-1 self-center">Sugestões:</span>
            {COMMON_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onChange('actingRole', role)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  values.actingRole === role
                    ? 'bg-brand-50 border-brand-300 text-brand-800 font-semibold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>WhatsApp / Celular com DDD *</span>
            </label>
            <Input
              value={values.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="(12) 99999-9999"
              className={`h-10 ${errors.phone ? 'border-red-500 focus-error' : ''}`}
            />
            {errors.phone && (
              <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>
            )}
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Utilizado para notificações e contato direto sobre agendamentos.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>E-mail (opcional)</span>
            </label>
            <Input
              type="email"
              value={values.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="exemplo@gmail.com"
              className="h-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Comunidade de Atuação Principal (opcional)</span>
          </label>
          {isLoadingCommunities ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <select
              value={values.communityId || ''}
              onChange={(e) => onChange('communityId', e.target.value || null)}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm bg-white"
            >
              <option value="">Todas as comunidades / Paróquia Geral</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-100">
          <label className="text-xs font-semibold text-zinc-700 block mb-1 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
            <span>Vincular Conta de Usuário do Painel (Opcional)</span>
          </label>
          {isLoadingUsers ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <select
              value={values.userId || ''}
              onChange={(e) => {
                const selectedId = e.target.value || null;
                onChange('userId', selectedId);
                if (selectedId && !values.email) {
                  const selectedUser = users.find((u) => u.id === selectedId);
                  if (selectedUser?.email) {
                    onChange('email', selectedUser.email);
                  }
                }
              }}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm bg-white"
            >
              <option value="">Nenhum usuário vinculado (apenas registro operacional)</option>
              {users.map((u) => {
                const roleLabel =
                  u.role === 'pastoral_agent'
                    ? 'Agente Pastoral'
                    : u.role === 'admin'
                    ? 'Administrador'
                    : u.role === 'secretary'
                    ? 'Secretaria'
                    : u.role;
                return (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) — [{roleLabel}]
                  </option>
                );
              })}
            </select>
          )}
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Permite que o agente pastoral faça login no painel com privilégio exclusivo para visualizar e gerenciar seus atendimentos.
          </span>
        </div>
      </div>

      {/* Serviços Pastorais Disponibilizados */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-700" />
            <span>Serviços Oferecidos por este Agente</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Selecione quais tipos de atendimento os fiéis poderão agendar com este agente pastoral.
          </p>
        </div>

        {isLoadingServices ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-xs text-zinc-500 italic p-4 text-center border border-dashed border-zinc-200 rounded-xl">
            Nenhum serviço de agendamento cadastrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((svc) => {
              const isSelected = (values.serviceIds || []).includes(svc.id);
              return (
                <button
                  type="button"
                  key={svc.id}
                  onClick={() => toggleService(svc.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50/70 border-brand-500 shadow-xs ring-1 ring-brand-500/30'
                      : 'bg-zinc-50/70 border-zinc-200 hover:bg-zinc-100/70'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-zinc-900 block">
                        {svc.title}
                      </span>
                      {svc.title.toLowerCase().includes('confissão') && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          Sacramental (Padres)
                        </span>
                      )}
                      {svc.title.toLowerCase().includes('aconselhamento') && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          Geral / Escuta
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 line-clamp-1">
                      {svc.description ||
                        (svc.category === 'home_visit'
                          ? 'Visita domiciliar a enfermo'
                          : 'Atendimento na secretaria/igreja')}
                    </span>
                  </div>

                  <div
                    className={`size-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-brand-700 border-brand-700 text-white'
                        : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Regras e Disponibilidade */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900">
            Regras de Agendamento e Visibilidade
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Controle a exibição no site público e o recebimento de novos pedidos.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 bg-zinc-50 rounded-xl">
            <div>
              <span className="text-sm font-semibold text-zinc-800 block">
                Receber Agendamentos Públicos
              </span>
              <span className="text-xs text-zinc-500">
                Se desativado, o agente não aparece na lista de opções para os fiéis no site.
              </span>
            </div>
            <Switch
              checked={values.acceptsAppointments}
              onCheckedChange={(checked) => onChange('acceptsAppointments', checked)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 bg-zinc-50 rounded-xl">
            <div>
              <span className="text-sm font-semibold text-zinc-800 block">
                Agente Ativo no Sistema
              </span>
              <span className="text-xs text-zinc-500">
                Mantenha ativo para que este agente conste nos registros operacionais da paróquia.
              </span>
            </div>
            <Switch
              checked={values.active}
              onCheckedChange={(checked) => onChange('active', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
