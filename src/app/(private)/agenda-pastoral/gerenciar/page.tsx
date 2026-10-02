'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CalendarPlus,
  Users,
  Tag,
  ChevronRight,
  AlertTriangle,
  Settings2,
  Save,
  Clock,
  CalendarOff,
  Printer,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BackButton } from '@/components/common/back-button';
import {
  useAppointmentSettings,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';

export default function AppointmentsManagePage() {
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';
  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);

  const {
    settings,
    isPending: isSettingsPending,
    updateSettings,
    isUpdatingSettings,
  } = useAppointmentSettings();

  const [showNoticeEditor, setShowNoticeEditor] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');

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
    <>
      <AppHeader
        links={[
          {
            key: 'agenda',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agenda de Atendimentos',
            icon: CalendarCheck,
          },
          {
            key: 'gerenciar',
            href: ROUTES.APPOINTMENTS.MANAGE,
            title: 'Gerenciar',
            icon: Settings2,
          },
        ]}
      />
      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        <div className="space-y-8 w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="mb-2">
                <BackButton href={ROUTES.APPOINTMENTS.HOME} />
              </div>
              <TypographyH1>Gerenciar Atendimentos</TypographyH1>
              <Describe className="mt-1">
                {isPastoralAgent
                  ? 'Gerencie seus atendimentos pastorais, horários disponíveis e solicitações dos fiéis.'
                  : 'Gerencie o sistema de agendamento online, as solicitações dos fiéis, os agentes cadastrados e as categorias de serviço.'}
              </Describe>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-center">
              <Link href={ROUTES.APPOINTMENTS.HOME}>
                <CalendarIcon className="w-4 h-4" />
                <span>Ver Agenda Cronológica</span>
              </Link>
            </Button>
          </div>

          <div className="h-px bg-zinc-200" />

          {/* Global Scheduler Status Banner */}
          {!isPastoralAgent && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                settings?.enabled
                  ? 'bg-emerald-50/50 border-emerald-200/80 shadow-2xs'
                  : 'bg-amber-50/70 border-amber-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
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
                          ? 'Atendimentos Online Habilitados'
                          : 'Atendimentos Online Suspensos'}
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

                <div className="flex items-center gap-3 self-start sm:self-auto xl:self-center shrink-0">
                  {!settings?.enabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomTitle(settings?.suspendedTitle || '');
                        setCustomMessage(settings?.suspendedMessage || '');
                        setShowNoticeEditor(!showNoticeEditor);
                      }}
                      className="text-xs border-amber-300 bg-white hover:bg-amber-50 text-amber-900 cursor-pointer"
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

              {/* Collapsible Notice Editor */}
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
                        placeholder="Ex: Atendimentos Temporariamente Suspensos"
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
                      className="text-xs cursor-pointer"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      disabled={isUpdatingSettings}
                      onClick={handleSaveNotice}
                      className="text-xs bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 mr-1" />
                      {isUpdatingSettings ? 'Salvando...' : 'Salvar aviso'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isPastoralAgent ? (
              <>
                {/* Card 1: Agenda Cronológica */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Minha Agenda
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Consulte a pauta diária cronológica de atendimentos confirmados do mês.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.AGENDA}>
                      <span>Acessar Agenda</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 2: Solicitações & Triagem */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Solicitações de Atendimento
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Aprove, gerencie pendências, remarque ou cancele solicitações de fiéis.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.LIST}>
                      <span>Ver Solicitações</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 3: Novo Atendimento */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                      <CalendarPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Novo Atendimento
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Agende diretamente um atendimento presencial ou visita domiciliar com um paroquiano.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.ADD}>
                      <span>Agendar Agora</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 4: Minha Grade de Horários */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Minha Grade de Horários
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Configure os dias da semana e faixas de horário em que você está disponível para atendimentos.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={myAgent ? ROUTES.PASTORAL_AGENTS.SCHEDULE(myAgent.id) : '#'}>
                      <span>Configurar Grade</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 5: Meus Bloqueios de Data */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                      <CalendarOff className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Bloqueios de Data
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Bloqueie datas pontuais por motivo de férias, retiros espirituais, viagens ou imprevistos.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.BLOCKS}>
                      <span>Gerenciar Bloqueios</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 6: Relatório & Pauta em PDF */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                      <Printer className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Relatório & Pauta (PDF)
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Gere e imprima sua pauta de atendimentos por período com checklist de comparecimento presencial.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.REPORT}>
                      <span>Gerar Relatório</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Card 1: Agenda Cronológica */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Agenda Cronológica
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Visualize a pauta diária e mensal de atendimentos confirmados distribuídos por horário.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.AGENDA}>
                      <span>Acessar Agenda</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 2: Solicitações & Visitas */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Solicitações & Visitas
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Consulte, aprove, conclua ou cancele as solicitações de atendimento pastoral enviadas pelos fiéis.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.LIST}>
                      <span>Acessar Fila</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 3: Novo Atendimento */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                      <CalendarPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Novo Atendimento
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Registre um agendamento para um fiel que ligou ou compareceu pessoalmente na secretaria.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.ADD}>
                      <span>Agendar Agora</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 4: Relatório & Pauta em PDF */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                      <Printer className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Relatório & Pauta (PDF)
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Exporte a pauta filtrada por período para enviar ao Padre ou imprimir com campos de anotação presencial.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENTS.REPORT}>
                      <span>Gerar Relatório</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 5: Agentes Pastorais */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Agentes Pastorais
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Cadastre e gerencie os clérigos e ministros com seus respectivos horários e disponibilidades.
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.PASTORAL_AGENTS.HOME}>
                      <span>Acessar</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>

                {/* Card 6: Categorias de Atendimento */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        Categorias de Atendimento
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Configure os tipos de serviços disponíveis (confissões, bênçãos, conselhos e visitas domiciliares).
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full justify-between gap-2 border-zinc-200 cursor-pointer">
                    <Link href={ROUTES.APPOINTMENT_SERVICES.HOME}>
                      <span>Acessar</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
