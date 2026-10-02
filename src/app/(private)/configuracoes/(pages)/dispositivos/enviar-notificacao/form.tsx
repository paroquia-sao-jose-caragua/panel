'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  Globe,
  Monitor,
  Users,
  CheckSquare,
  Square,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  listPushSubscriptions,
  sendTestPushNotification,
} from '@/api/push-subscriptions';
import type { PushSubscriptionEntity } from '@/entities/push-subscription';
import { ROUTES } from '@/constants/routes';

export const SendPushForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDeviceId = searchParams.get('deviceId');

  const [subscriptions, setSubscriptions] = useState<PushSubscriptionEntity[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  // Form State
  const [targetType, setTargetType] = useState<'all' | 'site' | 'panel' | 'custom'>(
    initialDeviceId ? 'custom' : 'all'
  );
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(
    initialDeviceId ? [initialDeviceId] : []
  );
  const [title, setTitle] = useState('Paróquia São José');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('/');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadDevices() {
      setIsLoadingDevices(true);
      try {
        const res = await listPushSubscriptions();
        setSubscriptions(res.subscriptions || []);
        if (initialDeviceId && res.subscriptions?.some((d) => d.id === initialDeviceId)) {
          setSelectedDeviceIds([initialDeviceId]);
          setTargetType('custom');
        }
      } catch (err) {
        console.error('Erro ao carregar dispositivos para notificação:', err);
      } finally {
        setIsLoadingDevices(false);
      }
    }
    loadDevices();
  }, [initialDeviceId]);

  const toggleSelectDevice = (id: string) => {
    setSelectedDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllCustom = () => {
    if (selectedDeviceIds.length === subscriptions.length) {
      setSelectedDeviceIds([]);
    } else {
      setSelectedDeviceIds(subscriptions.map((s) => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error('Preencha o título e a mensagem da notificação.');
      return;
    }

    if (targetType === 'custom' && selectedDeviceIds.length === 0) {
      toast.error('Selecione ao menos um dispositivo para enviar a notificação.');
      return;
    }

    setIsSending(true);

    try {
      if (targetType === 'custom') {
        let sentTotal = 0;
        for (const deviceId of selectedDeviceIds) {
          const res = await sendTestPushNotification({
            title: title.trim(),
            body: body.trim(),
            url: url.trim() || '/',
            targetId: deviceId,
          });
          sentTotal += res.sentCount || 0;
        }
        toast.success(`Notificação disparada para ${sentTotal} dispositivo(s) selecionado(s)!`);
      } else {
        const res = await sendTestPushNotification({
          title: title.trim(),
          body: body.trim(),
          url: url.trim() || '/',
          targetOrigin: targetType === 'all' ? undefined : targetType,
        });
        toast.success(`Notificação enviada com sucesso para ${res.sentCount} dispositivo(s)!`);
      }

      router.push(ROUTES.SETTINGS.DEVICES);
    } catch (err) {
      console.error('Erro ao disparar notificação push:', err);
      toast.error('Falha ao enviar a notificação push. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      {/* Section 1: Target Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-zinc-900">
            Público-Alvo e Destinatários
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
              targetType === 'all'
                ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-semibold'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
            }`}
          >
            <input
              type="radio"
              name="targetType"
              value="all"
              checked={targetType === 'all'}
              onChange={() => setTargetType('all')}
              className="mt-1 accent-amber-600"
            />
            <div>
              <span className="block text-sm">Todos os Dispositivos</span>
              <span className="text-xs text-zinc-500 font-normal">
                Site público e painel ({subscriptions.length} conectados)
              </span>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
              targetType === 'site'
                ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-semibold'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
            }`}
          >
            <input
              type="radio"
              name="targetType"
              value="site"
              checked={targetType === 'site'}
              onChange={() => setTargetType('site')}
              className="mt-1 accent-amber-600"
            />
            <div>
              <span className="block text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                Apenas Site (Fiéis)
              </span>
              <span className="text-xs text-zinc-500 font-normal">
                {subscriptions.filter((s) => s.origin === 'site').length} dispositivos
              </span>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
              targetType === 'panel'
                ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-semibold'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
            }`}
          >
            <input
              type="radio"
              name="targetType"
              value="panel"
              checked={targetType === 'panel'}
              onChange={() => setTargetType('panel')}
              className="mt-1 accent-amber-600"
            />
            <div>
              <span className="block text-sm flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-blue-600" />
                Apenas Painel (Equipe)
              </span>
              <span className="text-xs text-zinc-500 font-normal">
                {subscriptions.filter((s) => s.origin === 'panel').length} dispositivos
              </span>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
              targetType === 'custom'
                ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-semibold'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
            }`}
          >
            <input
              type="radio"
              name="targetType"
              value="custom"
              checked={targetType === 'custom'}
              onChange={() => setTargetType('custom')}
              className="mt-1 accent-amber-600"
            />
            <div>
              <span className="block text-sm flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                Selecionar Específicos
              </span>
              <span className="text-xs text-zinc-500 font-normal">
                {selectedDeviceIds.length} de {subscriptions.length} selecionado(s)
              </span>
            </div>
          </label>
        </div>

        {/* Custom Selection Device List */}
        {targetType === 'custom' && (
          <div className="pt-3 border-t border-zinc-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-zinc-500">
                Dispositivos Disponíveis
              </span>
              <button
                type="button"
                onClick={toggleSelectAllCustom}
                className="text-xs text-amber-700 font-medium hover:underline cursor-pointer"
              >
                {selectedDeviceIds.length === subscriptions.length
                  ? 'Desmarcar Todos'
                  : 'Selecionar Todos'}
              </button>
            </div>

            {isLoadingDevices ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : subscriptions.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">Nenhum dispositivo encontrado.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 border border-zinc-200 rounded-xl">
                {subscriptions.map((device) => {
                  const isSelected = selectedDeviceIds.includes(device.id);
                  return (
                    <div
                      key={device.id}
                      onClick={() => toggleSelectDevice(device.id)}
                      className={`flex items-center justify-between p-3 cursor-pointer transition hover:bg-zinc-50 ${
                        isSelected ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-amber-600 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-zinc-300 shrink-0" />
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-zinc-900">
                              {device.userName || 'Dispositivo Desconhecido'}
                            </span>
                            {device.userId && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Conta Vinculada
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-500 block">
                            {device.deviceInfo || 'Navegador'} • {device.origin === 'panel' ? 'Painel' : 'Site'}
                          </span>
                        </div>
                      </div>

                      {device.userEmail && (
                        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                          {device.userEmail}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Notification Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-zinc-900">
            Conteúdo da Notificação
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Título da Notificação *
            </label>
            <input
              type="text"
              required
              maxLength={255}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Horário da Missa de Santo Antônio"
              className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Mensagem / Conteúdo *
            </label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Digite a mensagem principal da notificação..."
              className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Caminho / URL ao Clicar
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ex: /programacao-e-eventos/banners ou /programacao-e-eventos"
              className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-amber-600 focus:outline-none"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Caminhos relativos iniciados em '/' serão formatados automaticamente para o site ou painel do destinatário.
            </span>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
        <Link href={ROUTES.SETTINGS.DEVICES}>
          <Button variant="outline" size="lg" type="button" className="cursor-pointer">
            Cancelar
          </Button>
        </Link>
        <Button
          size="lg"
          type="submit"
          isLoading={isSending}
          loadingText="Enviando..."
          className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
        >
          Enviar Notificação
        </Button>
      </div>
    </form>
  );
};
