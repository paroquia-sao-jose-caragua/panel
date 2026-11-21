'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Home,
  HeartHandshake,
  Phone,
  Mail,
  Copy,
  Pencil,
  MessageCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Appointment, AppointmentStatus } from '@/entities/appointment';
import { showAlert } from '@/utils/showAlert';
import { isAppointmentExpired } from '@/utils/appointment';

dayjs.locale('pt-br');

export interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  editHref?: string;
  onOpenWhatsApp?: (appointment: Appointment) => void;
}

export const AppointmentDetailsDialog = ({
  open,
  onOpenChange,
  appointment,
  editHref,
  onOpenWhatsApp,
}: AppointmentDetailsDialogProps) => {
  const formattedDate = useMemo(() => {
    if (!appointment?.appointmentDate) return '';
    const d = dayjs(appointment.appointmentDate).locale('pt-br');
    const raw = d.format('dddd, D [de] MMMM [de] YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [appointment?.appointmentDate]);

  const isExpired = useMemo(() => {
    if (!appointment) return false;
    return appointment.status === 'pending' && isAppointmentExpired(appointment);
  }, [appointment]);

  if (!appointment) return null;

  const handleCopyTrackingLink = () => {
    const siteBaseUrl =
      process.env.NEXT_PUBLIC_SITE_BASE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    const cleanBaseUrl = (siteBaseUrl || '').replace(/\/$/, '');
    const trackingUrl = `${cleanBaseUrl}/agendamentos/acompanhar?token=${appointment.accessToken}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(trackingUrl);
      showAlert('Link de acompanhamento copiado!');
    }
  };

  const renderStatusBadge = (status: AppointmentStatus) => {
    if (status === 'pending' && isExpired) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          Solicitação Expirada
        </span>
      );
    }

    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Confirmado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Aguardando Confirmação
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

  const isHomeVisit = appointment.service?.category === 'home_visit';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl gap-0">
        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-zinc-100 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-xl sm:text-2xl font-bold font-serif text-zinc-900">
                Detalhes do Atendimento
              </DialogTitle>
              {renderStatusBadge(appointment.status)}
            </div>
          </div>
          <DialogDescription className="text-xs text-zinc-500 font-mono">
            Código: {appointment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Expired Banner Notice if applies */}
          {isExpired && (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Esta solicitação expirou.</p>
                <p className="text-zinc-600 mt-0.5">
                  A data prevista ({formattedDate}) já passou e o pedido não foi confirmado a tempo.
                </p>
              </div>
            </div>
          )}

          {/* Cancellation Notice if applies */}
          {appointment.status === 'cancelled' && (
            <div className="p-3.5 bg-red-50/80 border border-red-200/90 rounded-2xl text-xs text-red-900 flex items-start gap-2.5 shadow-2xs">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Atendimento cancelado / recusado.</p>
                {appointment.cancellationReason && (
                  <p className="text-zinc-700 mt-0.5">
                    <span className="font-semibold">Motivo:</span> {appointment.cancellationReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Service & Schedule Section */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Serviço Pastoral
                </span>
                {isHomeVisit && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Home className="w-3 h-3 text-emerald-600" />
                    Visita Domiciliar
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-serif">
                {appointment.service?.title || 'Atendimento Pastoral'}
              </h3>
              {appointment.service?.description && (
                <p className="text-xs text-zinc-600 font-serif mt-0.5 leading-relaxed">
                  {appointment.service.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-200/60 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Data e Horário
                </span>
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                  <Calendar className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-600 font-mono pl-5">
                  <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>
                    {appointment.startTime}
                    {appointment.endTime ? ` às ${appointment.endTime}` : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Local
                </span>
                <div className="flex items-start gap-1.5 font-semibold text-zinc-900">
                  <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0 mt-0.5" />
                  <span>
                    {isHomeVisit && appointment.patientAddress
                      ? appointment.patientAddress
                      : appointment.community?.name || 'Comunidade Matriz'}
                  </span>
                </div>
              </div>
            </div>

            {/* Agent info */}
            <div className="pt-3 border-t border-zinc-200/60 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                <HeartHandshake className="w-4 h-4 text-emerald-800" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Agente Responsável
                </span>
                <p className="font-bold text-zinc-900">
                  {appointment.agent?.title ? `${appointment.agent.title} ` : ''}
                  {appointment.agent?.name || 'Agente Pastoral'}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {appointment.agent?.actingRole || 'Pastoral'}
                  {appointment.agent?.phone ? ` • ${appointment.agent.phone}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
              <User className="w-4 h-4 text-zinc-600" />
              <h4 className="text-sm font-bold text-zinc-900">
                Dados do Solicitante
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Nome
                </span>
                <p className="font-semibold text-zinc-900 mt-0.5">
                  {appointment.requesterName}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Vínculo / Parentesco
                </span>
                <p className="font-medium text-zinc-700 mt-0.5">
                  {appointment.requesterRelationship || 'O próprio fiel'}
                </p>
              </div>

              {appointment.requesterPhone && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    WhatsApp / Telefone
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-zinc-800 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{appointment.requesterPhone}</span>
                  </div>
                </div>
              )}

              {appointment.requesterEmail && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    E-mail
                  </span>
                  <div className="flex items-center gap-1.5 text-zinc-700 mt-0.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{appointment.requesterEmail}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Patient info if home visit or exists */}
          {(isHomeVisit || appointment.patientName) && (
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <Home className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-bold text-zinc-900">
                  Pessoa a ser Visitada
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Nome do Enfermo
                  </span>
                  <p className="font-semibold text-zinc-900 mt-0.5">
                    {appointment.patientName || 'Não especificado'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Endereço
                  </span>
                  <p className="font-medium text-zinc-800 mt-0.5">
                    {appointment.patientAddress || 'Não informado'}
                  </p>
                </div>
              </div>

              {appointment.patientConditions && (
                <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Condições Clínicas
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant={appointment.patientConditions.isBedridden ? 'destructive' : 'outline'}
                      className="rounded-lg text-[10px]"
                    >
                      {appointment.patientConditions.isBedridden ? 'Acamado' : 'Não acamado'}
                    </Badge>
                    <Badge
                      variant={appointment.patientConditions.canSwallowHost ? 'default' : 'secondary'}
                      className="rounded-lg text-[10px]"
                    >
                      {appointment.patientConditions.canSwallowHost
                        ? 'Consegue deglutir'
                        : 'Dificuldade para deglutir'}
                    </Badge>
                    <Badge
                      variant={appointment.patientConditions.isLucid ? 'outline' : 'secondary'}
                      className="rounded-lg text-[10px]"
                    >
                      {appointment.patientConditions.isLucid ? 'Lúcido' : 'Não lúcido'}
                    </Badge>
                  </div>
                  {appointment.patientConditions.notes && (
                    <p className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl p-2.5 mt-1.5">
                      <strong className="text-zinc-800">Nota:</strong> {appointment.patientConditions.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
              <FileText className="w-4 h-4 text-zinc-600" />
              <h4 className="text-sm font-bold text-zinc-900">Observações</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Nota do Solicitante
                </span>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-700 italic">
                  {appointment.requesterNotes || 'Nenhuma observação informada.'}
                </div>
              </div>

              {appointment.privatePastoralNotes && (
                <div className="pt-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1 mb-1">
                    <Lock className="w-3 h-3" />
                    Notas Pastorais Confidenciais
                  </span>
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-purple-950 font-serif">
                    {appointment.privatePastoralNotes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyTrackingLink}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
              <span>Copiar link</span>
            </Button>

            {appointment.requesterPhone && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onOpenWhatsApp) {
                    onOpenWhatsApp(appointment);
                  } else {
                    window.open(
                      `https://wa.me/55${appointment.requesterPhone.replace(/\D/g, '')}`,
                      '_blank'
                    );
                  }
                }}
                className="rounded-xl text-xs font-semibold text-emerald-800 border-emerald-200 hover:bg-emerald-50 gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            {editHref && (
              <Button asChild size="sm" className="rounded-xl text-xs font-semibold bg-[#11291f] text-white hover:bg-[#1a3d2e] gap-1.5">
                <Link href={editHref} onClick={() => onOpenChange(false)}>
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar atendimento</span>
                </Link>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs font-semibold"
            >
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
