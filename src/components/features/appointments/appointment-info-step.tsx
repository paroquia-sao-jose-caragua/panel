'use client';

import React, { useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  HeartHandshake,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePastoralAgents,
  useAppointmentServices,
  useAvailableSlots,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import { useCommunities } from '@/api/communities/use-communities';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';
import type { AppointmentFormValues } from './types';

const FIELD_ERROR_IDS: Array<[string, string]> = [
  ['agentId', 'appointment-agent-id'],
  ['title', 'appointment-title'],
  ['serviceId', 'appointment-service-id'],
  ['appointmentDate', 'appointment-date'],
  ['startTime', 'appointment-start-time'],
  ['requesterName', 'appointment-requester-name'],
  ['requesterPhone', 'appointment-requester-phone'],
  ['patientName', 'appointment-patient-name'],
  ['patientAddress', 'appointment-patient-address'],
];

export function focusFirstAppointmentError(errors: Record<string, string>) {
  setTimeout(() => {
    for (const [key, elementId] of FIELD_ERROR_IDS) {
      if (errors[key]) {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
        break;
      }
    }
  }, 50);
  showAlert('Por favor, preencha os campos obrigatórios destacados em vermelho.');
}

interface AppointmentInfoStepProps {
  values: AppointmentFormValues;
  onChange: <K extends keyof AppointmentFormValues>(
    field: K,
    value: AppointmentFormValues[K]
  ) => void;
  errors: Record<string, string>;
  isEdit?: boolean;
}

const COMMON_RELATIONSHIPS = [
  'O próprio fiel',
  'Filho(a)',
  'Cônjuge',
  'Mãe / Pai',
  'Irmão(ã)',
  'Cuidador(a)',
  'Vizinho(a) / Amigo(a)',
];

export const AppointmentInfoStep = ({
  values,
  onChange,
  errors,
  isEdit = false,
}: AppointmentInfoStepProps) => {
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';

  // Load resources
  const { agents, isPending: isLoadingAgents } = usePastoralAgents();
  const { services, isPending: isLoadingServices } = useAppointmentServices();
  const { communities, isPending: isLoadingCommunities } = useCommunities();
  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);

  // If pastoral agent, auto-assign their agentId
  useEffect(() => {
    if (isPastoralAgent && myAgent && values.agentId !== myAgent.id) {
      onChange('agentId', myAgent.id);
    }
  }, [isPastoralAgent, myAgent, values.agentId, onChange]);

  // Identify currently selected agent & service
  const selectedAgent = useMemo(() => {
    if (isPastoralAgent && myAgent) return myAgent;
    return agents?.find((a) => a.id === values.agentId) || null;
  }, [isPastoralAgent, myAgent, agents, values.agentId]);

  // Filter available services by selected agent (if agent has defined services)
  const availableServices = useMemo(() => {
    if (!services || services.length === 0) return [];
    if (!selectedAgent || !selectedAgent.services || selectedAgent.services.length === 0) {
      return services.filter((s) => s.active);
    }
    const agentServiceIds = new Set(selectedAgent.services.map((s) => s.id));
    return services.filter((s) => s.active && agentServiceIds.has(s.id));
  }, [services, selectedAgent]);

  const selectedService = useMemo(() => {
    return services?.find((s) => s.id === values.serviceId) || null;
  }, [services, values.serviceId]);

  // If service changes and doesn't belong to newly selected agent, reset serviceId
  useEffect(() => {
    if (
      values.serviceId &&
      availableServices.length > 0 &&
      !availableServices.some((s) => s.id === values.serviceId)
    ) {
      onChange('serviceId', availableServices[0]?.id || '');
    }
  }, [availableServices, values.serviceId, onChange]);

  // Query available slots for chosen agent, date, and service
  const { slots: availableSlots, isPending: isLoadingSlots } = useAvailableSlots(
    {
      agentId: values.agentId,
      date: values.appointmentDate,
      serviceId: values.serviceId || undefined,
    },
    Boolean(values.agentId && values.appointmentDate)
  );

  // Today's date string YYYY-MM-DD for min date
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const isCommitment = values.kind === 'commitment';

  return (
    <div className="space-y-8">
      {/* Seletor de Tipo (Atendimento vs Compromisso) */}
      {!isEdit && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="lg"
            variant={!isCommitment ? 'default' : 'outline'}
            onClick={() => onChange('kind', 'appointment')}
            className="w-full"
          >
            Atendimento de Fiel
          </Button>
          <Button
            type="button"
            size="lg"
            variant={isCommitment ? 'default' : 'outline'}
            onClick={() => onChange('kind', 'commitment')}
            className="w-full"
          >
            Compromisso (Reunião, Missa, Formação)
          </Button>
        </div>
      )}

      {/* 1. Atendimento e Agente Pastoral */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-700" />
            <span>
              {isCommitment ? 'Compromisso e Agente Pastoral' : 'Atendimento e Agente Pastoral'}
            </span>
          </h2>
          <Badge variant="outline" className="bg-brand-50 text-brand-800 border-brand-200 text-sm">
            Etapa 1
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agente Pastoral */}
          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
              Agente Pastoral / Clérigo <span className="text-rose-500">*</span>
            </label>

            {isPastoralAgent ? (
              <div className="flex items-center gap-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0">
                  {myAgent?.title || 'Ag'}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    {myAgent ? `${myAgent.title ? `${myAgent.title} ` : ''}${myAgent.name}` : user?.name}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {myAgent?.actingRole || 'Agente Pastoral'} • Agendando em seu próprio nome
                  </p>
                </div>
              </div>
            ) : isLoadingAgents ? (
              <Skeleton className="h-10 w-full rounded-xl" />
            ) : (
              <div>
                <select
                  id="appointment-agent-id"
                  value={values.agentId}
                  onChange={(e) => onChange('agentId', e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-xl border text-sm bg-white text-zinc-800 transition ${
                    errors.agentId
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-zinc-300 focus:border-brand-500'
                  }`}
                >
                  <option value="">Selecione quem realizará o atendimento...</option>
                  {agents?.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.title ? `${agent.title} ` : ''}
                      {agent.name} ({agent.actingRole})
                    </option>
                  ))}
                </select>
                {errors.agentId && (
                  <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.agentId}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tipo de Atendimento / Serviço OU Título do Compromisso */}
          {isCommitment ? (
            <div>
              <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
                Título do Compromisso <span className="text-rose-500">*</span>
              </label>
              <Input
                id="appointment-title"
                value={values.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Ex.: Reunião do CPP, Missa na Matriz, Formação..."
                className={errors.title ? 'border-rose-400' : ''}
              />
              {errors.title && (
                <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
                Tipo de Atendimento / Serviço <span className="text-rose-500">*</span>
              </label>

              {isLoadingServices ? (
                <Skeleton className="h-10 w-full rounded-xl" />
              ) : (
                <div>
                  <select
                    id="appointment-service-id"
                    value={values.serviceId}
                    onChange={(e) => onChange('serviceId', e.target.value)}
                    disabled={!values.agentId && !isPastoralAgent}
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm bg-white text-zinc-800 transition disabled:bg-zinc-100 disabled:text-zinc-400 ${
                      errors.serviceId
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-zinc-300 focus:border-brand-500'
                    }`}
                  >
                    <option value="">
                      {!values.agentId && !isPastoralAgent
                        ? 'Primeiro selecione o agente pastoral...'
                        : 'Selecione a categoria do serviço...'}
                    </option>
                    {availableServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title} ({service.defaultDurationMinutes} min)
                        {service.category === 'home_visit' ? ' — Visita Domiciliar' : ''}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && (
                    <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.serviceId}</span>
                    </p>
                  )}
                </div>
              )}

              {selectedService && (
                <div className="mt-2.5 flex items-center gap-2 flex-wrap text-sm">
                  <Badge
                    variant="outline"
                    className={
                      selectedService.category === 'home_visit'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }
                  >
                    {selectedService.category === 'home_visit'
                      ? 'Visita Domiciliar a Enfermo'
                      : 'Atendimento Presencial'}
                  </Badge>
                  <span className="text-zinc-500">
                    Duração estimada: <strong>{selectedService.defaultDurationMinutes} minutos</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Comunidade / Local */}
          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
              Comunidade / Local
            </label>

            {isLoadingCommunities ? (
              <Skeleton className="h-10 w-full rounded-xl" />
            ) : (
              <select
                value={values.communityId || ''}
                onChange={(e) => onChange('communityId', e.target.value || null)}
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-300 text-sm bg-white text-zinc-800 focus:border-brand-500"
              >
                <option value="">Não vinculado a comunidade específica (ou Domiciliar)</option>
                {communities?.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-sm text-zinc-500 mt-1">
              Local onde o compromisso ocorrerá.
            </p>
          </div>

          {/* Status do Atendimento */}
          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
              {isEdit
                ? isCommitment
                  ? 'Status do Compromisso'
                  : 'Status do Atendimento'
                : 'Status Inicial'}
            </label>
            <select
              value={values.status}
              onChange={(e) =>
                onChange('status', e.target.value as AppointmentFormValues['status'])
              }
              className="w-full h-11 px-3.5 rounded-xl border border-zinc-300 text-sm bg-white text-zinc-800 focus:border-brand-500"
            >
              <option value="confirmed">
                Confirmado (já alinhado com o clérigo)
              </option>
              <option value="pending">
                Pendente (Aguardando confirmação posterior)
              </option>
              {isEdit && (
                <>
                  <option value="completed">Realizado / Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Data e Horário */}
        <div className="pt-4 border-t border-zinc-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
                {isCommitment ? 'Data do Compromisso' : 'Data do Atendimento'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <Input
                id="appointment-date"
                type="date"
                min={isEdit ? undefined : todayStr}
                value={values.appointmentDate}
                onChange={(e) => onChange('appointmentDate', e.target.value)}
                className={errors.appointmentDate ? 'border-rose-400' : ''}
              />
              {errors.appointmentDate && (
                <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.appointmentDate}</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
                Horário de Início (HH:mm) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="appointment-start-time"
                  type="time"
                  value={values.startTime}
                  onChange={(e) => onChange('startTime', e.target.value)}
                  className={`pl-9 ${errors.startTime ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.startTime && (
                <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.startTime}</span>
                </p>
              )}
            </div>
          </div>

          {/* Duração livre para Compromisso */}
          {isCommitment && (
            <div className="mt-4 space-y-2">
              <label className="text-sm font-semibold text-zinc-800 block">
                Duração do Compromisso *
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: '30 min', mins: 30 },
                  { label: '1 hora', mins: 60 },
                  { label: '1h 30min', mins: 90 },
                  { label: '2 horas', mins: 120 },
                  { label: '3 horas', mins: 180 },
                ].map((opt) => (
                  <Button
                    key={opt.mins}
                    type="button"
                    size="sm"
                    variant={(values.durationMinutes || 60) === opt.mins ? 'default' : 'outline'}
                    onClick={() => onChange('durationMinutes', opt.mins)}
                  >
                    {opt.label}
                  </Button>
                ))}
                <div className="flex items-center gap-2 ml-1">
                  <Input
                    type="number"
                    min={15}
                    max={720}
                    step={5}
                    value={values.durationMinutes || 60}
                    onChange={(e) =>
                      onChange('durationMinutes', Number(e.target.value) || 30)
                    }
                    className="h-9 w-24 text-sm"
                  />
                  <span className="text-xs text-zinc-500">min</span>
                </div>
              </div>
            </div>
          )}

          {/* Available Slots Chips */}
          {values.agentId && values.appointmentDate && (
            <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Horários Livres da Grade na Data</span>
                </span>
                {isLoadingSlots && (
                  <span className="text-sm text-zinc-400">Verificando grade...</span>
                )}
              </div>

              {isLoadingSlots ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Nenhum horário livre pré-configurado na grade semanal para este dia. Você pode
                  digitar o horário desejado manualmente no campo acima.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableSlots.map((slot) => {
                    const isSelected = values.startTime === slot.startTime;
                    return (
                      <Button
                        key={`${slot.startTime}-${slot.endTime}`}
                        type="button"
                        size="sm"
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => onChange('startTime', slot.startTime)}
                        className={isSelected ? 'ring-2 ring-brand-300' : ''}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{slot.startTime} às {slot.endTime}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Dados do Solicitante (apenas para Atendimento) */}
      {!isCommitment && (
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-700" />
            <span>Dados do Solicitante (Fiel ou Familiar)</span>
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Informações de contato de quem está agendando ou solicitando o atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
              Nome Completo do Solicitante <span className="text-rose-500">*</span>
            </label>
            <Input
              id="appointment-requester-name"
              value={values.requesterName}
              onChange={(e) => onChange('requesterName', e.target.value)}
              placeholder="Ex: Maria das Graças Oliveira"
              className={errors.requesterName ? 'border-rose-400' : ''}
            />
            {errors.requesterName && (
              <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.requesterName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
              WhatsApp / Telefone com DDD <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="appointment-requester-phone"
                value={values.requesterPhone}
                onChange={(e) => onChange('requesterPhone', e.target.value)}
                placeholder="Ex: (12) 99876-5432"
                className={`pl-9 ${errors.requesterPhone ? 'border-rose-400' : ''}`}
              />
            </div>
            {errors.requesterPhone && (
              <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.requesterPhone}</span>
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
              E-mail do Solicitante (Opcional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={values.requesterEmail}
                onChange={(e) => onChange('requesterEmail', e.target.value)}
                placeholder="Ex: maria@email.com"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
              Parentesco / Relação com o Atendido
            </label>
            <Input
              value={values.requesterRelationship}
              onChange={(e) => onChange('requesterRelationship', e.target.value)}
              placeholder="Ex: O próprio fiel, Filho(a), Cônjuge"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_RELATIONSHIPS.map((rel) => (
                <Button
                  key={rel}
                  type="button"
                  size="xs"
                  variant={values.requesterRelationship === rel ? 'secondary' : 'outline'}
                  onClick={() => onChange('requesterRelationship', rel)}
                  className={
                    values.requesterRelationship === rel
                      ? 'bg-brand-50 text-brand-800 border-brand-300 font-semibold'
                      : 'text-zinc-600'
                  }
                >
                  {rel}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
            Observações ou Motivo do Atendimento
          </label>
          <Textarea
            value={values.requesterNotes}
            onChange={(e) => onChange('requesterNotes', e.target.value)}
            placeholder="Ex: Gostaria de conversar sobre direção espiritual e processo de matrimônio..."
            className="min-h-20"
          />
        </div>
      </div>
      )}

      {/* Observações para Compromisso */}
      {isCommitment && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <label className="text-sm font-semibold text-zinc-800 block">
            Observações do Compromisso (opcional)
          </label>
          <Textarea
            value={values.requesterNotes}
            onChange={(e) => onChange('requesterNotes', e.target.value)}
            placeholder="Detalhes sobre local, pauta da reunião ou observações..."
            className="min-h-20"
          />
        </div>
      )}

      {/* 3. Dados do Paciente e Endereço (Apenas se Visita Domiciliar / Requer Endereço) */}
      {!isCommitment && selectedService?.requiresAddress && (
        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-200 shadow-xs space-y-6">
          <div className="border-b border-purple-200/80 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-purple-950 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-700" />
              <span>Dados para Visita Domiciliar ao Enfermo</span>
            </h2>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 text-sm">
              Visita Pastoral
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
                Nome do Enfermo / Idoso <span className="text-rose-500">*</span>
              </label>
              <Input
                id="appointment-patient-name"
                value={values.patientName}
                onChange={(e) => onChange('patientName', e.target.value)}
                placeholder="Ex: José Benedito da Silva"
                className={errors.patientName ? 'border-rose-400 bg-white' : 'bg-white'}
              />
              {errors.patientName && (
                <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.patientName}</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
                Endereço Completo da Visita <span className="text-rose-500">*</span>
              </label>
              <Input
                id="appointment-patient-address"
                value={values.patientAddress}
                onChange={(e) => onChange('patientAddress', e.target.value)}
                placeholder="Rua, número, bairro, complemento e referência"
                className={errors.patientAddress ? 'border-rose-400 bg-white' : 'bg-white'}
              />
              {errors.patientAddress && (
                <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.patientAddress}</span>
                </p>
              )}
            </div>
          </div>

          {/* Condições Clínicas / Espirituais */}
          <div className="p-4 bg-white rounded-xl border border-purple-100 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-900">
              Condições do Enfermo para a Recepção do Sacramento
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isBedridden}
                  onChange={(e) => onChange('isBedridden', e.target.checked)}
                  className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-zinc-800">Está acamado(a)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.canSwallowHost}
                  onChange={(e) => onChange('canSwallowHost', e.target.checked)}
                  className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-zinc-800">Consegue engolir hóstia</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isLucid}
                  onChange={(e) => onChange('isLucid', e.target.checked)}
                  className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-zinc-800">Está consciente / lúcido(a)</span>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">
                Observações de Acesso ou Saúde (Ex: campainha, interfone, cuidados especiais)
              </label>
              <Input
                value={values.patientNotes}
                onChange={(e) => onChange('patientNotes', e.target.value)}
                placeholder="Ex: Interfone 102. Chamar no portão pois a campainha está com defeito."
                className="text-sm bg-zinc-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Anotações Pastorais Internas (Confidencial da Paróquia) */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Anotações Internas da Secretaria e Agente Pastoral</span>
          </h2>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-sm">
            Sigiloso / Não visível ao fiel
          </Badge>
        </div>

        <div>
          <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
            Anotações Pastorais Privadas
          </label>
          <Textarea
            value={values.privatePastoralNotes}
            onChange={(e) => onChange('privatePastoralNotes', e.target.value)}
            placeholder="Ex: Agendado presencialmente pela secretaria paroquial. Fiel solicitou atenção especial para unção dos enfermos."
            className="min-h-24 bg-amber-50/20 border-amber-200/80 text-sm"
          />
          <p className="text-sm text-zinc-500 mt-1">
            Estas anotações são visíveis unicamente para a equipe da secretaria e para o clérigo/agente responsável.
          </p>
        </div>
      </div>
    </div>
  );
};
