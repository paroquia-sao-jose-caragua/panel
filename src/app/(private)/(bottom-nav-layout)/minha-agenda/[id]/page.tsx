'use client';

import React, { useState, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  Phone,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  useAppointment,
  useAppointments,
} from '@/api/appointments/use-appointments';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { CancelAppointmentDialog } from '@/components/features/minha-agenda/cancel-appointment-dialog';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/entities/appointment';

export default function MinhaAgendaDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { appointment, isPending, refetch } = useAppointment(id);
  const { updateStatus, isUpdatingStatus } = useAppointments();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const formattedDate = useMemo(() => {
    if (!appointment?.appointmentDate) return '';
    const d = dayjs(appointment.appointmentDate).locale('pt-br');
    const raw = d.format('ddd, DD MMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [appointment?.appointmentDate]);

  const handleCancelConfirm = async (reason?: string) => {
    if (!appointment) return;
    try {
      await updateStatus({
        id: appointment.id,
        status: 'cancelled',
        cancellationReason: reason,
      });
      setShowCancelDialog(false);
      showAlert('Atendimento cancelado com sucesso.');
      refetch();
    } catch {
      // Handled in mutation hook
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!appointment) return;
    try {
      setIsCompleting(true);
      await updateStatus({
        id: appointment.id,
        status: 'completed',
      });
      showAlert('Atendimento marcado como Realizado!');
      refetch();
    } catch {
      // Handled in mutation hook
    } finally {
      setIsCompleting(false);
    }
  };

  const handleConfirmPending = async () => {
    if (!appointment) return;
    try {
      await updateStatus({
        id: appointment.id,
        status: 'confirmed',
      });
      showAlert('Atendimento confirmado com sucesso!');
      refetch();
    } catch {
      // Handled
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Confirmado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <Clock3 className="w-3.5 h-3.5 text-amber-700" />
            Pendente
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
            Realizado
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col flex-1">
        <MinhaAgendaHeader title="Detalhes do Atendimento" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col flex-1">
        <MinhaAgendaHeader title="Detalhes do Atendimento" />
        <div className="p-8 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto" />
          <p className="text-base font-semibold text-zinc-800">
            Atendimento não encontrado
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.MY_AGENDA.HOME)}
            className="rounded-xl"
          >
            Voltar para o Início
          </Button>
        </div>
      </div>
    );
  }

  const isConfirmed = appointment.status === 'confirmed';
  const isPendingStatus = appointment.status === 'pending';
  const isArchived =
    appointment.status === 'completed' || appointment.status === 'cancelled';

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Detalhes do Atendimento"
        backHref={
          isArchived ? ROUTES.MY_AGENDA.ARCHIVE : ROUTES.MY_AGENDA.SCHEDULE
        }
      />

      <div className="px-4 pt-4 pb-12 space-y-5">
        {/* Main Details Card (Screen 4 visual) */}
        <section className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-2xs space-y-5">
          {/* Service Icon inside soft container */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shadow-2xs">
            <CalendarCheck className="w-8 h-8" />
          </div>

          {/* Service Title */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 font-serif">
              {appointment.service?.title || 'Atendimento Pastoral'}
            </h2>
          </div>

          {/* Meta rows */}
          <div className="space-y-3 pt-1 text-sm text-zinc-700">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="font-semibold text-zinc-900">
                {formattedDate} • {appointment.startTime} às {appointment.endTime}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>
                {appointment.agent?.title ? `${appointment.agent.title} ` : ''}
                {appointment.agent?.name || 'Agente Pastoral'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>
                {appointment.community?.name ||
                  appointment.patientAddress ||
                  'Comunidade Matriz'}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="pt-2">{getStatusBadge(appointment.status)}</div>
        </section>

        {/* Requester Info Card */}
        <section className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-zinc-900">
            Informações do Solicitante
          </h3>

          <div className="space-y-2 text-sm text-zinc-700">
            <div className="flex items-center justify-between py-1 border-b border-zinc-100">
              <span className="text-xs text-zinc-500 font-medium">Nome</span>
              <span className="font-semibold text-zinc-900">
                {appointment.requesterName}
              </span>
            </div>

            {appointment.requesterPhone && (
              <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                <span className="text-xs text-zinc-500 font-medium">
                  Telefone / WhatsApp
                </span>
                <span className="font-mono text-zinc-800">
                  {appointment.requesterPhone}
                </span>
              </div>
            )}

            {appointment.patientName && (
              <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                <span className="text-xs text-zinc-500 font-medium">
                  Pessoa a ser visitada
                </span>
                <span className="font-medium text-zinc-800">
                  {appointment.patientName}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Observações Section */}
        <section className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-zinc-900">Observações</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            {appointment.requesterNotes || 'Não há observações.'}
          </p>
        </section>

        {/* Cancellation Reason if cancelled */}
        {appointment.cancellationReason && (
          <section className="bg-red-50/70 rounded-2xl p-4 border border-red-200/80 space-y-1">
            <h3 className="text-xs font-bold text-red-900">
              Motivo do Cancelamento
            </h3>
            <p className="text-xs text-red-800 leading-relaxed">
              {appointment.cancellationReason}
            </p>
          </section>
        )}

        {/* Action Buttons based on status */}
        {isConfirmed && (
          <section className="space-y-3 pt-2">
            {/* Mark as Completed */}
            <Button
              type="button"
              onClick={handleMarkAsCompleted}
              isLoading={isCompleting}
              className="w-full h-12 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs"
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar como Realizado
            </Button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setShowCancelDialog(true)}
              className="w-full h-12 rounded-2xl border border-red-200 bg-white hover:bg-red-50/60 text-red-600 font-semibold text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>✕</span>
              <span>Cancelar atendimento</span>
            </button>
          </section>
        )}

        {isPendingStatus && (
          <section className="space-y-3 pt-2">
            <Button
              type="button"
              onClick={handleConfirmPending}
              isLoading={isUpdatingStatus}
              className="w-full h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-sm"
            >
              <Check className="w-4 h-4 mr-2 text-emerald-400" />
              Confirmar Atendimento
            </Button>

            <button
              type="button"
              onClick={() => setShowCancelDialog(true)}
              className="w-full h-12 rounded-2xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>✕</span>
              <span>Recusar solicitação</span>
            </button>
          </section>
        )}

        {isArchived && (
          <section className="p-4 rounded-2xl bg-zinc-100 text-center text-xs text-zinc-500 font-medium">
            Este atendimento está arquivado como histórico e não pode mais ser
            alterado.
          </section>
        )}
      </div>

      {/* Confirmation Dialog */}
      <CancelAppointmentDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelConfirm}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
}
