'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
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
  AlertCircle,
  Check,
  X,
  FileText,
  Lock,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { AppHeader } from '@/components/common/header';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { FieldGroup } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useAppointment,
  useAppointments,
} from '@/api/appointments/use-appointments';
import type { AppointmentStatus } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import { showAlert } from '@/utils/showAlert';
import { isAppointmentExpired } from '@/utils/appointment';

dayjs.locale('pt-br');

export default function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { appointment, isPending, refetch } = useAppointment(id);
  const { updateStatus, isUpdatingStatus } = useAppointments();

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Complete state
  const [isCompleting, setIsCompleting] = useState(false);

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

  const handleCopyTrackingLink = () => {
    if (!appointment) return;
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

  const handleConfirmAppointment = async () => {
    if (!appointment) return;
    try {
      await updateStatus({
        id: appointment.id,
        status: 'confirmed',
      });
      showAlert('Agendamento confirmado com sucesso!');
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
      showAlert('Agendamento marcado como Realizado!');
      refetch();
    } catch {
      // Handled
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!appointment) return;
    const finalReason =
      cancellationReason.trim() || 'Houve um imprevisto na agenda pastoral';

    setIsSubmittingCancel(true);
    try {
      await updateStatus({
        id: appointment.id,
        status: 'cancelled',
        cancellationReason: finalReason,
      });

      showAlert(
        appointment.status === 'pending'
          ? 'Solicitação de atendimento recusada.'
          : 'Agendamento cancelado com sucesso.'
      );

      setIsCancelDialogOpen(false);
      setCancellationReason('');
      refetch();
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const renderStatusBadge = (status: AppointmentStatus) => {
    if (status === 'pending' && isExpired) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-50 text-amber-900 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          Solicitação Expirada
        </span>
      );
    }

    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Confirmado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Aguardando Confirmação
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
            Realizado
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-700 border border-red-200">
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
      <>
        <AppHeader />
        <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-64 rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </main>
      </>
    );
  }

  if (!appointment) {
    return (
      <>
        <AppHeader />
        <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
          <BackButton href={ROUTES.APPOINTMENTS.HOME} />
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto" />
            <h2 className="text-lg font-bold text-zinc-900">
              Agendamento não encontrado
            </h2>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              O agendamento solicitado não foi encontrado ou não está mais disponível no sistema.
            </p>
            <Button asChild variant="outline" className="rounded-xl mt-2">
              <Link href={ROUTES.APPOINTMENTS.HOME}>Voltar à Agenda Pastoral</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  const isConfirmed = appointment.status === 'confirmed';
  const isCommitment = appointment.kind === 'commitment';
  const isPendingStatus = appointment.status === 'pending';
  const isHomeVisit = appointment.service?.category === 'home_visit';

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'agenda-pastoral',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agenda Pastoral',
            icon: CalendarCheck,
          },
          {
            key: 'detalhes',
            href: ROUTES.APPOINTMENTS.DETAILS(id),
            title: isCommitment ? 'Detalhes do Compromisso' : 'Detalhes do Atendimento',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
        {/* Top Navigation & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton href={ROUTES.APPOINTMENTS.HOME} />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <TypographyH1>
                  {isCommitment ? 'Detalhes do Compromisso' : 'Detalhes do Atendimento'}
                </TypographyH1>
                {renderStatusBadge(appointment.status)}
              </div>
              <Describe className="mt-0.5">
                Código identificador: <span className="font-mono text-zinc-800">{appointment.id}</span>
              </Describe>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyTrackingLink}
              className="rounded-xl text-xs sm:text-sm font-semibold shadow-2xs gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
              <span>Copiar link do fiel</span>
            </Button>

            {appointment.requesterPhone && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm font-semibold text-emerald-800 border-emerald-200 hover:bg-emerald-50 shadow-2xs gap-1.5"
              >
                <Link
                  href={ROUTES.APPOINTMENTS.WHATSAPP(
                    appointment.id,
                    isConfirmed ? 'reminder' : 'confirmation'
                  )}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Notificar WhatsApp</span>
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl text-xs sm:text-sm font-semibold shadow-2xs gap-1.5"
            >
              <Link href={ROUTES.APPOINTMENTS.EDIT(appointment.id)}>
                <Pencil className="w-3.5 h-3.5 text-zinc-500" />
                <span>Editar</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Expired Banner Notice if applies */}
        {isExpired && (
          <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start gap-3 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Esta solicitação de atendimento está expirada.</p>
              <p className="text-zinc-600 mt-0.5">
                A data agendada ({formattedDate}) já passou e o pedido não foi confirmado a tempo. Ele foi arquivado para fins de histórico e consulta.
              </p>
            </div>
          </div>
        )}

        {/* Cancellation Notice if applies */}
        {appointment.status === 'cancelled' && (
          <div className="p-4 bg-red-50/70 border border-red-200/90 rounded-2xl text-xs sm:text-sm text-red-900 flex items-start gap-3 shadow-2xs">
            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {isCommitment ? 'Compromisso cancelado.' : 'Atendimento cancelado / recusado.'}
              </p>
              {appointment.cancellationReason && (
                <p className="text-zinc-700 mt-0.5">
                  <span className="font-semibold">Motivo informado:</span> {appointment.cancellationReason}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Informações Principais */}
          <div className="lg:col-span-8 space-y-6">
            {/* Service & Schedule Card */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {isCommitment ? 'Compromisso Pastoral' : 'Serviço Pastoral'}
                    </span>
                    {isHomeVisit && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Home className="w-3 h-3 text-emerald-600" />
                        Visita Domiciliar
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-serif">
                    {isCommitment
                      ? appointment.title || 'Compromisso Pastoral'
                      : appointment.service?.title || 'Atendimento Pastoral'}
                  </h2>
                  {appointment.service?.description && (
                    <p className="text-sm text-zinc-600 font-serif leading-relaxed">
                      {appointment.service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-sm">
                {/* Date & Time */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Data e Horário
                  </span>
                  <div className="flex items-center gap-2 font-semibold text-zinc-900">
                    <Calendar className="w-4 h-4 text-[#B8872E] shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 font-mono pl-6">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>
                      {appointment.startTime}
                      {appointment.endTime ? ` às ${appointment.endTime}` : ''}
                    </span>
                  </div>
                </div>

                {/* Local */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    {isCommitment ? 'Local do Compromisso' : 'Local de Atendimento'}
                  </span>
                  <div className="flex items-start gap-2 font-semibold text-zinc-900">
                    <MapPin className="w-4 h-4 text-[#B8872E] shrink-0 mt-0.5" />
                    <span>
                      {isHomeVisit && appointment.patientAddress
                        ? appointment.patientAddress
                        : appointment.community?.name || 'Comunidade Matriz'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsible Agent */}
              <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <HeartHandshake className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Agente Pastoral Responsável
                  </span>
                  <p className="font-bold text-sm text-zinc-900">
                    {appointment.agent?.title ? `${appointment.agent.title} ` : ''}
                    {appointment.agent?.name || 'Agente Pastoral'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {appointment.agent?.actingRole || 'Pastoral'}
                    {appointment.agent?.phone ? ` • ${appointment.agent.phone}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Information if home visit or present */}
            {(isHomeVisit || appointment.patientName) && (
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <Home className="w-5 h-5 text-emerald-700 shrink-0" />
                  <h3 className="text-lg font-bold text-zinc-900">
                    Dados da Pessoa a ser Visitada
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Nome do Enfermo / Assistido
                    </span>
                    <p className="font-semibold text-zinc-900 mt-0.5">
                      {appointment.patientName || 'Não especificado'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Endereço Completo
                    </span>
                    <p className="font-medium text-zinc-800 mt-0.5">
                      {appointment.patientAddress || 'Não informado'}
                    </p>
                  </div>
                </div>

                {/* Health conditions checklist */}
                {appointment.patientConditions && (
                  <div className="pt-3 border-t border-zinc-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Condições de Saúde
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={appointment.patientConditions.isBedridden ? 'destructive' : 'outline'}
                        className="rounded-lg text-xs"
                      >
                        {appointment.patientConditions.isBedridden
                          ? 'Acamado'
                          : 'Não está acamado'}
                      </Badge>

                      <Badge
                        variant={appointment.patientConditions.canSwallowHost ? 'default' : 'secondary'}
                        className="rounded-lg text-xs"
                      >
                        {appointment.patientConditions.canSwallowHost
                          ? 'Consegue deglutir a hóstia'
                          : 'Dificuldade para deglutir'}
                      </Badge>

                      <Badge
                        variant={appointment.patientConditions.isLucid ? 'outline' : 'secondary'}
                        className="rounded-lg text-xs"
                      >
                        {appointment.patientConditions.isLucid
                          ? 'Consciente / Lúcido'
                          : 'Inconsciente / Não lúcido'}
                      </Badge>
                    </div>

                    {appointment.patientConditions.notes && (
                      <p className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl p-3 mt-2">
                        <strong className="text-zinc-800">Nota sobre o quadro:</strong>{' '}
                        {appointment.patientConditions.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes Section */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-600" />
                <h3 className="text-lg font-bold text-zinc-900">Observações</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Observações do Solicitante
                  </span>
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-700 italic">
                    {appointment.requesterNotes || 'Nenhuma observação informada.'}
                  </div>
                </div>

                {appointment.privatePastoralNotes && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1 mb-1">
                      <Lock className="w-3.5 h-3.5" />
                      Notas Pastorais Confidenciais
                    </span>
                    <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-purple-950 font-serif">
                      {appointment.privatePastoralNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Requester & Workflow Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Requester Details Card */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
                <User className="w-5 h-5 text-zinc-700" />
                <h3 className="font-bold text-base text-zinc-900">
                  Dados do Solicitante
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Nome
                  </span>
                  <p className="font-bold text-zinc-900 mt-0.5">
                    {appointment.requesterName}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Grau de Parentesco / Vínculo
                  </span>
                  <p className="font-medium text-zinc-700 mt-0.5">
                    {appointment.requesterRelationship || 'O próprio fiel'}
                  </p>
                </div>

                {appointment.requesterPhone && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Telefone / WhatsApp
                    </span>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="flex items-center gap-1.5 font-mono text-zinc-800">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{appointment.requesterPhone}</span>
                      </div>
                      <a
                        href={`https://wa.me/55${appointment.requesterPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Abrir WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {appointment.requesterEmail && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
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

            {/* Workflow Action Buttons Box */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3">
              <h4 className="font-bold text-sm text-zinc-900 uppercase tracking-wider text-[11px]">
                Ações do Agendamento
              </h4>

              {isPendingStatus && !isExpired && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleConfirmAppointment}
                    disabled={isUpdatingStatus}
                    className="w-full shadow-xs gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>
                      {isCommitment ? 'Confirmar Compromisso' : 'Confirmar Atendimento'}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="destructive-outlined"
                    size="lg"
                    onClick={() => {
                      setIsCancelDialogOpen(true);
                      setCancellationReason('');
                    }}
                    disabled={isUpdatingStatus}
                    className="w-full gap-2"
                  >
                    <X className="w-4 h-4 text-red-500" />
                    <span>Recusar Solicitação</span>
                  </Button>
                </div>
              )}

              {isConfirmed && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleMarkAsCompleted}
                    disabled={isCompleting}
                    isLoading={isCompleting}
                    loadingText="Concluindo..."
                    className="w-full bg-emerald-800 text-white hover:bg-emerald-700 shadow-xs gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Marcar como Realizado</span>
                  </Button>

                  <Button
                    type="button"
                    variant="destructive-outlined"
                    size="lg"
                    onClick={() => {
                      setIsCancelDialogOpen(true);
                      setCancellationReason('');
                    }}
                    className="w-full gap-2"
                  >
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>
                      {isCommitment ? 'Cancelar Compromisso' : 'Cancelar Atendimento'}
                    </span>
                  </Button>
                </div>
              )}

              {appointment.status === 'completed' && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-center text-xs text-emerald-900 font-medium">
                  Este {isCommitment ? 'compromisso' : 'atendimento'} foi concluído e consta no arquivo como realizado.
                </div>
              )}

              {appointment.status === 'cancelled' && (
                <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 text-center text-xs text-red-900 font-medium">
                  Este {isCommitment ? 'compromisso' : 'atendimento'} foi cancelado e está registrado no arquivo.
                </div>
              )}

              {isExpired && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center text-xs text-amber-900 font-medium">
                  Esta solicitação expirou sem confirmação e foi movida para os arquivos.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Cancellation / Rejection Dialog */}
      <Dialog
        open={isCancelDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsCancelDialogOpen(false);
            setCancellationReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isPendingStatus
                ? 'Recusar Solicitação de Atendimento'
                : isCommitment
                  ? 'Cancelar Compromisso'
                  : 'Cancelar Atendimento'}
            </DialogTitle>
            <DialogDescription>
              {isCommitment ? (
                <>
                  Informe o motivo do cancelamento do compromisso{' '}
                  <strong className="text-zinc-900">
                    {appointment.title || 'Compromisso'}
                  </strong>
                  .
                </>
              ) : (
                <>
                  Informe o motivo do cancelamento do atendimento de{' '}
                  <strong className="text-zinc-900">
                    {appointment.requesterName}
                  </strong>
                  .
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="px-4 pb-2">
            <Input
              name="reason"
              placeholder="Ex: Imprevisto pastoral, horário indisponível..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsCancelDialogOpen(false);
                setCancellationReason('');
              }}
              disabled={isSubmittingCancel}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleCancelSubmit}
              isLoading={isSubmittingCancel}
              loadingText="Confirmando..."
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
