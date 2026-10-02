'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Tag,
  User,
  Phone,
  FileText,
  AlertCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import {
  useMyPastoralAgent,
  useAppointmentServices,
  useAvailableSlots,
  useCreateAppointment,
} from '@/api/appointments/use-appointments';
import { useCommunities } from '@/api/communities/use-communities';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';

export default function MinhaAgendaNovoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDate = searchParams?.get('date') || dayjs().format('YYYY-MM-DD');

  const { user } = useAuthStore();
  const { agent: myAgent, isPending: isAgentPending } = useMyPastoralAgent();
  const { services, isPending: isServicesPending } = useAppointmentServices();
  const { communities } = useCommunities();
  const { createAppointment, isCreating } = useCreateAppointment();

  // Form states
  const [appointmentDate, setAppointmentDate] = useState(initialDate);
  const [timeMode, setTimeMode] = useState<'available' | 'custom'>('available');
  const [selectedSlotTime, setSelectedSlotTime] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [communityId, setCommunityId] = useState<string>('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-select first service if available
  useEffect(() => {
    if (services && services.length > 0 && !serviceId) {
      setServiceId(services[0].id);
    }
  }, [services, serviceId]);

  // Query available slots for the selected date and service
  const agentId = myAgent?.id || '';
  const { slots, isPending: isSlotsPending } = useAvailableSlots(
    {
      agentId,
      date: appointmentDate,
      serviceId: serviceId || undefined,
    },
    Boolean(agentId) && Boolean(appointmentDate)
  );

  const selectedTime =
    timeMode === 'available' ? selectedSlotTime : customTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agentId) {
      showAlert('Perfil do agente pastoral não encontrado.');
      return;
    }

    if (!appointmentDate) {
      showAlert('Por favor, selecione a data do atendimento.');
      return;
    }

    if (!selectedTime) {
      showAlert('Por favor, selecione ou informe o horário do atendimento.');
      return;
    }

    if (!serviceId) {
      showAlert('Por favor, selecione o tipo de atendimento.');
      return;
    }

    if (!requesterName.trim()) {
      showAlert('Por favor, informe o nome do solicitante.');
      return;
    }

    try {
      await createAppointment({
        agentId,
        serviceId,
        communityId: communityId || null,
        appointmentDate,
        startTime: selectedTime,
        requesterName: requesterName.trim(),
        requesterPhone: requesterPhone.trim() || '(12) 99999-9999',
        requesterNotes: notes.trim() || null,
        status: 'confirmed',
      });

      showAlert('Atendimento agendado com sucesso!');
      router.push(ROUTES.MY_AGENDA.HOME);
    } catch {
      // Handled in mutation hook
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Novo Atendimento"
        backHref={ROUTES.MY_AGENDA.HOME}
      />

      <div className="px-4 pt-4 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Data e Horário */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                1. Data e horário
              </h2>
            </div>

            {/* Date Input */}
            <div>
              <label
                htmlFor="new-appointment-date"
                className="text-xs font-semibold text-zinc-700 block mb-1"
              >
                Data *
              </label>
              <Input
                id="new-appointment-date"
                type="date"
                value={appointmentDate}
                min={dayjs().format('YYYY-MM-DD')}
                onChange={(e) => {
                  setAppointmentDate(e.target.value);
                  setSelectedSlotTime('');
                }}
                className="h-11 rounded-xl text-sm"
                required
              />
            </div>

            {/* Mode Switcher Chips */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTimeMode('available')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none',
                  timeMode === 'available'
                    ? 'bg-brand-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                Horário disponível
              </button>

              <button
                type="button"
                onClick={() => setTimeMode('custom')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none',
                  timeMode === 'custom'
                    ? 'bg-brand-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                Horário específico
              </button>
            </div>

            {/* Slots or Custom Input */}
            {timeMode === 'available' ? (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-zinc-600 block">
                  Horários disponíveis
                </span>

                {isSlotsPending ? (
                  <div className="grid grid-cols-4 gap-2">
                    <Skeleton className="h-10 rounded-xl" />
                    <Skeleton className="h-10 rounded-xl" />
                    <Skeleton className="h-10 rounded-xl" />
                    <Skeleton className="h-10 rounded-xl" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                    <p className="font-semibold">Nenhum horário livre nesta data.</p>
                    <p className="text-[11px] text-amber-800">
                      Você pode selecionar outro dia ou alternar para &ldquo;Horário
                      específico&rdquo; para encaixar um atendimento extraordinário.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot) => {
                      const isSelected = selectedSlotTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          onClick={() => setSelectedSlotTime(slot.startTime)}
                          className={cn(
                            'py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer border select-none',
                            isSelected
                              ? 'bg-brand-900 text-white border-brand-900 shadow-xs ring-2 ring-brand-300'
                              : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                          )}
                        >
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-1">
                <label
                  htmlFor="custom-appointment-time"
                  className="text-xs font-semibold text-zinc-700 block mb-1"
                >
                  Horário específico (HH:mm) *
                </label>
                <Input
                  id="custom-appointment-time"
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="h-11 rounded-xl text-sm"
                  required
                />
              </div>
            )}
          </div>

          {/* Section 2: Tipo de Atendimento */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                2. Tipo de atendimento *
              </h2>
            </div>

            {isServicesPending ? (
              <Skeleton className="h-11 rounded-xl" />
            ) : (
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setSelectedSlotTime('');
                }}
                className="w-full h-11 px-3 rounded-xl border border-zinc-300 bg-white text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                required
              >
                <option value="" disabled>
                  Selecione o tipo de atendimento
                </option>
                {services?.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.title} ({svc.defaultDurationMinutes} min)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Section 3: Comunidade (Opcional) */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                3. Comunidade (opcional)
              </h2>
            </div>

            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-zinc-300 bg-white text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            >
              <option value="">Matriz / Gabinete Pastoral</option>
              {communities?.map((comm) => (
                <option key={comm.id} value={comm.id}>
                  {comm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section 4: Nome do Solicitante */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                4. Informações do solicitante
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="requester-name"
                  className="text-xs font-semibold text-zinc-700 block mb-1"
                >
                  Nome completo *
                </label>
                <Input
                  id="requester-name"
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="Nome do fiel solicitante"
                  className="h-11 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="requester-phone"
                  className="text-xs font-semibold text-zinc-700 block mb-1"
                >
                  Telefone / WhatsApp (opcional)
                </label>
                <Input
                  id="requester-phone"
                  type="tel"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  placeholder="(12) 99999-9999"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Observações (Opcional) */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-800" />
                <h2 className="text-sm font-bold text-zinc-900">
                  5. Observações (opcional)
                </h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {notes.length}/500
              </span>
            </div>

            <Textarea
              value={notes}
              maxLength={500}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione alguma observação pastoral ou detalhe sobre o atendimento..."
              rows={3}
              className="text-sm rounded-xl resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isCreating}
            className="w-full h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-md active:scale-[0.99]"
          >
            Agendar atendimento
          </Button>
        </form>
      </div>
    </div>
  );
}
