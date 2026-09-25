'use client';

import { useState } from 'react';
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
  Users,
  XCircle,
  AlertCircle,
  AlertTriangle,
  HeartHandshake,
  Calendar as CalendarIcon,
  Power,
  Settings2,
  Save,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppointments, useAppointmentSettings, usePastoralAgents } from '@/api/appointments/use-appointments';
import type { Appointment, AppointmentStatus } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showNoticeEditor, setShowNoticeEditor] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const { appointments, isPending, updateStatus, isUpdatingStatus } = useAppointments();
  const { agents } = usePastoralAgents();
  const {
    settings,
    isPending: isSettingsPending,
    updateSettings,
    isUpdatingSettings,
  } = useAppointmentSettings();

  const filteredAppointments = (appointments || []).filter((appointment) => {
    if (selectedStatus !== 'all' && appointment.status !== selectedStatus) {
      return false;
    }
    if (!isPastoralAgent && selectedAgentId !== 'all' && appointment.agentId !== selectedAgentId) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchRequester = appointment.requesterName?.toLowerCase().includes(term);
      const matchPatient = appointment.patientName?.toLowerCase().includes(term);
      const matchAgent = appointment.agent?.name?.toLowerCase().includes(term);
      const matchService = appointment.service?.title?.toLowerCase().includes(term);
      return matchRequester || matchPatient || matchAgent || matchService;
    }
    return true;
  });

  const handleConfirm = async (appointment: Appointment) => {
    await updateStatus({
      id: appointment.id,
      status: 'confirmed',
    });
  };

  const handleComplete = async (appointment: Appointment) => {
    await updateStatus({
      id: appointment.id,
      status: 'completed',
    });
  };

  const handleCancelSubmit = async () => {
    if (!cancellingAppointment) return;
    await updateStatus({
      id: cancellingAppointment.id,
      status: 'cancelled',
      cancellationReason: cancellationReason.trim() || 'Cancelado pela paróquia',
    });
    setCancellingAppointment(null);
    setCancellationReason('');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
            <Clock className="w-3 h-3 mr-1" /> Pendente
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmado
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Realizado
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300">
            <XCircle className="w-3 h-3 mr-1" /> Cancelado
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleToggleEnabled = async (checked: boolean) => {
    await updateSettings({
      enabled: checked,
      suspendedTitle: customTitle || settings?.suspendedTitle,
      suspendedMessage: customMessage || settings?.suspendedMessage,
    });
    if (!checked) {
      setCustomTitle(settings?.suspendedTitle || '');
      setCustomMessage(settings?.suspendedMessage || '');
    }
  };

  const handleSaveNotice = async () => {
    await updateSettings({
      enabled: settings?.enabled ?? false,
      suspendedTitle: customTitle.trim() || settings?.suspendedTitle,
      suspendedMessage: customMessage.trim() || settings?.suspendedMessage,
    });
    setShowNoticeEditor(false);
  };

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <AppBreadcrumb
        links={[
          {
            key: 'agendamentos',
            href: ROUTES.APPOINTMENTS.HOME,
            title: isPastoralAgent ? 'Meus Atendimentos' : 'Atendimentos & Visitas',
            icon: CalendarCheck,
          },
        ]}
      />

      {/* Page Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TypographyH1>
            {isPastoralAgent ? 'Meus Atendimentos' : 'Atendimentos & Visitas'}
          </TypographyH1>

          {!isPastoralAgent && (
            <div className="flex items-center gap-3">
              <Link href={ROUTES.PASTORAL_AGENTS.HOME}>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Agentes Pastorais
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Describe>
          {isPastoralAgent
            ? 'Consulte e gerencie as solicitações de atendimento e visitas direcionadas a você.'
            : 'Atendimentos sacramentais, aconselhamentos e visitas a enfermos acamados solicitados pelos fiéis.'}
        </Describe>
      </div>

      {/* Global Enabler / Scheduler Status Banner (Visible only for admins/secretaries) */}
      {!isPastoralAgent && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            settings?.enabled
              ? 'bg-emerald-50/50 border-emerald-200/80 shadow-xs'
              : 'bg-amber-50/70 border-amber-300 shadow-xs'
          }`}
        >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                settings?.enabled
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-amber-500 text-white shadow-xs'
              }`}
            >
              {settings?.enabled ? (
                <CalendarCheck className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-900">
                  {settings?.enabled
                    ? 'Agendamentos Online Habilitados'
                    : 'Agendamentos Online Suspensos'}
                </h2>
                <Badge
                  variant="outline"
                  className={
                    settings?.enabled
                      ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300 text-xs font-medium'
                      : 'bg-amber-100 text-amber-900 border-amber-300 text-xs font-semibold'
                  }
                >
                  {settings?.enabled ? 'Ativo' : 'Pausado'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                {settings?.enabled
                  ? 'Os fiéis podem consultar horários e solicitar atendimentos normalmente no site.'
                  : 'Nenhum agendamento novo pode ser realizado no site. Os fiéis verão um aviso informativo.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {!settings?.enabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCustomTitle(settings?.suspendedTitle || '');
                  setCustomMessage(settings?.suspendedMessage || '');
                  setShowNoticeEditor(!showNoticeEditor);
                }}
                className="text-xs border-amber-300 bg-white hover:bg-amber-50 text-amber-900"
              >
                <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                {showNoticeEditor ? 'Ocultar aviso' : 'Editar aviso ao fiel'}
              </Button>
            )}

            <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200">
              <span className="text-xs font-medium text-zinc-600 hidden sm:inline">
                {settings?.enabled ? 'Desativar agendamentos' : 'Ativar agendamentos'}
              </span>
              <Switch
                checked={settings?.enabled ?? true}
                disabled={isUpdatingSettings || isSettingsPending}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
          </div>
        </div>

        {/* Collapsible Notice Editor for Suspended State */}
        {showNoticeEditor && !settings?.enabled && (
          <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Mensagem exibida aos fiéis no site público
            </h4>
            <div className="grid gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Título do aviso
                </label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Ex: Agendamentos Temporariamente Suspensos"
                  className="bg-white border-amber-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Mensagem explicativa / orientações
                </label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Ex: Informamos que os atendimentos estão temporariamente suspensos..."
                  className="bg-white border-amber-300 text-sm min-h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNoticeEditor(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                disabled={isUpdatingSettings}
                onClick={handleSaveNotice}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                {isUpdatingSettings ? 'Salvando...' : 'Salvar aviso'}
              </Button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-zinc-100/80 rounded-xl">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'confirmed', label: 'Confirmados' },
            { id: 'completed', label: 'Realizados' },
            { id: 'cancelled', label: 'Cancelados' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input and Agent Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {!isPastoralAgent && agents && agents.length > 0 && (
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="h-10 px-3 rounded-xl border border-zinc-300 text-xs sm:text-sm bg-white text-zinc-700 w-full sm:w-auto"
            >
              <option value="all">Todos os Agentes</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.title ? `${agent.title} ` : ''}{agent.name}
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por fiel, enfermo ou clérigo..."
              className="pl-9 h-10 rounded-xl bg-white border-zinc-300"
            />
          </div>
        </div>
      </div>

      {/* Content / List */}
      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48 rounded" />
              <div className="pt-2 border-t border-zinc-100 flex justify-between">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center bg-zinc-50/50">
          <CalendarIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-zinc-800">Nenhum agendamento encontrado</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
            {searchTerm || selectedStatus !== 'all'
              ? 'Nenhum agendamento corresponde aos filtros selecionados.'
              : 'Não há agendamentos solicitados no momento.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAppointments.map((appointment) => {
            const cleanPhone = (appointment.requesterPhone || '').replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
              `Olá ${appointment.requesterName || ''}, entramos em contato sobre o seu agendamento de ${appointment.service?.title || 'atendimento'} na Paróquia São José.`
            )}`;

            return (
              <div
                key={appointment.id}
                className="border border-zinc-200 rounded-2xl p-5 bg-white shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all gap-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Service title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider block">
                          {appointment.service?.category === 'home_visit'
                            ? 'Visita Domiciliar'
                            : 'Atendimento Presencial'}
                        </span>
                        {appointment.service?.title?.toLowerCase().includes('confissão') && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-purple-50 text-purple-800 border-purple-200 font-bold">
                            Sacramento
                          </Badge>
                        )}
                        {appointment.service?.title?.toLowerCase().includes('aconselhamento') && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-sky-50 text-sky-800 border-sky-200 font-semibold">
                            Geral / Escuta
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900">
                        {appointment.service?.title || 'Atendimento Pastoral'}
                      </h3>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  {/* Date & Time and Assigned Agent */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 rounded-xl text-xs text-zinc-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                      <div>
                        <span className="font-semibold block text-zinc-900">
                          {formatDate(appointment.appointmentDate)}
                        </span>
                        <span>
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-brand-600 shrink-0" />
                      <div>
                        <span className="font-semibold block text-zinc-900">
                          {appointment.agent?.title ? `${appointment.agent.title} ` : ''}
                          {appointment.agent?.name || 'Agente'}
                        </span>
                        <span className="text-zinc-500">
                          {appointment.agent?.actingRole || 'Pastoral'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Solicitante */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2 text-zinc-800">
                      <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-semibold">{appointment.requesterName}</span>
                      {appointment.requesterRelationship && (
                        <span className="text-zinc-400">({appointment.requesterRelationship})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-600">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{appointment.requesterPhone}</span>
                    </div>

                    {appointment.requesterNotes && (
                      <div className="mt-2 p-2 bg-amber-50/60 border border-amber-200/60 rounded-lg text-amber-900 italic text-[11px]">
                        &quot;{appointment.requesterNotes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Se for Visita Domiciliar */}
                  {appointment.patientName && (
                    <div className="p-3 bg-zinc-100/70 border border-zinc-200/80 rounded-xl text-xs space-y-1.5">
                      <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-brand-700" />
                        <span>Enfermo: {appointment.patientName}</span>
                      </div>

                      {appointment.patientAddress && (
                        <div className="flex items-start gap-1.5 text-zinc-600">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{appointment.patientAddress}</span>
                        </div>
                      )}

                      {appointment.patientConditions && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {appointment.patientConditions.isBedridden && (
                            <span className="bg-white border border-zinc-200 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700">
                              Acamado
                            </span>
                          )}
                          {appointment.patientConditions.canSwallowHost && (
                            <span className="bg-white border border-zinc-200 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700">
                              Engole hóstia
                            </span>
                          )}
                          {appointment.patientConditions.isLucid && (
                            <span className="bg-white border border-zinc-200 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700">
                              Lúcido
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {appointment.cancellationReason && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                      <span className="font-semibold">Motivo do Cancelamento:</span> {appointment.cancellationReason}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    {appointment.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 text-xs font-semibold"
                        onClick={() => handleConfirm(appointment)}
                        isLoading={isUpdatingStatus}
                      >
                        Aprovar
                      </Button>
                    )}

                    {appointment.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-semibold text-blue-700 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleComplete(appointment)}
                        isLoading={isUpdatingStatus}
                      >
                        Concluir
                      </Button>
                    )}

                    {appointment.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-zinc-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setCancellingAppointment(appointment)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Dialog */}
      <Dialog open={!!cancellingAppointment} onOpenChange={(open) => !open && setCancellingAppointment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription>
              Informe o motivo do cancelamento para o agendamento de{' '}
              <span className="font-semibold text-zinc-900">{cancellingAppointment?.requesterName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Ex.: Imprevisto paroquial, necessidade de reagendamento..."
              className="w-full"
            />
          </div>

          <DialogFooter className="flex sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setCancellingAppointment(null)}
              type="button"
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubmit}
              isLoading={isUpdatingStatus}
              type="button"
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
