'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Printer,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Home,
  CheckSquare,
  Copy,
  Check,
  Filter,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

import { AppHeader } from '@/components/common/header';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppointments, usePastoralAgents, useMyPastoralAgent } from '@/api/appointments/use-appointments';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';

type PeriodPreset = 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'this_month' | 'custom';

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPresetDates(preset: PeriodPreset): { startDate: string; endDate: string } {
  const now = new Date();

  if (preset === 'today') {
    const today = toISODate(now);
    return { startDate: today, endDate: today };
  }

  if (preset === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomStr = toISODate(tomorrow);
    return { startDate: tomStr, endDate: tomStr };
  }

  if (preset === 'this_week') {
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { startDate: toISODate(monday), endDate: toISODate(sunday) };
  }

  if (preset === 'next_week') {
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { startDate: toISODate(monday), endDate: toISODate(sunday) };
  }

  if (preset === 'this_month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: toISODate(startOfMonth), endDate: toISODate(endOfMonth) };
  }

  const today = toISODate(now);
  return { startDate: today, endDate: today };
}

const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatLongDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const weekday = WEEKDAYS[d.getDay()];
  const monthName = MONTHS[month - 1];
  return `${weekday}, ${day} de ${monthName} de ${year}`;
}

export default function AppointmentsReportPage() {
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';
  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents } = usePastoralAgents();

  // Filter states
  const [preset, setPreset] = useState<PeriodPreset>('this_week');
  const [dates, setDates] = useState(() => getPresetDates('this_week'));
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'confirmed' | 'pending'>('active');

  // Print options
  const [includeControlSection, setIncludeControlSection] = useState(true);
  const [includeNotesLines, setIncludeNotesLines] = useState(true);
  const [includeAddressDetails, setIncludeAddressDetails] = useState(true);
  const [includeFaithfulNotes, setIncludeFaithfulNotes] = useState(true);

  const [copied, setCopied] = useState(false);

  const effectiveAgentId = isPastoralAgent
    ? myAgent?.id
    : selectedAgentId === 'all'
    ? undefined
    : selectedAgentId;

  const { appointments, isPending } = useAppointments({
    startDate: dates.startDate,
    endDate: dates.endDate,
    agentId: effectiveAgentId,
  });

  const handlePresetChange = (newPreset: PeriodPreset) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      setDates(getPresetDates(newPreset));
    }
  };

  // Filtered & sorted appointments
  const filteredAppointments = useMemo(() => {
    let list = appointments || [];

    if (statusFilter === 'active') {
      list = list.filter((a) => a.status === 'confirmed' || a.status === 'pending');
    } else if (statusFilter === 'confirmed') {
      list = list.filter((a) => a.status === 'confirmed');
    } else if (statusFilter === 'pending') {
      list = list.filter((a) => a.status === 'pending');
    }

    return [...list].sort((a, b) => {
      if (a.appointmentDate !== b.appointmentDate) {
        return a.appointmentDate.localeCompare(b.appointmentDate);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [appointments, statusFilter]);

  // Group by appointmentDate
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    for (const app of filteredAppointments) {
      if (!groups[app.appointmentDate]) {
        groups[app.appointmentDate] = [];
      }
      groups[app.appointmentDate].push(app);
    }
    return groups;
  }, [filteredAppointments]);

  // Statistics
  const totalCount = filteredAppointments.length;
  const homeVisitsCount = filteredAppointments.filter(
    (a) => a.service?.category === 'home_visit' || a.service?.requiresAddress
  ).length;
  const parishAppointmentsCount = totalCount - homeVisitsCount;

  // Selected agent name for header
  const currentAgentName = useMemo(() => {
    if (isPastoralAgent && myAgent) {
      return `${myAgent.title ? `${myAgent.title} ` : ''}${myAgent.name} — ${myAgent.actingRole}`;
    }
    if (selectedAgentId !== 'all') {
      const found = agents.find((a) => a.id === selectedAgentId);
      if (found) {
        return `${found.title ? `${found.title} ` : ''}${found.name} — ${found.actingRole}`;
      }
    }
    return 'Todos os Padres e Agentes Pastorais';
  }, [isPastoralAgent, myAgent, selectedAgentId, agents]);

  // Trigger browser native print (PDF generation)
  const handlePrint = () => {
    window.print();
  };

  // Copy WhatsApp plain text schedule
  const handleCopyWhatsApp = () => {
    if (totalCount === 0) {
      showAlert('Não há atendimentos no período selecionado para exportar.');
      return;
    }

    let text = `📋 *PAUTA DE ATENDIMENTOS PASTORAIS*\n`;
    text += `*Paróquia São José de Caraguatatuba*\n`;
    text += `📅 Período: ${formatDisplayDate(dates.startDate)} até ${formatDisplayDate(dates.endDate)}\n`;
    text += `👤 Atendente: ${currentAgentName}\n`;
    text += `📊 Total de Agendamentos: ${totalCount}\n\n`;

    Object.entries(groupedByDate).forEach(([dateStr, items]) => {
      text += `━━━━━━━━━━━━━━━━━━━━\n`;
      text += `🗓️ *${formatLongDate(dateStr).toUpperCase()}*\n`;
      text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

      items.forEach((item, idx) => {
        const agent = item.agent || agents.find((a) => a.id === item.agentId);
        const agentDisplayName = agent
          ? `${agent.title ? `${agent.title} ` : ''}${agent.name}${agent.actingRole ? ` (${agent.actingRole})` : ''}`
          : null;

        text += `${idx + 1}. 🕒 *${item.startTime} - ${item.endTime}*\n`;
        text += `   👤 *Fiel:* ${item.requesterName}\n`;
        text += `   📞 *Telefone:* ${item.requesterPhone}\n`;
        text += `   ✝️ *Atendimento:* ${item.service?.title || 'Atendimento Pastoral'}\n`;
        if (agentDisplayName) {
          text += `   🙏 *Agente Pastoral:* ${agentDisplayName}\n`;
        }

        if (item.service?.requiresAddress || item.patientAddress) {
          text += `   🏠 *Visita Domiciliar:*\n`;
          if (item.patientName) text += `      • Paciente: ${item.patientName}\n`;
          if (item.patientAddress) text += `      • Endereço: ${item.patientAddress}\n`;
          if (item.patientConditions) {
            const conds = [];
            if (item.patientConditions.isBedridden) conds.push('Acamado');
            if (item.patientConditions.canSwallowHost) conds.push('Deglute hóstia');
            if (item.patientConditions.isLucid) conds.push('Lúcido');
            if (conds.length) text += `      • Condições: ${conds.join(', ')}\n`;
          }
        } else if (item.community?.name) {
          text += `   📍 *Local:* ${item.community.name}\n`;
        }

        if (item.requesterNotes) {
          text += `   💬 *Observação:* ${item.requesterNotes}\n`;
        }

        text += `\n`;
      });
    });

    text += `_Documento de uso interno paroquial._`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showAlert('Pauta de atendimentos copiada para a área de transferência!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      {/* Print-specific style rules */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 10mm 12mm;
            size: A4 portrait;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header,
          aside,
          nav,
          .print-hidden,
          [data-print-hidden='true'] {
            display: none !important;
          }
          .printable-report {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="print-hidden">
        <AppHeader
          links={[
            {
              key: 'agendamentos-hub',
              href: ROUTES.APPOINTMENTS.HOME,
              title: 'Agendamentos',
              icon: Calendar,
            },
            {
              key: 'solicitacoes',
              href: ROUTES.APPOINTMENTS.LIST,
              title: isPastoralAgent ? 'Meus Atendimentos' : 'Atendimentos & Visitas',
            },
            {
              key: 'relatorio',
              href: ROUTES.APPOINTMENTS.REPORT,
              title: 'Relatório & Pauta (PDF)',
            },
          ]}
        />
      </div>

      <main className="w-full min-w-0 max-w-325 px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
        {/* Screen Header Controls (Hidden on Print) */}
        <div className="print-hidden space-y-4">
          <BackButton href={ROUTES.APPOINTMENTS.HOME} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <TypographyH1>Pauta & Relatório de Atendimentos</TypographyH1>
              <Describe className="mt-1">
                Gere e imprima a pauta dos atendimentos pastorais por período com campos de controle presencial para o Padre.
              </Describe>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleCopyWhatsApp}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5 text-zinc-600" />
                    Copiar p/ WhatsApp
                  </>
                )}
              </Button>

              <Button
                type="button"
                className="bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-sm"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Imprimir / Salvar em PDF
              </Button>
            </div>
          </div>

          {/* Interactive Filters Panel */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm border-b border-zinc-100 pb-3">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Configuração dos Filtros e Opções de Impressão</span>
            </div>

            {/* Presets and Dates */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                Período da Pauta
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'today', label: 'Hoje' },
                  { id: 'tomorrow', label: 'Amanhã' },
                  { id: 'this_week', label: 'Esta Semana' },
                  { id: 'next_week', label: 'Próxima Semana' },
                  { id: 'this_month', label: 'Este Mês' },
                  { id: 'custom', label: 'Personalizado' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePresetChange(item.id as PeriodPreset)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      preset === item.id
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div>
                  <label className="text-xs text-zinc-500 font-medium block mb-1">
                    Data Inicial
                  </label>
                  <Input
                    type="date"
                    value={dates.startDate}
                    onChange={(e) => {
                      setDates((prev) => ({ ...prev, startDate: e.target.value }));
                      setPreset('custom');
                    }}
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 font-medium block mb-1">
                    Data Final
                  </label>
                  <Input
                    type="date"
                    value={dates.endDate}
                    onChange={(e) => {
                      setDates((prev) => ({ ...prev, endDate: e.target.value }));
                      setPreset('custom');
                    }}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Agent Selector */}
                <div>
                  <label className="text-xs text-zinc-500 font-medium block mb-1">
                    Padre / Agente Pastoral
                  </label>
                  {isPastoralAgent ? (
                    <div className="h-9 px-3 flex items-center bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-800">
                      {myAgent ? `${myAgent.title ? `${myAgent.title} ` : ''}${myAgent.name}` : 'Meu Perfil'}
                    </div>
                  ) : (
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-zinc-200 rounded-md text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="all">Todos os Padres e Agentes</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.title ? `${ag.title} ` : ''}{ag.name} ({ag.actingRole})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Status Selector */}
                <div>
                  <label className="text-xs text-zinc-500 font-medium block mb-1">
                    Status dos Agendamentos
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full h-9 px-2.5 bg-white border border-zinc-200 rounded-md text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="active">Confirmados & Pendentes (Recomendado)</option>
                    <option value="confirmed">Apenas Confirmados</option>
                    <option value="pending">Apenas Pendentes</option>
                    <option value="all">Todos os Status (inclusive cancelados)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customization switches */}
            <div className="pt-2 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
                <Switch
                  checked={includeControlSection}
                  onCheckedChange={setIncludeControlSection}
                />
                <span>Checklist de Presença do Padre</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
                <Switch
                  checked={includeNotesLines}
                  onCheckedChange={setIncludeNotesLines}
                  disabled={!includeControlSection}
                />
                <span>Linhas de Anotações do Sacerdote</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
                <Switch
                  checked={includeAddressDetails}
                  onCheckedChange={setIncludeAddressDetails}
                />
                <span>Endereço de Visitas Domiciliares</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
                <Switch
                  checked={includeFaithfulNotes}
                  onCheckedChange={setIncludeFaithfulNotes}
                />
                <span>Observações do Fiel</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Dica para salvar em PDF:</span>
              Ao clicar no botão <strong>"Imprimir / Salvar em PDF"</strong>, na janela de impressão do seu navegador, escolha o destino <strong>"Salvar como PDF"</strong>. O arquivo gerado estará pronto para ser enviado pelo WhatsApp ou e-mail ao Padre.
            </div>
          </div>
        </div>

        {/* PRINTABLE REPORT SHEET (Preview on screen, full page on Print) */}
        <div className="printable-report bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-zinc-900">
          {/* Header of the Official Sheet */}
          <div className="border-b-2 border-zinc-800 pb-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 uppercase font-serif">
                    Paróquia São José
                  </h2>
                  <p className="text-xs text-zinc-600 font-medium">
                    Diocese de Caraguatatuba • Secretaria Paroquial
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Caraguatatuba - SP • CNPJ 44.428.188/0001-08
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded border border-zinc-200">
                  Pauta de Atendimentos
                </span>
                <p className="text-xs text-zinc-500 mt-1.5">
                  Emissão: {new Date().toLocaleDateString('pt-BR')} às{' '}
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Subheader info block */}
            <div className="mt-5 pt-4 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div>
                  <span className="font-semibold text-zinc-600">Período: </span>
                  <span className="font-bold text-zinc-900">
                    {formatDisplayDate(dates.startDate)} até {formatDisplayDate(dates.endDate)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-600">Sacerdote / Agente: </span>
                  <span className="font-bold text-zinc-900">{currentAgentName}</span>
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <div>
                  <span className="font-semibold text-zinc-600">Total de Atendimentos: </span>
                  <span className="font-bold text-zinc-900">{totalCount} agendamento(s)</span>
                </div>
                <div>
                  <span className="text-zinc-500">
                    {parishAppointmentsCount} na secretaria/igreja • {homeVisitsCount} visita(s) domiciliares
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isPending && (
            <div className="space-y-4 py-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          )}

          {/* Empty State */}
          {!isPending && totalCount === 0 && (
            <div className="py-12 text-center space-y-2 border border-dashed border-zinc-200 rounded-xl">
              <Calendar className="w-10 h-10 text-zinc-300 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-800">
                Nenhum atendimento encontrado para este período
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Não constam agendamentos registrados entre {formatDisplayDate(dates.startDate)} e{' '}
                {formatDisplayDate(dates.endDate)} para os filtros selecionados.
              </p>
            </div>
          )}

          {/* Appointments Grouped by Day */}
          {!isPending && totalCount > 0 && (
            <div className="space-y-8">
              {Object.entries(groupedByDate).map(([dateStr, items]) => (
                <div key={dateStr} className="space-y-3">
                  {/* Day Header */}
                  <div className="bg-zinc-100/80 border-l-4 border-brand-700 px-3.5 py-2 flex items-center justify-between rounded-r">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-brand-700" />
                      <span className="font-bold text-sm text-zinc-900 uppercase">
                        {formatLongDate(dateStr)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-zinc-600">
                      {items.length} atendimento(s)
                    </span>
                  </div>

                  {/* Appointments list for this day */}
                  <div className="space-y-3">
                    {items.map((app, index) => {
                      const isHomeVisit = app.service?.category === 'home_visit' || app.service?.requiresAddress;

                      return (
                        <div
                          key={app.id}
                          className="break-inside-avoid border border-zinc-300 rounded-xl p-4 bg-white space-y-3 shadow-2xs"
                        >
                          {/* Row 1: Time, Service, Status, Order */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-sm bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded border border-zinc-200">
                                <Clock className="w-3.5 h-3.5 text-brand-600" />
                                {app.startTime} - {app.endTime}
                              </span>

                              <span className="font-bold text-sm text-zinc-900">
                                {app.service?.title || 'Atendimento Pastoral'}
                              </span>

                              {isHomeVisit && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  <Home className="w-3 h-3 text-amber-700" />
                                  Visita Domiciliar
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {app.status === 'confirmed' && (
                                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Confirmado
                                </span>
                              )}
                              {app.status === 'pending' && (
                                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  Pendente
                                </span>
                              )}
                              {app.status === 'completed' && (
                                <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  Concluído
                                </span>
                              )}
                              {app.status === 'cancelled' && (
                                <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  Cancelado
                                </span>
                              )}

                              <span className="text-xs text-zinc-400 font-mono">
                                #{index + 1}
                              </span>
                            </div>
                          </div>

                          {/* Row 2: Faithful details & location */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="space-y-0.5">
                              <div>
                                <span className="text-zinc-500 font-medium">Fiel / Solicitante: </span>
                                <span className="font-bold text-zinc-900 text-sm">
                                  {app.requesterName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-zinc-700">
                                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                <span className="font-medium">{app.requesterPhone}</span>
                                {app.requesterEmail && (
                                  <span className="text-zinc-500 ml-1">({app.requesterEmail})</span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-0.5 sm:text-right">
                              {app.agent && (
                                <div>
                                  <span className="text-zinc-500 font-medium">Atendente: </span>
                                  <span className="font-semibold text-zinc-800">
                                    {app.agent.title ? `${app.agent.title} ` : ''}{app.agent.name}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="text-zinc-500 font-medium">Local: </span>
                                <span className="font-semibold text-zinc-800">
                                  {isHomeVisit ? 'Residência do Fiel' : (app.community?.name || 'Secretaria Paroquial')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Home Visit Details */}
                          {includeAddressDetails && isHomeVisit && (app.patientAddress || app.patientName) && (
                            <div className="bg-amber-50/50 border border-amber-200/80 rounded-lg p-3 text-xs space-y-1.5 text-zinc-800">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                {app.patientName && (
                                  <div>
                                    <span className="font-semibold text-amber-950">Paciente / Enfermo: </span>
                                    <span className="font-bold text-zinc-900">{app.patientName}</span>
                                  </div>
                                )}
                                {app.requesterRelationship && (
                                  <span className="text-zinc-600">
                                    Parentesco: {app.requesterRelationship}
                                  </span>
                                )}
                              </div>

                              {app.patientAddress && (
                                <div className="flex items-start gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                  <span className="font-medium text-zinc-900">{app.patientAddress}</span>
                                </div>
                              )}

                              {/* Clinical Conditions */}
                              {app.patientConditions && (
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-amber-200/60 text-[11px]">
                                  <span>
                                    <strong>Acamado:</strong>{' '}
                                    {app.patientConditions.isBedridden ? 'Sim' : 'Não'}
                                  </span>
                                  <span>
                                    <strong>Deglute Hóstia:</strong>{' '}
                                    {app.patientConditions.canSwallowHost ? 'Sim' : 'Não'}
                                  </span>
                                  <span>
                                    <strong>Lúcido:</strong>{' '}
                                    {app.patientConditions.isLucid ? 'Sim' : 'Não'}
                                  </span>
                                  {app.patientConditions.notes && (
                                    <span className="italic text-zinc-600">
                                      Obs: {app.patientConditions.notes}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Faithful Requester Notes */}
                          {includeFaithfulNotes && app.requesterNotes && (
                            <div className="text-xs bg-zinc-50 rounded-lg p-2.5 border border-zinc-200/60 text-zinc-700">
                              <span className="font-semibold text-zinc-600">Motivo / Notas do Fiel: </span>
                              <span className="italic">"{app.requesterNotes}"</span>
                            </div>
                          )}

                          {/* PRIEST'S PRESENCE CHECKLIST & NOTES (User's core request) */}
                          {includeControlSection && (
                            <div className="pt-2.5 border-t border-zinc-200/80 bg-zinc-50/70 p-3 rounded-lg text-xs space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
                                <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                  <CheckSquare className="w-3.5 h-3.5 text-brand-700" />
                                  Controle de Presença (Padre):
                                </span>

                                <div className="flex flex-wrap items-center gap-4 text-zinc-800">
                                  <div className="inline-flex items-center gap-1.5">
                                    <span className="w-4 h-4 border border-zinc-500 rounded bg-white shrink-0 inline-block" />
                                    <span className="font-semibold text-zinc-900">Compareceu</span>
                                  </div>

                                  <div className="inline-flex items-center gap-1.5">
                                    <span className="w-4 h-4 border border-zinc-500 rounded bg-white shrink-0 inline-block" />
                                    <span className="font-semibold text-zinc-900">Desmarcou</span>
                                  </div>

                                  <div className="inline-flex items-center gap-1.5">
                                    <span className="w-4 h-4 border border-zinc-500 rounded bg-white shrink-0 inline-block" />
                                    <span className="font-semibold text-zinc-900">Reagendou</span>
                                  </div>

                                  <div className="inline-flex items-center gap-1.5">
                                    <span className="w-4 h-4 border border-zinc-500 rounded bg-white shrink-0 inline-block" />
                                    <span className="font-medium text-zinc-600">Faltou</span>
                                  </div>
                                </div>
                              </div>

                              {/* Handwritten Priest's Notes */}
                              {includeNotesLines && (
                                <div className="pt-1.5 space-y-1.5">
                                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                                    Anotações Pastorais / Observações do Sacerdote:
                                  </span>
                                  <div className="border-b border-dashed border-zinc-300 h-4 w-full" />
                                  <div className="border-b border-dashed border-zinc-300 h-4 w-full" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Document Footer */}
          <div className="pt-8 border-t border-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              <p className="font-medium text-zinc-700">
                Paróquia São José de Caraguatatuba
              </p>
              <p className="text-[11px] text-zinc-400">
                Documento de uso confidencial e exclusivo da Secretaria Paroquial e do Clero.
              </p>
            </div>

            <div className="text-center sm:text-right pt-4 sm:pt-0">
              <div className="w-56 border-b border-zinc-400 mb-1 mx-auto sm:ml-auto" />
              <span className="text-[11px] font-medium text-zinc-600">
                Visto do Sacerdote / Agente Pastoral
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
