'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Archive,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  MapPin,
  HeartHandshake,
  Search,
  Eye,
  MoreHorizontal,
  Copy,
  RotateCcw,
  Phone,
  Home,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/common/dialog/confirm-dialog';
import { showAlert } from '@/utils/showAlert';
import {
  useAppointments,
  usePastoralAgents,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

dayjs.locale('pt-br');

type ArchiveFilterType = 'all' | 'completed' | 'cancelled';

export default function AppointmentsArchivePage() {
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';

  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents } = usePastoralAgents();

  const [statusFilter, setStatusFilter] = useState<ArchiveFilterType>('all');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [revertingAppointment, setRevertingAppointment] =
    useState<Appointment | null>(null);
  const [isReverting, setIsReverting] = useState(false);

  const effectiveAgentId = isPastoralAgent
    ? myAgent?.id
    : selectedAgentId !== 'all'
    ? selectedAgentId
    : undefined;

  // Query appointments
  const { appointments, isPending, updateStatus } = useAppointments({
    agentId: effectiveAgentId,
  });

  // Filter ONLY completed and cancelled appointments
  const archivedAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((app) => {
        const isArchived =
          app.status === 'completed' || app.status === 'cancelled';
        if (!isArchived) return false;

        if (statusFilter === 'completed' && app.status !== 'completed') {
          return false;
        }
        if (statusFilter === 'cancelled' && app.status !== 'cancelled') {
          return false;
        }

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
        // Most recent first
        if (a.appointmentDate !== b.appointmentDate) {
          return (b.appointmentDate || '').localeCompare(a.appointmentDate || '');
        }
        return (b.startTime || '').localeCompare(a.startTime || '');
      });
  }, [appointments, statusFilter, searchTerm]);

  // Counts
  const counts = useMemo(() => {
    let completed = 0;
    let cancelled = 0;
    (appointments || []).forEach((app) => {
      if (app.status === 'completed') completed++;
      if (app.status === 'cancelled') cancelled++;
    });
    return {
      all: completed + cancelled,
      completed,
      cancelled,
    };
  }, [appointments]);

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

  const handleRevertCancel = async () => {
    if (!revertingAppointment) return;
    setIsReverting(true);
    try {
      await updateStatus({
        id: revertingAppointment.id,
        status: 'confirmed',
        cancellationReason: null,
      });
      showAlert('Atendimento restaurado para confirmado!');
      setRevertingAppointment(null);
    } finally {
      setIsReverting(false);
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
            key: 'arquivos',
            href: ROUTES.APPOINTMENTS.ARCHIVE,
            title: 'Arquivos',
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
            <TypographyH1>Arquivo de Atendimentos</TypographyH1>
            <Describe className="mt-1">
              Histórico completo de atendimentos realizados e cancelados para consulta e auditoria.
            </Describe>
          </div>
        </div>

        {/* Top Filters: Status Chips, Search & Agent */}
        <div className="space-y-4 mb-6">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none inline-flex items-center gap-1.5 shadow-2xs',
                statusFilter === 'all'
                  ? 'bg-[#11291f] text-white shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              )}
            >
              <span>Todos</span>
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded-full font-bold',
                  statusFilter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-zinc-100 text-zinc-600'
                )}
              >
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none inline-flex items-center gap-1.5 shadow-2xs',
                statusFilter === 'completed'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Realizados</span>
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded-full font-bold',
                  statusFilter === 'completed'
                    ? 'bg-white/20 text-white'
                    : 'bg-zinc-100 text-zinc-600'
                )}
              >
                {counts.completed}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('cancelled')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none inline-flex items-center gap-1.5 shadow-2xs',
                statusFilter === 'cancelled'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              )}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancelados</span>
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded-full font-bold',
                  statusFilter === 'cancelled'
                    ? 'bg-white/20 text-white'
                    : 'bg-zinc-100 text-zinc-600'
                )}
              >
                {counts.cancelled}
              </span>
            </button>
          </div>

          {/* Search & Agent Filter Bar */}
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
        </div>

        {/* Archived Items List */}
        <section className="space-y-3">
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          ) : archivedAppointments.length === 0 ? (
            /* Empty State */
            <div className="p-10 sm:p-14 text-center bg-white rounded-2xl border border-dashed border-zinc-200/90 space-y-3 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <Archive className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">
                  Nenhum registro encontrado
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                  Não há atendimentos no arquivo com os filtros selecionados.
                </p>
              </div>
            </div>
          ) : (
            archivedAppointments.map((app) => {
              const d = dayjs(app.appointmentDate).locale('pt-br');
              const dayStr = d.format('DD');
              const monthStr = d.format('MMM').toUpperCase();
              const fullDateStr = d.format('dddd, D [de] MMMM [de] YYYY');
              const isCompleted = app.status === 'completed';
              const isHomeVisit = app.service?.category === 'home_visit';

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 p-4 sm:p-5 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Date Block & Time */}
                    <div className="flex items-center gap-3.5 shrink-0 sm:min-w-[150px]">
                      {/* Date Badge */}
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/80 flex flex-col items-center justify-center shrink-0">
                        <span className="text-sm font-black text-zinc-800 leading-none">
                          {dayStr}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider mt-0.5">
                          {monthStr}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 font-mono">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{app.startTime}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 capitalize truncate max-w-32">
                          {d.format('dddd')}
                        </span>
                      </div>
                    </div>

                    {/* Center: Service, Requester, Agent, Status */}
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:items-center">
                      {/* Service Title (md:col-span-5) */}
                      <div className="md:col-span-5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={ROUTES.APPOINTMENTS.DETAILS(app.id)}
                            className="text-base font-bold text-zinc-900 tracking-tight truncate hover:text-[#11291f] hover:underline"
                          >
                            {app.service?.title || 'Atendimento Pastoral'}
                          </Link>
                          {isHomeVisit && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                              <Home className="w-3 h-3 text-emerald-600" />
                              <span>Visita</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 block truncate mt-0.5">
                          {fullDateStr}
                        </span>
                      </div>

                      {/* Requester & Community (md:col-span-4) */}
                      <div className="md:col-span-4 min-w-0 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-800 truncate">
                          <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="font-semibold text-zinc-900 truncate">
                            {app.requesterName}
                          </span>
                          {app.requesterRelationship && (
                            <span className="text-zinc-400 text-[11px]">
                              ({app.requesterRelationship})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-zinc-500 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                          <span className="truncate">
                            {isHomeVisit && app.patientAddress
                              ? app.patientAddress
                              : (app.community?.name || 'Comunidade Matriz')}
                          </span>
                        </div>
                      </div>

                      {/* Agent & Status Tag (md:col-span-3) */}
                      <div className="md:col-span-3 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-700 truncate">
                          <HeartHandshake className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                          <span className="font-medium text-zinc-900 truncate">
                            {app.agent?.title ? `${app.agent.title} ` : ''}
                            {app.agent?.name || 'Agente Pastoral'}
                          </span>
                        </div>

                        <div>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Realizado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                              <XCircle className="w-3.5 h-3.5" />
                              Cancelado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions menu ⋯ */}
                    <div className="flex items-center justify-end sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg cursor-pointer"
                            aria-label="Ações do atendimento"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 shadow-lg">
                          <DropdownMenuItem asChild>
                            <Link
                              href={ROUTES.APPOINTMENTS.DETAILS(app.id)}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2 text-zinc-500" />
                              <span>Ver detalhes</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyTrackingLink(app)}
                            className="cursor-pointer"
                          >
                            <Copy className="w-4 h-4 mr-2 text-zinc-500" />
                            <span>Copiar link do fiel</span>
                          </DropdownMenuItem>
                          {!isCompleted && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setRevertingAppointment(app)}
                                className="cursor-pointer text-brand-800 focus:text-brand-900"
                              >
                                <RotateCcw className="w-4 h-4 mr-2 text-brand-700" />
                                <span>Restaurar agendamento</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Cancellation Reason note if present */}
                  {!isCompleted && app.cancellationReason && (
                    <div className="w-full pt-2 border-t border-zinc-100 text-xs text-red-900 bg-red-50/50 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5">
                      <span className="font-semibold shrink-0">Motivo do cancelamento:</span>
                      <span className="text-zinc-600">{app.cancellationReason}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>

      {/* Confirmation Dialog to Revert Cancellation */}
      <ConfirmDialog
        open={Boolean(revertingAppointment)}
        onOpenChange={(open) => !open && setRevertingAppointment(null)}
        title="Restaurar Atendimento"
        description={`Deseja reverter o cancelamento e confirmar novamente o atendimento de "${revertingAppointment?.requesterName}"?`}
        confirmText="Sim, Restaurar"
        cancelText="Voltar"
        isPending={isReverting}
        onConfirm={handleRevertCancel}
      />
    </>
  );
}
