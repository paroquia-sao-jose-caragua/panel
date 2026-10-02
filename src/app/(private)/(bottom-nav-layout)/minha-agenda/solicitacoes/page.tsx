'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Clock,
  User,
  MapPin,
  Calendar,
  Check,
  X,
  Phone,
  FileText,
  AlertCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useAppointments } from '@/api/appointments/use-appointments';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { CancelAppointmentDialog } from '@/components/features/minha-agenda/cancel-appointment-dialog';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { showAlert } from '@/utils/showAlert';
import type { Appointment } from '@/entities/appointment';

export default function MinhaAgendaRequestsPage() {
  const { appointments, isPending, updateStatus } = useAppointments();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [cancellingAppointment, setCancellingAppointment] =
    useState<Appointment | null>(null);

  // Filter ONLY pending appointments
  const pendingRequests = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((app) => app.status === 'pending')
      .sort((a, b) => {
        if (a.appointmentDate !== b.appointmentDate) {
          return a.appointmentDate.localeCompare(b.appointmentDate);
        }
        return a.startTime.localeCompare(b.startTime);
      });
  }, [appointments]);

  const handleConfirm = async (appointment: Appointment) => {
    try {
      setProcessingId(appointment.id);
      await updateStatus({
        id: appointment.id,
        status: 'confirmed',
      });
      showAlert('Atendimento confirmado com sucesso!');
    } catch {
      // Error handled in hook
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmCancel = async (reason?: string) => {
    if (!cancellingAppointment) return;
    try {
      setProcessingId(cancellingAppointment.id);
      await updateStatus({
        id: cancellingAppointment.id,
        status: 'cancelled',
        cancellationReason: reason,
      });
      setCancellingAppointment(null);
      showAlert('Solicitação recusada.');
    } catch {
      // Handled in hook
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader title="Solicitações" />

      <div className="px-4 pt-4 pb-8 space-y-5">
        {/* Intro */}
        <section className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-serif">
              Solicitações de Atendimento
            </h2>
            {pendingRequests.length > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                {pendingRequests.length}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Atendimentos aguardando a sua confirmação para entrarem na sua agenda ativa.
          </p>
        </section>

        {/* Requests List */}
        <section className="space-y-4">
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-zinc-200 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-800">
                Tudo em dia!
              </p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Não há nenhuma solicitação de atendimento pendente de confirmação no
                momento.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => {
              const d = dayjs(req.appointmentDate).locale('pt-br');
              const dateFormatted = d.format('dddd, DD [de] MMMM');
              const capDate =
                dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
              const isBusy = processingId === req.id;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-3.5"
                >
                  {/* Header Badge & Date */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      Aguardando confirmação
                    </span>

                    <span className="text-xs font-bold text-zinc-800">
                      {req.startTime} às {req.endTime}
                    </span>
                  </div>

                  {/* Service & Date info */}
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 leading-snug">
                      {req.service?.title || 'Atendimento Pastoral'}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-600 mt-0.5">
                      {capDate}
                    </p>
                  </div>

                  {/* Requester Details */}
                  <div className="bg-zinc-50 rounded-xl p-3 space-y-1.5 text-xs text-zinc-700 border border-zinc-100">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-semibold text-zinc-900">
                        {req.requesterName}
                      </span>
                    </div>

                    {req.requesterPhone && (
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{req.requesterPhone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-zinc-600">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">
                        {req.community?.name ||
                          req.patientAddress ||
                          'Comunidade Matriz'}
                      </span>
                    </div>

                    {req.requesterNotes && (
                      <div className="pt-1.5 border-t border-zinc-200/60 text-zinc-600 italic">
                        &quot;{req.requesterNotes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isBusy}
                      onClick={() => setCancellingAppointment(req)}
                      className="w-full h-10 text-xs font-semibold rounded-xl border-zinc-300 text-zinc-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    >
                      <X className="w-4 h-4 mr-1 text-red-500" />
                      Recusar
                    </Button>

                    <Button
                      type="button"
                      disabled={isBusy}
                      isLoading={isBusy}
                      onClick={() => handleConfirm(req)}
                      className="w-full h-10 text-xs font-semibold rounded-xl bg-brand-900 text-white hover:bg-brand-800"
                    >
                      <Check className="w-4 h-4 mr-1 text-emerald-400" />
                      Confirmar
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>

      {/* Cancel/Refuse Confirmation Modal */}
      <CancelAppointmentDialog
        open={Boolean(cancellingAppointment)}
        onOpenChange={(open) => !open && setCancellingAppointment(null)}
        onConfirm={handleConfirmCancel}
        isLoading={Boolean(processingId)}
      />
    </div>
  );
}
