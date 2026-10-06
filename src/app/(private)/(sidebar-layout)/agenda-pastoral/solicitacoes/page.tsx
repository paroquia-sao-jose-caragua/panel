'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  User,
  XCircle,
  Check,
  X,
  HeartHandshake,
  Calendar as CalendarIcon,
  Home,
  Eye,
  Pencil,
  Copy,
  MoreHorizontal,
  Filter,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/common/back-button';
import { Select, SelectItem } from '@/components/common/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FieldGroup } from '@/components/ui/field';
import { showAlert } from '@/utils/showAlert';
import {
  useAppointments,
  usePastoralAgents,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import {
  AppointmentWhatsAppDialog,
  type WhatsAppTemplateType,
} from '@/components/features/appointments/appointment-whatsapp-dialog';

dayjs.locale('pt-br');

export default function AppointmentsRequestsPage() {
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';
  const isStaffSecretaryOrAdmin =
    user?.role === 'admin' || user?.role === 'secretary';

  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents } = usePastoralAgents();

  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cancellation and confirmation states
  const [cancellingAppointment, setCancellingAppointment] =
    useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [processingAppointmentId, setProcessingAppointmentId] = useState<
    string | null
  >(null);

  const [whatsAppDialogState, setWhatsAppDialogState] = useState<{
    open: boolean;
    appointment: Appointment | null;
    template: WhatsAppTemplateType;
    cancellationReason?: string;
  }>({
    open: false,
    appointment: null,
    template: 'confirmation',
  });

  const effectiveAgentId = isPastoralAgent
    ? myAgent?.id
    : selectedAgentId !== 'all'
    ? selectedAgentId
    : undefined;

  // Query ONLY pending appointments
  const { appointments, isPending, updateStatus } = useAppointments({
    status: 'pending',
    agentId: effectiveAgentId,
  });

  // Filter pending requests by search term and sort by date/time
  const pendingRequests = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((app) => {
        if (app.status !== 'pending') return false;

        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchRequester = app.requesterName?.toLowerCase().includes(term);
          const matchPatient = app.patientName?.toLowerCase().includes(term);
          const matchAgent = app.agent?.name?.toLowerCase().includes(term);
          const matchService = app.service?.title?.toLowerCase().includes(term);
          return matchRequester || matchPatient || matchAgent || matchService;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.appointmentDate !== b.appointmentDate) {
          return (a.appointmentDate || '').localeCompare(b.appointmentDate || '');
        }
        return (a.startTime || '').localeCompare(b.startTime || '');
      });
  }, [appointments, searchTerm]);

  // Handle confirming appointment
  const handleConfirm = async (appointment: Appointment) => {
    setProcessingAppointmentId(appointment.id);
    try {
      await updateStatus({
        id: appointment.id,
        status: 'confirmed',
      });

      showAlert('Atendimento confirmado com sucesso!');

      if (isStaffSecretaryOrAdmin) {
        setWhatsAppDialogState({
          open: true,
          appointment: {
            ...appointment,
            status: 'confirmed',
          },
          template: 'confirmation',
        });
      }
    } finally {
      setProcessingAppointmentId(null);
    }
  };

  // Handle cancelling/rejecting appointment
  const handleCancelSubmit = async () => {
    if (!cancellingAppointment) return;
    const finalReason =
      cancellationReason.trim() || 'Houve um imprevisto na agenda pastoral';

    setProcessingAppointmentId(cancellingAppointment.id);
    try {
      await updateStatus({
        id: cancellingAppointment.id,
        status: 'cancelled',
        cancellationReason: finalReason,
      });

      const appointmentCancelled: Appointment = {
        ...cancellingAppointment,
        status: 'cancelled',
        cancellationReason: finalReason,
      };

      setCancellingAppointment(null);
      setCancellationReason('');
      showAlert('Solicitação de atendimento recusada.');

      if (isStaffSecretaryOrAdmin) {
        setWhatsAppDialogState({
          open: true,
          appointment: appointmentCancelled,
          template: 'cancellation',
          cancellationReason: finalReason,
        });
      }
    } finally {
      setProcessingAppointmentId(null);
    }
  };

  const handleCopyTrackingLink = (appointment: Appointment) => {
    const siteBaseUrl =
      process.env.NEXT_PUBLIC_SITE_BASE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    const cleanBaseUrl = (siteBaseUrl || '').replace(/\/$/, '');
    const trackingUrl = `${cleanBaseUrl}/atendimentos/acompanhar?token=${appointment.accessToken}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(trackingUrl);
      showAlert('Link de acompanhamento copiado!');
    }
  };

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
            key: 'solicitacoes',
            href: ROUTES.APPOINTMENTS.LIST,
            title: 'Solicitações',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        <div className="mb-2">
          <BackButton href={ROUTES.APPOINTMENTS.HOME} />
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <TypographyH1>Solicitações de Atendimento</TypographyH1>
              {pendingRequests.length > 0 && (
                <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-semibold rounded-full text-base w-8 h-8 flex items-center justify-center">
                  {pendingRequests.length}
                </Badge>
              )}
            </div>
            <Describe className="mt-1">
              Atendimentos aguardando confirmação da secretaria ou sacerdote para entrarem na agenda oficial.
            </Describe>
          </div>
        </div>

        {/* Filters Bar: Search & Agent Filter */}
         {!isPastoralAgent && agents && agents.length > 0 && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Filtrar por agente:
              </span>
            </div>
            <div className="w-full sm:w-72">
              <Select
                name="agentId"
                placeholder="Todos os agentes pastorais"
                value={selectedAgentId}
                onValueChange={(val) => setSelectedAgentId(val)}
              >
                <SelectItem value="all" text="Todos os agentes pastorais" />
                {(agents || []).map((agent) => (
                  <SelectItem
                    key={agent.id}
                    value={agent.id}
                    text={`${agent.title ? `${agent.title} ` : ''}${agent.name}`}
                  />
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Requests List */}
        <section className="space-y-4">
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
            </div>
          ) : pendingRequests.length === 0 ? (
            /* Empty State */
            <div className="p-10 sm:p-14 text-center bg-white rounded-2xl border border-dashed border-zinc-200/90 space-y-3 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">
                  Tudo em dia!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                  Não há nenhuma solicitação de atendimento pendente de confirmação no momento.
                </p>
              </div>
            </div>
          ) : (
            pendingRequests.map((req) => {
              const d = dayjs(req.appointmentDate).locale('pt-br');
              const shortDay = d.format('ddd').replace('.', '');
              const capShortDay =
                shortDay.charAt(0).toUpperCase() + shortDay.slice(1);
              const shortMonth = d.format('MMM').replace('.', '').toLowerCase();
              const shortDateStr = `${capShortDay}, ${d.format('DD')} ${shortMonth}`;

              const timeRange = req.endTime
                ? `${req.startTime} às ${req.endTime}`
                : req.startTime;
              const isBusy = processingAppointmentId === req.id;
              const isHomeVisit = req.service?.category === 'home_visit';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-4 hover:border-zinc-300 transition-all"
                >
                  {/* Top Bar: Aguardando confirmação badge and Date/Time */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Aguardando confirmação
                      </span>

                      {isHomeVisit && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Home className="w-3 h-3 text-emerald-600" />
                          Visita Domiciliar
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-700">
                      <CalendarIcon className="w-4 h-4 text-[#B8872E]" />
                      <span>{shortDateStr}</span>
                      <span>•</span>
                      <span>{timeRange}</span>
                    </div>
                  </div>

                  {/* Service Title and Full Date */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
                      {req.service?.title || 'Atendimento Pastoral'}
                    </h3>
                    {req.service?.description && (
                      <p className="text-sm text-zinc-500 font-serif line-clamp-1 mt-1">
                        {req.service.description}
                      </p>
                    )}
                  </div>

                  {/* 3 Columns: Solicitante, Agente Responsável, and Local de Atendimento in light gray background with padding (no borders) */}
                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* SOLICITANTE */}
                      <div className="space-y-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                          Solicitante
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 truncate">
                          {req.requesterName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {req.requesterRelationship || 'O próprio fiel'}
                        </p>
                        {req.requesterPhone && (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-mono pt-0.5">
                            <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{req.requesterPhone}</span>
                          </div>
                        )}
                        {req.patientName &&
                          req.patientName !== req.requesterName && (
                            <div className="text-[11px] text-zinc-500 pt-0.5">
                              <span>Enfermo: </span>
                              <strong className="text-zinc-800">
                                {req.patientName}
                              </strong>
                              {req.patientConditions?.isBedridden && (
                                <Badge
                                  variant="outline"
                                  className="ml-1 text-[9px] py-0 px-1 border-rose-200 text-rose-700 bg-rose-50"
                                >
                                  Acamado
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>

                      {/* AGENTE RESPONSÁVEL */}
                      <div className="space-y-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                          Agente Responsável
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 truncate">
                          {req.agent?.title ? `${req.agent.title} ` : ''}
                          {req.agent?.name || 'Agente Pastoral'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {req.agent?.actingRole || 'Pastoral'}
                        </p>
                      </div>

                      {/* LOCAL DE ATENDIMENTO */}
                      <div className="space-y-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                          Local de Atendimento
                        </span>
                        <div className="flex items-start gap-1.5 text-sm font-semibold text-zinc-800 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span className="truncate">
                            {isHomeVisit && req.patientAddress
                              ? req.patientAddress
                              : req.community?.name || 'Comunidade Matriz'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {req.requesterNotes && (
                      <div className="text-xs text-zinc-600 bg-white/80 border border-zinc-200/60 rounded-xl p-2.5 flex items-start gap-2 mt-2">
                        <span className="font-semibold text-amber-900 shrink-0">
                          Observação:
                        </span>
                        <span className="italic">{req.requesterNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Row: Recusar and Confirmar on the left, three dots on the far right */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => {
                          setCancellingAppointment(req);
                          setCancellationReason('');
                        }}
                        className="h-10 px-4 text-xs font-semibold rounded-xl border-zinc-300 text-zinc-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 cursor-pointer shadow-2xs"
                      >
                        <X className="w-3.5 h-3.5 mr-1 text-red-500" />
                        <span>Recusar</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isBusy}
                        isLoading={isBusy}
                        loadingText="Confirmando..."
                        onClick={() => handleConfirm(req)}
                        className="h-10 px-4 text-xs font-semibold rounded-xl bg-[#11291f] text-white hover:bg-[#1a3d2e] cursor-pointer shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        <span>Confirmar atendimento</span>
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          className="hidden sm:flex h-8 w-8 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg cursor-pointer shrink-0"
                          aria-label="Mais opções"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 shadow-lg">
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.APPOINTMENTS.EDIT(req.id)}
                            className="cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 mr-2 text-zinc-500" />
                            <span>Editar</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyTrackingLink(req)}
                          className="cursor-pointer"
                        >
                          <Copy className="w-4 h-4 mr-2 text-zinc-500" />
                          <span>Copiar link do fiel</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {/* Cancellation / Rejection Dialog */}
      <Dialog
        open={Boolean(cancellingAppointment)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setCancellingAppointment(null);
            setCancellationReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recusar Solicitação de Atendimento</DialogTitle>
            <DialogDescription>
              Informe o motivo da recusa do atendimento de{' '}
              <strong className="text-zinc-900">
                {cancellingAppointment?.requesterName || 'Fiel'}
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="px-4 pb-2">
            <Input
              name="reason"
              placeholder="Ex: Horário indisponível, sacerdote em compromisso..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setCancellingAppointment(null);
                setCancellationReason('');
              }}
              disabled={Boolean(processingAppointmentId)}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleCancelSubmit}
              isLoading={Boolean(processingAppointmentId)}
              loadingText="Recusando..."
            >
              Confirmar Recusa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Dialog */}
      <AppointmentWhatsAppDialog
        open={whatsAppDialogState.open}
        onOpenChange={(open) =>
          setWhatsAppDialogState((prev) => ({ ...prev, open }))
        }
        appointment={whatsAppDialogState.appointment}
        initialTemplate={whatsAppDialogState.template}
        cancellationReason={whatsAppDialogState.cancellationReason}
      />
    </>
  );
}
