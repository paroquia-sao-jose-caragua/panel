'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  Calendar,
  CalendarDays,
  FileText,
  Lock,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
  CalendarPlus,
  Clock,
  User,
  MessageCircle,
  XCircle,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectItem } from '@/components/common/select';
import { Input } from '@/components/ui/input';
import { FieldGroup } from '@/components/ui/field';
import {
  useAppointments,
  usePastoralAgents,
  useAppointmentServices,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import {
  AppointmentWhatsAppDialog,
  type WhatsAppTemplateType,
} from '@/components/features/appointments/appointment-whatsapp-dialog';
import {
  getAgentBlockedDates,
  addAgentBlockedDate,
} from '@/api/appointments/agents';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';

export default function AppointmentsDashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const isPastoralAgent = user?.role === 'pastoral_agent';
  const isStaffSecretaryOrAdmin =
    user?.role === 'admin' || user?.role === 'secretary';

  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents } = usePastoralAgents();
  const { services } = useAppointmentServices();

  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
  const in7DaysStr = useMemo(
    () => dayjs().add(7, 'day').format('YYYY-MM-DD'),
    []
  );

  // Greeting & Date formatting
  const greeting = useMemo(() => {
    const hour = dayjs().hour();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const formattedDate = useMemo(() => {
    const raw = dayjs().locale('pt-br').format('dddd, D [de] MMMM [de] YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, []);

  const userFirstName = useMemo(() => {
    if (!user?.name) return 'Giselle';
    return user.name.split(' ')[0];
  }, [user?.name]);

  // Appointments for today and the next 7 days
  const effectiveAgentId = isPastoralAgent ? myAgent?.id : undefined;

  const { appointments: upcomingAppointments, isPending: isLoadingUpcoming, updateStatus } =
    useAppointments({
      startDate: todayStr,
      endDate: in7DaysStr,
      status: 'confirmed',
      agentId: effectiveAgentId,
    });

  // Pending requests count
  const { appointments: pendingAppointments, isPending: isLoadingPending } =
    useAppointments({
      status: 'pending',
      agentId: effectiveAgentId,
    });

  // Query all active blocks
  const { data: activeBlocks, isPending: isLoadingBlocks } = useQuery({
    queryKey: ['active-blocks-count', agents?.map((a) => a.id).join(',')],
    queryFn: async () => {
      if (!agents || agents.length === 0) return [];
      let total = 0;
      await Promise.all(
        agents.map(async (ag) => {
          try {
            const res = await getAgentBlockedDates(ag.id);
            if (res?.blockedDates) {
              const active = res.blockedDates.filter((b) =>
                dayjs(b.blockedDate).isAfter(dayjs().subtract(1, 'day'))
              );
              total += active.length;
            }
          } catch {
            // ignore
          }
        })
      );
      return total;
    },
    enabled: !!agents && agents.length > 0,
  });

  // Today's appointments
  const todayAppointments = useMemo(() => {
    if (!upcomingAppointments) return [];
    return upcomingAppointments
      .filter((app) => app.appointmentDate === todayStr)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [upcomingAppointments, todayStr]);

  // Next 5 upcoming days
  const nextDays = useMemo(() => {
    return Array.from({ length: 5 }).map((_, index) => {
      const dateObj = dayjs().add(index + 1, 'day').locale('pt-br');
      const dateString = dateObj.format('YYYY-MM-DD');

      const count = (upcomingAppointments || []).filter(
        (app) => app.appointmentDate === dateString
      ).length;

      return {
        date: dateString,
        dayNum: dateObj.format('DD'),
        monthShort: dateObj.format('MMM').replace('.', '').toUpperCase(),
        dayOfWeek: dateObj.format('dddd'),
        count,
      };
    });
  }, [upcomingAppointments]);

  // Category statistics breakdown
  const [categoryTimeRange, setCategoryTimeRange] = useState<'7' | '30' | 'month'>('7');

  const categoryStats = useMemo(() => {
    const list = upcomingAppointments || [];
    const counts: Record<string, number> = {};

    list.forEach((app) => {
      const catName = app.service?.title || 'Geral';
      counts[catName] = (counts[catName] || 0) + 1;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  }, [upcomingAppointments]);

  // WhatsApp Dialog state
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

  // Cancel Appointment state
  const [cancellingAppointment, setCancellingAppointment] =
    useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Quick Block Dialog state
  const [isQuickBlockOpen, setIsQuickBlockOpen] = useState(false);
  const [quickBlockAgentId, setQuickBlockAgentId] = useState('');
  const [quickBlockStartDate, setQuickBlockStartDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );
  const [quickBlockEndDate, setQuickBlockEndDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );
  const [quickBlockReason, setQuickBlockReason] = useState('Férias');
  const [isSubmittingQuickBlock, setIsSubmittingQuickBlock] = useState(false);

  const handleCancelSubmit = async () => {
    if (!cancellingAppointment) return;
    const finalReason =
      cancellationReason.trim() || 'Houve um imprevisto na agenda pastoral';

    setIsCancelling(true);
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

      if (isStaffSecretaryOrAdmin) {
        setWhatsAppDialogState({
          open: true,
          appointment: appointmentCancelled,
          template: 'cancellation',
          cancellationReason: finalReason,
        });
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSaveQuickBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveAgent = isPastoralAgent && myAgent ? myAgent.id : quickBlockAgentId;

    if (!effectiveAgent) {
      showAlert('Selecione um agente pastoral.');
      return;
    }

    const start = dayjs(quickBlockStartDate);
    const end = dayjs(quickBlockEndDate);

    if (end.isBefore(start)) {
      showAlert('A data final não pode ser anterior à data inicial.');
      return;
    }

    setIsSubmittingQuickBlock(true);
    try {
      const diffDays = end.diff(start, 'day');
      const datesToBlock: string[] = [];

      for (let i = 0; i <= diffDays; i++) {
        datesToBlock.push(start.add(i, 'day').format('YYYY-MM-DD'));
      }

      await Promise.all(
        datesToBlock.map((d) =>
          addAgentBlockedDate(effectiveAgent, {
            blockedDate: d,
            reason: quickBlockReason,
          })
        )
      );

      await queryClient.invalidateQueries({ queryKey: ['active-blocks-count'] });
      await queryClient.invalidateQueries({ queryKey: ['all-blocked-dates'] });
      showAlert('Bloqueio adicionado com sucesso!');
      setIsQuickBlockOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar bloqueio';
      showAlert(`Erro ao salvar bloqueio: ${msg}`);
    } finally {
      setIsSubmittingQuickBlock(false);
    }
  };

  return (
    <>
      <AppHeader />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
        {/* Top Greeting Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 font-serif tracking-tight">
              {greeting}, {userFirstName}!
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
              Veja o que precisa de atenção hoje e mantenha a agenda pastoral sempre organizada.
            </p>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 text-xs sm:text-sm font-medium bg-white/80 border border-zinc-200/80 px-3.5 py-2 rounded-xl shadow-2xs self-start shrink-0">
            <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Hoje */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between gap-5 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100/80 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-700" />
              </div>

              <div>
                <h3 className="font-bold text-xl text-zinc-900 font-serif">Hoje</h3>
                <p className="text-sm text-zinc-600 mt-1">
                  <span className="font-semibold text-zinc-900">
                    {todayAppointments.length}
                  </span>{' '}
                  {todayAppointments.length === 1
                    ? 'atendimento confirmado'
                    : 'atendimentos confirmados'}
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.APPOINTMENTS.AGENDA}
              className="text-xs font-semibold text-zinc-700 group-hover:text-[#11291f] flex items-center gap-1.5 transition-colors pt-2 border-t border-zinc-100"
            >
              <span>Ver agenda</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Card 2: Solicitações */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between gap-5 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-100/80 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-700" />
              </div>

              <div>
                <h3 className="font-bold text-xl text-zinc-900 font-serif">Solicitações</h3>
                <p className="text-sm text-zinc-600 mt-1">
                  <span className="font-semibold text-zinc-900">
                    {pendingAppointments?.length || 0}
                  </span>{' '}
                  {(pendingAppointments?.length || 0) === 1
                    ? 'aguardando aprovação'
                    : 'aguardando aprovação'}
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.APPOINTMENTS.LIST}
              className="text-xs font-semibold text-zinc-700 group-hover:text-[#11291f] flex items-center gap-1.5 transition-colors pt-2 border-t border-zinc-100"
            >
              <span>Ver solicitações</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Card 3: Bloqueios */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between gap-5 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 border border-purple-100/80 flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-700" />
              </div>

              <div>
                <h3 className="font-bold text-xl text-zinc-900 font-serif">Bloqueios</h3>
                <p className="text-sm text-zinc-600 mt-1">
                  <span className="font-semibold text-zinc-900">
                    {activeBlocks ?? 0}
                  </span>{' '}
                  {(activeBlocks ?? 0) === 1 ? 'período ativo' : 'períodos ativos'}
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.APPOINTMENTS.BLOCKS}
              className="text-xs font-semibold text-zinc-700 group-hover:text-[#11291f] flex items-center gap-1.5 transition-colors pt-2 border-t border-zinc-100"
            >
              <span>Gerenciar bloqueios</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Atendimentos de hoje + Banner + Categorias */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card: Atendimentos de hoje */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-zinc-700 shrink-0" />
                  <h2 className="text-xl font-bold text-zinc-900 font-serif">
                    Atendimentos de hoje
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-600 text-xs px-2.5 py-0.5 rounded-full font-medium"
                  >
                    {todayAppointments.length}{' '}
                    {todayAppointments.length === 1 ? 'atendimento' : 'atendimentos'}
                  </Badge>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 h-8.5 rounded-xl cursor-pointer self-start sm:self-center shadow-2xs hover:bg-zinc-50"
                >
                  <Link href={ROUTES.APPOINTMENTS.AGENDA}>
                    <span>Ver agenda completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>

              {/* Today's List Content */}
              <div className="divide-y divide-zinc-100">
                {isLoadingUpcoming ? (
                  <div className="p-8 flex items-center justify-center gap-3">
                    <Spinner className="w-5 h-5 text-zinc-600" />
                    <span className="text-xs text-zinc-500">
                      Carregando atendimentos de hoje...
                    </span>
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500/70 mx-auto" />
                    <h4 className="text-sm font-bold text-zinc-800">
                      Nenhum atendimento confirmado para hoje
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      A agenda de hoje está livre de compromissos confirmados. Aproveite para verificar a fila de solicitações.
                    </p>
                  </div>
                ) : (
                  todayAppointments.map((app) => {
                    const agentName = app.agent?.name
                      ? `${app.agent.title ? `${app.agent.title} ` : ''}${app.agent.name}`
                      : 'Agente Pastoral';

                    const serviceTitle = app.service?.title || 'Atendimento Pastoral';

                    return (
                      <div
                        key={app.id}
                        className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-zinc-50/70 transition-colors"
                      >
                        {/* Time */}
                        <div className="font-bold text-sm text-zinc-900 w-14 shrink-0 font-mono">
                          {app.startTime || '08:00'}
                        </div>

                        {/* Service & Agent info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-zinc-900 truncate">
                            {serviceTitle}
                          </h4>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">
                            {agentName}
                            {app.requesterName && (
                              <span className="text-zinc-400">
                                {' '}· {app.requesterName}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Category pill */}
                        <div className="hidden sm:block shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                            {serviceTitle}
                          </span>
                        </div>

                        {/* Status pill */}
                        <div className="shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                            Confirmado
                          </span>
                        </div>

                        {/* Action Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-800 rounded-lg cursor-pointer shrink-0"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl p-1 z-50">
                            <DropdownMenuItem asChild>
                              <Link
                                href={ROUTES.APPOINTMENTS.DETAILS(app.id)}
                                className="cursor-pointer text-xs"
                              >
                                Ver Detalhes
                              </Link>
                            </DropdownMenuItem>
                            {app.requesterPhone && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setWhatsAppDialogState({
                                      open: true,
                                      appointment: app,
                                      template: 'confirmation',
                                    })
                                  }
                                  className="cursor-pointer text-xs flex items-center gap-2 text-emerald-700"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Enviar WhatsApp</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setWhatsAppDialogState({
                                      open: true,
                                      appointment: app,
                                      template: 'reminder',
                                    })
                                  }
                                  className="cursor-pointer text-xs flex items-center gap-2 text-emerald-700"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Enviar Lembrete</span>
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setCancellingAppointment(app);
                                setCancellationReason('');
                              }}
                              className="cursor-pointer text-xs flex items-center gap-2 text-rose-600 focus:text-rose-700"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancelar Atendimento</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Banner: Precisa adicionar um bloqueio? */}
            <div className="bg-[#f3f7f4] border border-emerald-950/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0">
                  <CalendarPlus className="w-6 h-6 text-emerald-800" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-zinc-900">
                    Precisa adicionar um bloqueio?
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-lg leading-relaxed">
                    Bloqueie períodos de datas na agenda dos agentes pastorais, como férias, compromissos externos e outros motivos.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  if (isPastoralAgent && myAgent) {
                    setQuickBlockAgentId(myAgent.id);
                  }
                  setIsQuickBlockOpen(true);
                }}
                className="bg-[#11291f] text-white hover:bg-[#1a3d2e] rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs shrink-0 self-start sm:self-center cursor-pointer gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Novo bloqueio</span>
              </Button>
            </div>

            {/* Card: Atendimentos por categoria */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-zinc-700 shrink-0" />
                  <h3 className="text-lg font-bold text-zinc-900 font-serif">
                    Atendimentos por categoria
                  </h3>
                </div>

                <div className="w-36">
                  <Select
                    name="categoryRange"
                    placeholder="Filtrar período"
                    value={categoryTimeRange}
                    onValueChange={(val) =>
                      setCategoryTimeRange(val as '7' | '30' | 'month')
                    }
                  >
                    <SelectItem value="7" text="Últimos 7 dias" />
                    <SelectItem value="30" text="Últimos 30 dias" />
                    <SelectItem value="month" text="Este mês" />
                  </Select>
                </div>
              </div>

              {categoryStats.length === 0 ? (
                <p className="text-xs text-zinc-500 py-3 text-center">
                  Nenhum atendimento categorizado registrado neste período.
                </p>
              ) : (
                <div className="space-y-3 pt-1">
                  {categoryStats.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-700">
                          {item.name}
                        </span>
                        <span className="font-semibold text-zinc-900">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#18392b] h-full rounded-full transition-all"
                          style={{ width: `${Math.max(item.percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Próximos dias */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                <CalendarDays className="w-5 h-5 text-zinc-700 shrink-0" />
                <h3 className="text-xl font-bold text-zinc-900 font-serif">
                  Próximos dias
                </h3>
              </div>

              <div className="divide-y divide-zinc-100">
                {nextDays.map((day) => (
                  <Link
                    key={day.date}
                    href={`${ROUTES.APPOINTMENTS.AGENDA}?date=${day.date}`}
                    className="py-3.5 flex items-center justify-between group hover:bg-zinc-50 px-2 -mx-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center min-w-10">
                      <span className="text-lg font-bold text-zinc-900 leading-none">
                        {day.dayNum}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                        {day.monthShort}
                      </span>
                    </div>

                    {/* Count */}
                    <div className="flex-1 text-left px-4">
                      <span className="text-xs sm:text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                        {day.count}{' '}
                        {day.count === 1 ? 'atendimento' : 'atendimentos'}
                      </span>
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Block Dialog */}
      <Dialog open={isQuickBlockOpen} onOpenChange={setIsQuickBlockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif text-xl">
              <CalendarPlus className="w-5 h-5 text-emerald-800" />
              <span>Novo Bloqueio de Período</span>
            </DialogTitle>
            <DialogDescription>
              Suspenda a disponibilidade na agenda para férias ou compromissos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveQuickBlock} className="space-y-4 pt-1">
            {!isPastoralAgent && (
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Agente Pastoral *
                </label>
                <Select
                  name="quickAgent"
                  value={quickBlockAgentId}
                  onValueChange={(val) => setQuickBlockAgentId(val)}
                  placeholder="Selecione o padre ou ministro"
                >
                  {(agents || []).map((ag) => (
                    <SelectItem
                      key={ag.id}
                      value={ag.id}
                      text={`${ag.title ? `${ag.title} ` : ''}${ag.name}`}
                    />
                  ))}
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  A partir de *
                </label>
                <Input
                  type="date"
                  value={quickBlockStartDate}
                  onChange={(e) => setQuickBlockStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Até *
                </label>
                <Input
                  type="date"
                  value={quickBlockEndDate}
                  onChange={(e) => setQuickBlockEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Motivo *
              </label>
              <Select
                name="quickReason"
                placeholder="Selecione o motivo"
                value={quickBlockReason}
                onValueChange={(val) => setQuickBlockReason(val)}
              >
                <SelectItem value="Férias" text="Férias" />
                <SelectItem value="Retiro Espiritual" text="Retiro Espiritual" />
                <SelectItem value="Compromisso Externo" text="Compromisso Externo" />
                <SelectItem value="Recesso Paroquial" text="Recesso Paroquial" />
                <SelectItem value="Outro motivo" text="Outro motivo" />
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickBlockOpen(false)}
                disabled={isSubmittingQuickBlock}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#11291f] text-white hover:bg-[#1a3d2e]"
                isLoading={isSubmittingQuickBlock}
                loadingText="Salvando..."
              >
                Bloquear período
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancellation Dialog */}
      <Dialog
        open={!!cancellingAppointment}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setCancellingAppointment(null);
            setCancellationReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Atendimento</DialogTitle>
            <DialogDescription>
              Informe o motivo do cancelamento do atendimento de{' '}
              <strong className="text-zinc-900">
                {cancellingAppointment?.requesterName || 'Fiel'}
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="px-4 pb-2">
            <Input
              name="cancelReason"
              placeholder="Ex: Imprevisto com o sacerdote, recesso paroquial..."
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
              disabled={isCancelling}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleCancelSubmit}
              isLoading={isCancelling}
              loadingText="Cancelando..."
            >
              Confirmar Cancelamento
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
