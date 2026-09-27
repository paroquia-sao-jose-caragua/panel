'use client';

import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Send,
  Trash2,
  BellRing,
  Globe,
  Monitor,
  RefreshCw,
} from 'lucide-react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import {
  listPushSubscriptions,
  deletePushSubscription,
  sendTestPushNotification,
} from '@/api/push-subscriptions';
import type { PushSubscriptionEntity } from '@/entities/push-subscription';

export default function DevicesPage() {
  const [subscriptions, setSubscriptions] = useState<PushSubscriptionEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<PushSubscriptionEntity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Send Test Dialog State
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testTitle, setTestTitle] = useState('Paróquia São José');
  const [testBody, setTestBody] = useState('Notificação de teste do painel administrativo.');
  const [testUrl, setTestUrl] = useState('/');
  const [targetOriginFilter, setTargetOriginFilter] = useState<'all' | 'site' | 'panel'>('all');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const loadSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await listPushSubscriptions();
      setSubscriptions(res.subscriptions || []);
    } catch (err) {
      console.error('Erro ao carregar dispositivos inscritos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;
    setIsDeleting(true);
    try {
      await deletePushSubscription(selectedDevice.id);
      setSubscriptions((prev) => prev.filter((d) => d.id !== selectedDevice.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Erro ao remover dispositivo:', err);
    } finally {
      setIsDeleting(false);
      setSelectedDevice(null);
    }
  };

  const handleSendTestPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    try {
      await sendTestPushNotification({
        title: testTitle,
        body: testBody,
        url: testUrl,
        targetId: selectedDevice ? selectedDevice.id : undefined,
        targetOrigin: selectedDevice
          ? undefined
          : targetOriginFilter === 'all'
          ? undefined
          : targetOriginFilter,
      });
      setTestDialogOpen(false);
      setSelectedDevice(null);
    } catch (err) {
      console.error('Erro ao enviar notificação de teste:', err);
    } finally {
      setIsSendingTest(false);
    }
  };

  const siteCount = subscriptions.filter((s) => s.origin === 'site').length;
  const panelCount = subscriptions.filter((s) => s.origin === 'panel').length;

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      {/* Top Breadcrumb & Actions */}
      <AppBreadcrumb
        links={[
          { key: 'origin', href: '/dispositivos', title: 'Dispositivos', icon: Smartphone },
        ]}
      />

      <div className="flex flex-row justify-between items-center w-full">
        <TypographyH1>Dispositivos Conectados</TypographyH1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSubscriptions}
            disabled={isLoading}
            className="gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedDevice(null);
              setTestDialogOpen(true);
            }}
            className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white border-none"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Notificação Global</span>
          </Button>
        </div>
      </div>

      <Describe>
        Gerencie os aparelhos celular e computadores que aceitaram receber notificações push do
        site e do painel da Paróquia São José.
      </Describe>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">
              Total Inscritos
            </span>
            <span className="text-2xl font-bold text-zinc-900">{subscriptions.length}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">
              Site Público (Fiéis)
            </span>
            <span className="text-2xl font-bold text-zinc-900">{siteCount}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">
              Painel Administrativo
            </span>
            <span className="text-2xl font-bold text-zinc-900">{panelCount}</span>
          </div>
        </div>
      </div>

      {/* Main Table / Device List */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
              <BellRing className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
              Nenhum dispositivo conectado
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Quando os fiéis no site ou a equipe no painel ativarem as notificações, os aparelhos
              aparecerão listados aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3.5">Usuário / Fiel</th>
                  <th className="px-6 py-3.5">Origem</th>
                  <th className="px-6 py-3.5">Dispositivo / Navegador</th>
                  <th className="px-6 py-3.5">Data da Inscrição</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {subscriptions.map((device) => (
                  <tr key={device.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {device.userName ? device.userName[0] : 'D'}
                        </div>
                        <div>
                          <span className="block font-semibold text-zinc-900">
                            {device.userName || 'Dispositivo Não Identificado'}
                          </span>
                          {device.userId && (
                            <span className="text-xs text-zinc-400">ID: {device.userId}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {device.origin === 'panel' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <Monitor className="w-3 h-3" />
                          Painel
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Globe className="w-3 h-3" />
                          Site Público
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-600">
                      {device.deviceInfo || 'Navegador Web'}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {new Date(device.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDevice(device);
                            setTestDialogOpen(true);
                          }}
                          className="h-8 px-2.5 text-xs gap-1 text-amber-700 border-amber-200 hover:bg-amber-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Testar</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDevice(device);
                            setDeleteDialogOpen(true);
                          }}
                          className="h-8 px-2.5 text-xs gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteDevice}
        isPending={isDeleting}
        title="Remover Dispositivo?"
        description={`Tem certeza que deseja desconectar o dispositivo "${selectedDevice?.userName || 'Selecionado'}"? Ele deixará de receber notificações push.`}
      />

      {/* Send Push Notification Dialog */}
      {testDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-600" />
              <span>{selectedDevice ? `Notificar ${selectedDevice.userName}` : 'Enviar Notificação Push Global'}</span>
            </h3>

            <p className="text-xs text-zinc-500">
              {selectedDevice
                ? `Esta notificação será enviada especificamente para o dispositivo de ${selectedDevice.userName}.`
                : 'Esta notificação será enviada para TODOS os fiéis e usuários com notificações ativas.'}
            </p>

            <form onSubmit={handleSendTestPush} className="space-y-4 pt-2">
              {!selectedDevice && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Público-Alvo / Origem dos Dispositivos
                  </label>
                  <select
                    value={targetOriginFilter}
                    onChange={(e) =>
                      setTargetOriginFilter(e.target.value as 'all' | 'site' | 'panel')
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-amber-600 focus:outline-none bg-white"
                  >
                    <option value="all">Todos os Dispositivos (Site Público & Painel)</option>
                    <option value="site">Apenas Fiéis (Site Público)</option>
                    <option value="panel">Apenas Equipe / Admin (Painel Administrativo)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Título da Notificação
                </label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Mensagem / Conteúdo
                </label>
                <textarea
                  required
                  rows={3}
                  value={testBody}
                  onChange={(e) => setTestBody(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Caminho ao Clicar (ex: / ou /avisos)
                </label>
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="/"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestDialogOpen(false);
                    setSelectedDevice(null);
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  isLoading={isSendingTest}
                  loadingText="Enviando..."
                  className="bg-amber-600 hover:bg-amber-700 text-white border-none"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  <span>Enviar Agora</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
