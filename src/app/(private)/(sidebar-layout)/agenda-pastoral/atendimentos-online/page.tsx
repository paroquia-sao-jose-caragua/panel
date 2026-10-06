'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Globe,
  Save,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { BackButton } from '@/components/common/back-button';
import { useAppointmentSettings } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

export default function OnlineAppointmentsSettingsPage() {
  const {
    settings,
    isPending,
    updateSettings,
    isUpdatingSettings,
  } = useAppointmentSettings();

  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setCustomTitle(settings.suspendedTitle || '');
      setCustomMessage(settings.suspendedMessage || '');
    }
  }, [settings]);

  const handleToggleEnabled = async (checked: boolean) => {
    await updateSettings({
      enabled: checked,
      suspendedTitle: customTitle || settings?.suspendedTitle,
      suspendedMessage: customMessage || settings?.suspendedMessage,
    });
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      enabled: settings?.enabled ?? false,
      suspendedTitle: customTitle.trim() || undefined,
      suspendedMessage: customMessage.trim() || undefined,
    });
    setHasChanges(false);
  };

  const isEnabled = settings?.enabled ?? false;

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
            key: 'atendimentos-online',
            href: ROUTES.APPOINTMENTS.ONLINE_SETTINGS,
            title: 'Atendimentos Online',
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
            <TypographyH1>Atendimentos Online</TypographyH1>
            <Describe className="mt-1">
              Controle a disponibilidade do agendamento público pelo site da paróquia e personalize avisos aos fiéis.
            </Describe>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Toggle Card */}
          {isPending ? (
            <Skeleton className="h-44 w-full rounded-2xl" />
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                    }`}
                  >
                    <Globe className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                        Agendamentos Públicos no Site
                      </h2>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2.5 py-0.5 font-semibold rounded-full ${
                          isEnabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />
                            Habilitado no Site
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />
                            Desabilitado / Suspenso
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
                      {isEnabled
                        ? 'Os fiéis podem acessar o site e solicitar agendamentos com os sacerdotes e ministros nos horários disponíveis.'
                        : 'O formulário público de agendamento está bloqueado no site. Os fiéis verão a mensagem de aviso configurada abaixo.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-semibold text-zinc-600">
                    {isEnabled ? 'Habilitado' : 'Desabilitado'}
                  </span>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={handleToggleEnabled}
                    disabled={isUpdatingSettings}
                    aria-label="Habilitar ou desabilitar agendamentos online"
                  />
                </div>
              </div>

              {!isEnabled && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    Com o agendamento online desabilitado, nenhuma nova solicitação será enviada pelos paroquianos via internet. A secretaria ainda pode criar atendimentos internos normalmente.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Suspended Notice Customization Card */}
          <form
            onSubmit={handleSaveNotice}
            className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-5"
          >
            <div>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                Aviso de Suspensão / Recesso
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                Esta mensagem é apresentada aos fiéis no site quando os agendamentos online estão desabilitados.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Título do Aviso
                </label>
                <Input
                  placeholder="Ex: Agendamentos Temporariamente Suspensos"
                  value={customTitle}
                  onChange={(e) => {
                    setCustomTitle(e.target.value);
                    setHasChanges(true);
                  }}
                  disabled={isPending || isUpdatingSettings}
                  className="max-w-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Mensagem Explicativa aos Fiéis
                </label>
                <Textarea
                  rows={4}
                  placeholder="Ex: Informamos que os agendamentos pastorais online estão temporariamente suspensos em razão do recesso pastoral. Para casos urgentes, entre em contato diretamente com a secretaria paroquial."
                  value={customMessage}
                  onChange={(e) => {
                    setCustomMessage(e.target.value);
                    setHasChanges(true);
                  }}
                  disabled={isPending || isUpdatingSettings}
                  className="max-w-2xl text-sm"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Deixe claro o motivo e como o fiel deve proceder em caso de urgência.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <Button
                type="submit"
                size="sm"
                className="gap-1.5 h-9 text-xs cursor-pointer shadow-2xs bg-[#11291f] text-white hover:bg-[#1a3d2e]"
                disabled={isPending || isUpdatingSettings || !hasChanges}
                isLoading={isUpdatingSettings}
                loadingText="Salvando..."
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Mensagem de Aviso</span>
              </Button>
            </div>
          </form>

          {/* Informational Guidance */}
          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-start gap-3">
            <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-zinc-600 leading-relaxed">
              <p className="font-semibold text-zinc-800">
                Como funciona na prática:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                <li>
                  <strong>Atendimentos Internos:</strong> Mesmo com a opção desabilitada, a secretaria paroquial pode continuar agendando atendimentos presencialmente ou por telefone pelo painel administrativo.
                </li>
                <li>
                  <strong>Solicitações Pendentes:</strong> Solicitações que já foram enviadas antes da suspensão continuam disponíveis na aba <em>Solicitações</em> para confirmação ou cancelamento.
                </li>
                <li>
                  <strong>Ativação Imediata:</strong> Ao reativar a chave acima, o formulário público volta ao ar no site instantaneamente.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
