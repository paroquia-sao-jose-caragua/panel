'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Send,
  Trash2,
  BellRing,
  Globe,
  Monitor,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import {
  listPushSubscriptions,
  deletePushSubscription,
} from '@/api/push-subscriptions';
import type { PushSubscriptionEntity } from '@/entities/push-subscription';
import { ROUTES } from '@/constants/routes';

export default function DevicesPage() {
  const [subscriptions, setSubscriptions] = useState<PushSubscriptionEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<PushSubscriptionEntity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const siteCount = subscriptions.filter((s) => s.origin === 'site').length;
  const panelCount = subscriptions.filter((s) => s.origin === 'panel').length;
  const linkedCount = subscriptions.filter((s) => Boolean(s.userId)).length;

  const getRoleLabel = (role?: string | null) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'secretary':
      case 'user':
        return 'Secretaria';
      case 'pastoral_agent':
        return 'Agente Pastoral';
      default:
        return 'Usuário Painel';
    }
  };

  return (
    <>
      <AppHeader
        links={[
          { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: Settings },
          { key: 'devices', href: ROUTES.SETTINGS.DEVICES, title: 'Dispositivos Conectados', icon: Smartphone },
        ]}
      />
      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <TypographyH1>Dispositivos Conectados</TypographyH1>
          <Describe>
            Gerencie os celulares e computadores conectados que recebem notificações push do site e do painel da Paróquia São José.
          </Describe>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSubscriptions}
            disabled={isLoading}
            className="gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>

          <Button asChild size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white border-none cursor-pointer">
            <Link href={ROUTES.SETTINGS.SEND_PUSH}>
              <Send className="w-4 h-4" />
              <span>Enviar Notificação Push</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
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

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
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

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
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

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">
              Contas Vinculadas
            </span>
            <span className="text-2xl font-bold text-zinc-900">{linkedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Table / Device List */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-2xs overflow-hidden">
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
              Quando os fiéis no site ou a equipe no painel ativarem as notificações, os aparelhos aparecerão listados aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3.5">Usuário / Identificação</th>
                  <th className="px-6 py-3.5">Origem</th>
                  <th className="px-6 py-3.5">Navegador / Sistema</th>
                  <th className="px-6 py-3.5">Data da Inscrição</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {subscriptions.map((device) => (
                  <tr key={device.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 border ${
                          device.userId ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {device.userName ? device.userName[0] : 'D'}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="block font-semibold text-zinc-900">
                              {device.userName || 'Dispositivo Não Identificado'}
                            </span>
                            {device.userId && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                <ShieldCheck className="w-3 h-3" />
                                {getRoleLabel(device.userRole)}
                              </span>
                            )}
                          </div>
                          {device.userEmail ? (
                            <span className="text-xs text-zinc-500 block font-mono">{device.userEmail}</span>
                          ) : device.userId ? (
                            <span className="text-xs text-zinc-400 block font-mono">ID: {device.userId}</span>
                          ) : null}
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
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs gap-1 text-amber-700 border-amber-200 hover:bg-amber-50 cursor-pointer"
                        >
                          <Link href={`${ROUTES.SETTINGS.SEND_PUSH}?deviceId=${device.id}`}>
                            <Send className="w-3.5 h-3.5" />
                            <span>Notificar</span>
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDevice(device);
                            setDeleteDialogOpen(true);
                          }}
                          className="h-8 px-2.5 text-xs gap-1 text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Desconectar</span>
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

      {/* Delete / Disconnect Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteDevice}
        isPending={isDeleting}
        title="Desconectar Dispositivo?"
        description={`Tem certeza que deseja desconectar o dispositivo "${selectedDevice?.userName || 'Selecionado'}"${selectedDevice?.userEmail ? ` (${selectedDevice.userEmail})` : ''}? Ele deixará de receber notificações push do painel.`}
      />
    </main>
    </>
  );
}
