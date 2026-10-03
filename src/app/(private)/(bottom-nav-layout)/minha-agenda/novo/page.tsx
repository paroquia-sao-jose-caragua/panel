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

interface FormErrors {
  date?: string;
  time?: string;
  serviceId?: string;
  requesterName?: string;
}

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

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

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

    const newErrors: FormErrors = {};

    if (!appointmentDate) {
      newErrors.date = 'Por favor, selecione uma data para o atendimento.';
    }

    if (!selectedTime) {
      newErrors.time =
        timeMode === 'available'
          ? 'Por favor, selecione um dos horários disponíveis abaixo.'
          : 'Por favor, informe o horário do atendimento (ex: 14:30).';
    }

    if (!serviceId) {
      newErrors.serviceId = 'Por favor, selecione o tipo de atendimento pastoral.';
    }

    if (!requesterName.trim()) {
      newErrors.requesterName = 'Por favor, informe o nome completo do solicitante.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Focus and scroll to the first field with an error
      setTimeout(() => {
        let targetId = '';
        if (newErrors.date) {
          targetId = 'new-appointment-date';
        } else if (newErrors.time) {
          targetId =
            timeMode === 'custom'
              ? 'custom-appointment-time'
              : 'slots-container';
        } else if (newErrors.serviceId) {
          targetId = 'service-select';
        } else if (newErrors.requesterName) {
          targetId = 'requester-name';
        }

        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
          }
        }
      }, 50);

      showAlert('Por favor, preencha os campos obrigatórios destacados em vermelho.');
      return;
    }

    setErrors({});

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

      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push(ROUTES.MY_AGENDA.SCHEDULE);
      }
    } catch {
      // Handled in mutation hook
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader title="Novo Atendimento" />

      <div className="px-4 pt-4 pb-12">
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
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
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                }}
                className={cn(
                  'h-11 rounded-xl text-sm transition-colors',
                  errors.date
                    ? 'border-red-500 focus-visible:ring-red-500 focus-error'
                    : ''
                )}
                required
              />
              {errors.date && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.date}</span>
                </p>
              )}
            </div>

            {/* Mode Switcher Chips */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTimeMode('available');
                  if (errors.time) {
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }
                }}
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
                onClick={() => {
                  setTimeMode('custom');
                  if (errors.time) {
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }
                }}
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
              <div
                id="slots-container"
                tabIndex={-1}
                className={cn(
                  'space-y-2 pt-1 p-2 rounded-2xl transition-all focus:outline-none',
                  errors.time
                    ? 'border-2 border-red-500 bg-red-50/20 focus-error'
                    : ''
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 block">
                    Horários disponíveis *
                  </span>
                  {errors.time && (
                    <span className="text-[11px] font-semibold text-red-600">
                      Seleção obrigatória
                    </span>
                  )}
                </div>

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
                          onClick={() => {
                            setSelectedSlotTime(slot.startTime);
                            if (errors.time) {
                              setErrors((prev) => ({ ...prev, time: undefined }));
                            }
                          }}
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

                {errors.time && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 pt-1 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.time}</span>
                  </p>
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
                  onChange={(e) => {
                    setCustomTime(e.target.value);
                    if (errors.time) {
                      setErrors((prev) => ({ ...prev, time: undefined }));
                    }
                  }}
                  className={cn(
                    'h-11 rounded-xl text-sm transition-colors',
                    errors.time
                      ? 'border-red-500 focus-visible:ring-red-500 focus-error'
                      : ''
                  )}
                  required
                />
                {errors.time && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.time}</span>
                  </p>
                )}
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
              <div>
                <select
                  id="service-select"
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    setSelectedSlotTime('');
                    if (errors.serviceId) {
                      setErrors((prev) => ({ ...prev, serviceId: undefined }));
                    }
                  }}
                  className={cn(
                    'w-full h-11 px-3 rounded-xl border bg-white text-sm font-medium text-zinc-900 transition-all focus:outline-none cursor-pointer',
                    errors.serviceId
                      ? 'border-red-500 ring-2 ring-red-200 focus-error'
                      : 'border-zinc-300 focus:ring-2 focus:ring-brand-500'
                  )}
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
                {errors.serviceId && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.serviceId}</span>
                  </p>
                )}
              </div>
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
              className="w-full h-11 px-3 rounded-xl border border-zinc-300 bg-white text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
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
                  onChange={(e) => {
                    setRequesterName(e.target.value);
                    if (errors.requesterName) {
                      setErrors((prev) => ({ ...prev, requesterName: undefined }));
                    }
                  }}
                  placeholder="Nome do fiel solicitante"
                  className={cn(
                    'h-11 rounded-xl text-sm transition-colors',
                    errors.requesterName
                      ? 'border-red-500 focus-visible:ring-red-500 focus-error'
                      : ''
                  )}
                  required
                />
                {errors.requesterName && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.requesterName}</span>
                  </p>
                )}
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

          {/* Section 5: Observações */}
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
            className="w-full h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-md active:scale-[0.99] cursor-pointer"
          >
            Agendar atendimento
          </Button>
        </form>
      </div>
    </div>
  );
}
