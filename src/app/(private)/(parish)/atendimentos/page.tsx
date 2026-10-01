'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Settings2,
  X,
  MessageCircle,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Select, SelectItem } from '@/components/common/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppointments, usePastoralAgents, useMyPastoralAgent } from '@/api/appointments/use-appointments';
import { AppointmentCalendarItem } from '@/components/features/appointments/appointment-calendar-item';
import {
  AppointmentWhatsAppDialog,
  type WhatsAppTemplateType,
} from '@/components/features/appointments/appointment-whatsapp-dialog';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import useTranslator from '@/hooks/use-translator';

type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export default function AppointmentsAgendaPage() {
  const { t } = useTranslator();
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';
  const isStaffSecretaryOrAdmin = user?.role === 'admin' || user?.role === 'secretary';

  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents, isPending: isLoadingAgents } = usePastoralAgents();

  const [currentYear, setCurrentYear] = useState<number>(dayjs().get('year'));
  const [currentMonth, setCurrentMonth] = useState<MonthNumber>(
    (dayjs().get('month') + 1) as MonthNumber
  );

  const [filters, setFilters] = useState<{ agentId?: string }>({});
  const [openFilter, setOpenFilter] = useState(false);
  const [tempAgentId, setTempAgentId] = useState<string>('all');

  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [processingAppointmentId, setProcessingAppointmentId] = useState<string | null>(null);

  const [whatsAppDialogState, setWhatsAppDialogState] = useState<{
    open: boolean;
    appointment: Appointment | null;
    template: WhatsAppTemplateType;
    cancellationReason?: string;
  }>({
    open: false,
    appointment: null,
    template: 'cancellation',
  });

  // Calculate start and end date for the selected month
  const startDateStr = useMemo(() => {
    return dayjs(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`).format('YYYY-MM-DD');
  }, [currentYear, currentMonth]);

  const daysInMonth = useMemo(() => {
    return dayjs(startDateStr).daysInMonth();
  }, [startDateStr]);

  const endDateStr = useMemo(() => {
    return dayjs(`${currentYear}-${String(currentMonth).padStart(2, '0')}-${daysInMonth}`).format('YYYY-MM-DD');
  }, [currentYear, currentMonth, daysInMonth]);

  // Appointments query
  const effectiveAgentId = isPastoralAgent ? myAgent?.id : filters.agentId;

  const {
    appointments,
    isPending,
    updateStatus,
    isUpdatingStatus,
  } = useAppointments({
    startDate: startDateStr,
    endDate: endDateStr,
    status: 'confirmed',
    agentId: effectiveAgentId,
  });

  // Build the 5-month selector bar
  const months = useMemo(() => {
    const start = dayjs().get('month');
    return Array.from({ length: 5 }).map((_, index) => ((start + index) % 12) + 1) as MonthNumber[];
  }, []);

  const { disabledNextMonth, disabledPrevMonth, prevMonth, nextMonth } = useMemo(() => {
    const disabledPrevMonth =
      isPending || months.length === 0 || currentMonth === months[0];

    const disabledNextMonth =
      isPending ||
      months.length === 0 ||
      currentMonth === months[months.length - 1];

    const prevMonth = currentMonth === 1 ? 12 : ((currentMonth - 1) as MonthNumber);
    const nextMonth = currentMonth === 12 ? 1 : ((currentMonth + 1) as MonthNumber);

    return { disabledPrevMonth, disabledNextMonth, prevMonth, nextMonth };
  }, [currentMonth, isPending, months]);

  const handleChangeMonth = (monthVal: string) => {
    const nextM = Number.parseInt(monthVal) as MonthNumber;
    setCurrentMonth(nextM);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((prev) => (prev - 1) as MonthNumber);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((prev) => (prev + 1) as MonthNumber);
    }
  };

  const handleApplyFilter = () => {
    if (tempAgentId === 'all') {
      setFilters({});
    } else {
      setFilters({ agentId: tempAgentId });
    }
    setOpenFilter(false);
  };

  const handleClearFilter = () => {
    setFilters({});
    setTempAgentId('all');
    setOpenFilter(false);
  };

  // Build all days of the month with their confirmed appointments
  const daysList = useMemo(() => {
    const confirmedOnly = (appointments || []).filter(
      (app) => app.status === 'confirmed'
    );

    return Array.from({ length: daysInMonth }).map((_, index) => {
      const dayNum = index + 1;
      const dateStr = dayjs(new Date(currentYear, currentMonth - 1, dayNum)).format('YYYY-MM-DD');
      const dateObj = dayjs(dateStr).locale('pt-br');
      const dayOfWeek = dateObj.day(); // 0: Dom, 1: Seg, ...

      const dayAppointments = confirmedOnly
        .filter((app) => app.appointmentDate === dateStr)
        .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

      return {
        date: dateStr,
        dayNumber: String(dayNum).padStart(2, '0'),
        dayOfWeek,
        shortDay: dateObj.format('ddd'),
        fullDate: dateObj.format('D [de] MMMM'),
        appointments: dayAppointments,
      };
    });
  }, [appointments, currentYear, currentMonth, daysInMonth]);


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

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'agenda',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Atendimentos',
            icon: CalendarCheck,
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <TypographyH1>Agenda de Atendimentos</TypographyH1>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtros: Visível para secretária ou administrador */}
            {isStaffSecretaryOrAdmin && (
              <Dialog open={openFilter} onOpenChange={setOpenFilter}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs cursor-pointer shadow-2xs">
                    <Filter className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Filtros</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Filtrar por Agente Pastoral</DialogTitle>
                    <DialogDescription>
                      Selecione um padre ou ministro para visualizar exclusivamente sua pauta de atendimentos.
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup className="px-4 pb-4 gap-2">
                    <Select
                      name="agentId"
                      placeholder="Todos os agentes pastorais"
                      value={tempAgentId}
                      onValueChange={(val) => setTempAgentId(val)}
                    >
                      <SelectItem value="all" text="Todos os agentes pastorais" />
                      {isLoadingAgents && (
                        <SelectItem value="loading" text="Carregando agentes..." disabled />
                      )}
                      {!isLoadingAgents &&
                        (agents || []).map((agent) => (
                          <SelectItem
                            key={agent.id}
                            value={agent.id}
                            text={`${agent.title ? `${agent.title} ` : ''}${agent.name}`}
                          />
                        ))}
                    </Select>
                  </FieldGroup>

                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={handleClearFilter}>
                      Limpar Filtros
                    </Button>
                    <Button type="button" onClick={handleApplyFilter} disabled={isPending}>
                      Aplicar Filtro
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Botão Gerenciar (Leva para o Hub com os cards) */}
            <Button asChild variant="outline" size="sm" className="gap-1.5 h-9 text-xs cursor-pointer shadow-2xs">
              <Link href={ROUTES.APPOINTMENTS.MANAGE}>
                <Settings2 className="w-3.5 h-3.5 text-zinc-600" />
                <span>Gerenciar</span>
              </Link>
            </Button>

            {/* Botão Adicionar Atendimento */}
            <Button asChild size="sm" className="gap-1.5 h-9 text-xs cursor-pointer shadow-2xs">
              <Link href={ROUTES.APPOINTMENTS.ADD}>
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Atendimento</span>
              </Link>
            </Button>
          </div>
        </div>

        <Describe className="mb-6">
          Acompanhe a agenda pastoral dos atendimentos confirmados distribuídos por dia e horário, consulte informações do fiel e registre novos compromissos.
        </Describe>

        {/* Tag de Filtro Ativo */}
        {filters.agentId && (
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Filtro ativo:
            </span>
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-200/80 shadow-2xs">
              <span className="text-zinc-500">Agente:</span>
              <span className="font-semibold text-zinc-900">
                {agents?.find((a) => a.id === filters.agentId)?.name || 'Agente'}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="h-4 w-4 p-0 text-zinc-400 hover:text-zinc-800 ml-1 cursor-pointer"
                    onClick={() => {
                      setFilters({});
                      setTempAgentId('all');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Remover filtro</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Month Selector Tabs */}
        <Tabs
          defaultValue={months[0].toString()}
          value={currentMonth.toString()}
          onValueChange={handleChangeMonth}
          className="w-full border-b border-separate mt-4"
        >
          <TabsList variant="line">
            {months.map((m) => (
              <TabsTrigger key={String(m)} value={m.toString()}>
                {t(`month-${m}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Days List Content */}
        <div className="mt-8">
          {isPending && (
            <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 shadow-xs">
              <Spinner className="text-[#B8872E] w-6 h-6" />
              <p className="text-sm font-medium text-zinc-600">
                Carregando agenda de atendimentos...
              </p>
            </div>
          )}

          {!isPending && (
            <div className="w-full space-y-10">
              {daysList.map((day) => {
                const count = day.appointments.length;

                return (
                  <section key={day.date} className="space-y-4">
                    {/* Date Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
                      <div className="flex items-center gap-3">
                        {/* Mini Calendar Date Badge */}
                        <div className="flex flex-col items-center justify-center bg-white border border-[#D6A64A]/50 rounded-xl px-2.5 py-1 min-w-[52px] shadow-2xs">
                          <span className="text-[10px] font-bold uppercase text-[#B8872E] tracking-wider">
                            {day.shortDay}
                          </span>
                          <span className="text-lg font-bold text-zinc-900 font-mono leading-none">
                            {day.dayNumber}
                          </span>
                        </div>

                        <div>
                          <h3
                            className="text-xl sm:text-2xl font-semibold text-zinc-900 capitalize"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                          >
                            {t(`week-day-${day.dayOfWeek}`)}, {day.fullDate}
                          </h3>
                          <span className="text-xs text-zinc-500 font-medium">
                            {count === 0
                              ? 'Nenhum atendimento confirmado'
                              : `${count} ${count === 1 ? 'atendimento confirmado' : 'atendimentos confirmados'}`}
                          </span>
                        </div>
                      </div>

                      {/* Add Appointment Button for this Day */}
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-dashed border-zinc-300 text-zinc-600 hover:border-[#B8872E] hover:text-[#B8872E] hover:bg-[#fefbf6] gap-1.5 text-xs h-8 self-start sm:self-center shrink-0 shadow-2xs"
                      >
                        <Link href={ROUTES.APPOINTMENTS.ADD_WITH_DATE(day.date)}>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Adicionar Atendimento</span>
                        </Link>
                      </Button>
                    </div>

                    {/* Active Confirmed Appointments List */}
                    {count > 0 && (
                      <ul className="space-y-4 flex-1 w-full">
                        {day.appointments.map((app) => (
                          <AppointmentCalendarItem
                            key={app.id}
                            appointment={app}
                            onCancel={(appointment) => {
                              setCancellingAppointment(appointment);
                              setCancellationReason('');
                            }}
                          />
                        ))}
                      </ul>
                    )}

                    {/* Empty Day State */}
                    {count === 0 && (
                      <div className="bg-white/70 border border-dashed border-zinc-200/90 rounded-2xl p-6 text-center shadow-2xs w-full">
                        <p className="text-sm font-medium text-zinc-500">
                          Nenhum atendimento agendado para este dia
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Clique em &quot;Adicionar Atendimento&quot; para registrar um compromisso.
                        </p>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation Between Months */}
        <div className="flex flex-row justify-between items-center mt-10 pt-4 border-t border-zinc-200/80">
          {prevMonth && (
            <Button
              variant="outline"
              size="sm"
              disabled={disabledPrevMonth}
              onClick={handlePrevMonth}
              className="gap-1.5 text-xs h-9 shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t(`month-${prevMonth}`)}</span>
            </Button>
          )}

          {nextMonth && (
            <Button
              variant="outline"
              size="sm"
              disabled={disabledNextMonth}
              onClick={handleNextMonth}
              className="gap-1.5 text-xs h-9 shadow-2xs ml-auto cursor-pointer"
            >
              <span>{t(`month-${nextMonth}`)}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>

      {/* Cancellation Dialog */}
      <Dialog
        open={!!cancellingAppointment}
        onOpenChange={(open) => !open && setCancellingAppointment(null)}
      >
        <DialogContent className="sm:max-w-md p-6 flex flex-col gap-4">
          <DialogHeader className="p-0 text-left space-y-1.5">
            <DialogTitle>Cancelar Atendimento</DialogTitle>
            <DialogDescription>
              Informe o motivo do cancelamento para o agendamento de{' '}
              <span className="font-semibold text-zinc-900">
                {cancellingAppointment?.requesterName}
              </span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700 block">
              Motivo do cancelamento (opcional):
            </label>
            <Input
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Ex.: Houve um imprevisto na agenda pastoral..."
              className="w-full"
            />
            <p className="text-[11px] text-zinc-500">
              Se deixar em branco, o motivo padrão será &quot;Houve um imprevisto na agenda pastoral&quot;.
            </p>
            {isStaffSecretaryOrAdmin && (
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg flex items-center gap-2 text-xs text-emerald-800 mt-2">
                <MessageCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Ao confirmar, você poderá avisar o fiel pelo WhatsApp com a mensagem pronta.</span>
              </div>
            )}
          </div>

          <DialogFooter className="p-0 border-t-0 flex sm:justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setCancellingAppointment(null)}
              type="button"
              className="cursor-pointer"
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubmit}
              isLoading={isUpdatingStatus && processingAppointmentId === cancellingAppointment?.id}
              type="button"
              className="cursor-pointer"
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
