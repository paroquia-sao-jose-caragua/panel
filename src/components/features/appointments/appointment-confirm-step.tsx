'use client';

import React, { useMemo } from 'react';
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Building2,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  usePastoralAgents,
  useAppointmentServices,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import { useCommunities } from '@/api/communities/use-communities';
import useAuthStore from '@/stores/useAuthStore';
import type { AppointmentFormValues } from './types';

interface AppointmentConfirmStepProps {
  values: AppointmentFormValues;
  isEdit?: boolean;
}

export const AppointmentConfirmStep = ({
  values,
  isEdit = false,
}: AppointmentConfirmStepProps) => {
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';

  const { agents } = usePastoralAgents();
  const { services } = useAppointmentServices();
  const { communities } = useCommunities();
  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);

  const agent = useMemo(() => {
    if (isPastoralAgent && myAgent) return myAgent;
    return agents?.find((a) => a.id === values.agentId) || null;
  }, [isPastoralAgent, myAgent, agents, values.agentId]);

  const service = useMemo(() => {
    return services?.find((s) => s.id === values.serviceId) || null;
  }, [services, values.serviceId]);

  const community = useMemo(() => {
    return communities?.find((c) => c.id === values.communityId) || null;
  }, [communities, values.communityId]);

  const formattedDate = useMemo(() => {
    if (!values.appointmentDate) return '';
    const [year, month, day] = values.appointmentDate.split('-');
    return `${day}/${month}/${year}`;
  }, [values.appointmentDate]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
              {isEdit ? 'Revisão das Alterações' : 'Revisão do Agendamento'}
            </span>
            <h2 className="text-xl font-bold text-zinc-900 mt-0.5">
              {service?.title || 'Atendimento Pastoral'}
            </h2>
          </div>

          <Badge
            variant="outline"
            className={
              values.status === 'confirmed'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : values.status === 'completed'
                ? 'bg-blue-50 text-blue-800 border-blue-300'
                : values.status === 'cancelled'
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {isEdit
              ? values.status === 'confirmed'
                ? 'Status: Confirmado'
                : values.status === 'completed'
                ? 'Status: Realizado'
                : values.status === 'cancelled'
                ? 'Status: Cancelado'
                : 'Status: Pendente'
              : values.status === 'confirmed'
              ? 'Será criado como Confirmado'
              : 'Será criado como Pendente'}
          </Badge>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Agente */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-600" />
              <span>Agente Responsável</span>
            </span>
            <p className="text-sm font-semibold text-zinc-900">
              {agent ? `${agent.title ? `${agent.title} ` : ''}${agent.name}` : '-'}
            </p>
            <p className="text-xs text-zinc-500">{agent?.actingRole}</p>
          </div>

          {/* Data e Horário */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Data e Horário</span>
            </span>
            <p className="text-sm font-semibold text-zinc-900">
              {formattedDate} às {values.startTime}
            </p>
            <p className="text-xs text-zinc-500">
              Duração estimada: {service?.defaultDurationMinutes || 30} minutos
            </p>
          </div>

          {/* Local / Comunidade */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Local / Comunidade</span>
            </span>
            <p className="text-sm font-semibold text-zinc-900">
              {community?.name || 'Não vinculado / Em domicílio'}
            </p>
            <p className="text-xs text-zinc-500">
              {service?.category === 'home_visit' ? 'Visita pastoral domiciliar' : 'Atendimento presencial'}
            </p>
          </div>
        </div>

        <div className="h-px bg-zinc-100" />

        {/* Dados do Solicitante */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Dados do Solicitante</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <span className="text-xs text-zinc-500 block">Nome do Fiel</span>
              <p className="text-sm font-semibold text-zinc-900">{values.requesterName}</p>
            </div>

            <div>
              <span className="text-xs text-zinc-500 block">WhatsApp / Telefone</span>
              <p className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{values.requesterPhone}</span>
              </p>
            </div>

            <div>
              <span className="text-xs text-zinc-500 block">E-mail</span>
              <p className="text-sm text-zinc-800">{values.requesterEmail || 'Não informado'}</p>
            </div>

            {values.requesterRelationship && (
              <div>
                <span className="text-xs text-zinc-500 block">Parentesco / Relação</span>
                <p className="text-sm text-zinc-800">{values.requesterRelationship}</p>
              </div>
            )}

            {values.requesterNotes && (
              <div className="sm:col-span-2">
                <span className="text-xs text-zinc-500 block">Observações do Solicitante</span>
                <p className="text-xs text-zinc-700 italic mt-0.5">{values.requesterNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dados da Visita Domiciliar (se aplicável) */}
        {service?.requiresAddress && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
              <span>Visita Domiciliar ao Enfermo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-200">
              <div>
                <span className="text-xs text-zinc-500 block">Nome do Enfermo</span>
                <p className="text-sm font-bold text-zinc-900">{values.patientName || '-'}</p>
              </div>

              <div>
                <span className="text-xs text-zinc-500 block">Endereço da Visita</span>
                <p className="text-sm text-zinc-800 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>{values.patientAddress || '-'}</span>
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-zinc-500 block mb-1.5">Condições do Enfermo</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={values.isBedridden ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-zinc-100 text-zinc-500'}>
                    {values.isBedridden ? '✓ Acamado' : 'Não acamado'}
                  </Badge>
                  <Badge variant="outline" className={values.canSwallowHost ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'}>
                    {values.canSwallowHost ? '✓ Engole hóstia' : 'Dificuldade para engolir hóstia'}
                  </Badge>
                  <Badge variant="outline" className={values.isLucid ? 'bg-blue-50 text-blue-900 border-blue-300' : 'bg-zinc-100 text-zinc-500'}>
                    {values.isLucid ? '✓ Lúcido / Consciente' : 'Inconsciente / Não lúcido'}
                  </Badge>
                </div>
              </div>

              {values.patientNotes && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-zinc-500 block">Observações de Acesso / Saúde</span>
                  <p className="text-xs text-zinc-700 italic mt-0.5">{values.patientNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Anotações Pastorais Internas */}
        {values.privatePastoralNotes && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Anotações Internas Privadas (Equipe / Clérigo)</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 italic">
              {values.privatePastoralNotes}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-900 text-xs leading-relaxed flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Pronto para agendar o atendimento</span>
          Revise as informações acima com atenção. Ao clicar em &quot;Confirmar e Criar Agendamento&quot;,
          o atendimento será registrado no sistema e ficará visível na listagem da secretaria e na agenda do agente pastoral.
        </div>
      </div>
    </div>
  );
};
