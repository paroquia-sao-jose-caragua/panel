'use client';

import { useEffect, useState } from 'react';
import { Bell, Download, X } from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import { subscribePushNotification } from '@/api/push-subscriptions';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DEFAULT_VAPID_PUBLIC_KEY = process.env
  .NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function areKeysEqual(
  buf1: ArrayBuffer | null | undefined,
  buf2: Uint8Array
): boolean {
  if (!buf1) return false;
  const a = new Uint8Array(buf1);
  if (a.length !== buf2.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== buf2[i]) return false;
  }
  return true;
}

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  const STORAGE_KEY = 'paroquia_push_device_id';
  let deviceId = localStorage.getItem(STORAGE_KEY);
  if (!deviceId) {
    deviceId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  return deviceId;
}

export function PwaNotificationManager() {
  const { user, isLogged } = useAuthStore();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >('unsupported');
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Navegador';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';

    let os = 'Web';
    if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';

    return `${browser} no ${os}`;
  };

  const sendSubscriptionToApi = async (subscription: PushSubscription) => {
    // Só registra a inscrição do painel após o login para garantir a identificação do usuário
    if (!isLogged || !user?.id) {
      return;
    }

    const subJson = subscription.toJSON();
    const p256dh = subJson.keys?.p256dh;
    const auth = subJson.keys?.auth;

    if (!p256dh || !auth) {
      console.error(
        'Inscrição Push no Painel incompleta: chaves p256dh ou auth ausentes.'
      );
      return;
    }

    const userNameToSave = user.name || `Usuário Painel (${getDeviceInfo()})`;

    try {
      await subscribePushNotification({
        userName: userNameToSave,
        userId: user.id,
        origin: 'panel',
        deviceId: getOrCreateDeviceId(),
        deviceInfo: getDeviceInfo(),
        endpoint: subscription.endpoint,
        keys: { p256dh, auth },
      });
      console.log(
        'Inscrição do painel salva com sucesso na API para o usuário:',
        user.id
      );
    } catch (err) {
      console.error(
        'Falha ao comunicar com a API de notificações do painel:',
        err
      );
    }
  };

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service Worker Painel registrado:', reg.scope);
        })
        .catch((err) => {
          console.error('Erro ao registrar Service Worker do Painel:', err);
        });
    }

    // 2. Notification Permission Check
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // 3. PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      const dismissed = localStorage.getItem('panel_pwa_install_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Auto-sync subscription if notification permission is already granted AND user is logged in
  useEffect(() => {
    if (!isLogged || !user?.id) {
      return;
    }

    if (
      'Notification' in window &&
      Notification.permission === 'granted' &&
      'serviceWorker' in navigator
    ) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const applicationServerKey = urlBase64ToUint8Array(
          DEFAULT_VAPID_PUBLIC_KEY
        );

        let subscription = await registration.pushManager.getSubscription();

        // Se o aparelho já estava inscrito, mas com chave VAPID antiga/diferente, renova automaticamente
        if (subscription) {
          const currentKey = subscription.options?.applicationServerKey;
          const hasKeyMismatch =
            currentKey && !areKeysEqual(currentKey, applicationServerKey);
          const storedKey = localStorage.getItem('paroquia_panel_push_vapid_key');
          const needsRenewal =
            hasKeyMismatch || (storedKey && storedKey !== DEFAULT_VAPID_PUBLIC_KEY);

          if (needsRenewal) {
            try {
              await subscription.unsubscribe();
              subscription = null;
            } catch (err) {
              console.error('Erro ao cancelar inscrição push antiga no painel:', err);
            }
          }
        }

        if (!subscription) {
          subscription = await registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey,
            })
            .catch((err) => {
              console.error(
                'Erro ao obter inscrição push automática no painel:',
                err
              );
              return null;
            });
        }

        if (subscription) {
          localStorage.setItem('paroquia_panel_push_vapid_key', DEFAULT_VAPID_PUBLIC_KEY);
          await sendSubscriptionToApi(subscription);
        }
      });
    }
  }, [isLogged, user?.id]);

  // Determine if notification banner should show (Only if install banner is NOT active AND user is logged in)
  useEffect(() => {
    if (!isLogged || !user?.id) {
      setShowNotificationBanner(false);
      return;
    }

    if (!showInstallBanner && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const dismissed = localStorage.getItem('panel_pwa_notif_dismissed');
        if (!dismissed) {
          setShowNotificationBanner(true);
        }
      }
    }
  }, [showInstallBanner, isLogged, user?.id]);

  const isStandaloneMode = () => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    );
  };

  const handleInstallClick = async () => {
    if (isStandaloneMode()) {
      console.log('Painel já está no modo aplicativo instalado.');
      return;
    }

    if (!deferredPrompt) {
      const ua = navigator.userAgent;
      if (ua.includes('iPhone') || ua.includes('iPad')) {
        alert(
          "Para instalar o Painel no iOS: toque no botão de Compartilhar ⎋ no Safari e selecione 'Adicionar à Tela de Início' ➕."
        );
      } else if (
        ua.includes('Mac') &&
        ua.includes('Safari') &&
        !ua.includes('Chrome')
      ) {
        alert(
          'Para instalar o Painel no Safari do Mac: no menu superior, clique em Arquivo > Adicionar ao Dock.'
        );
      } else {
        alert(
          'Para instalar o Painel: clique no ícone ⊕ na barra de endereço (canto superior direito) ou no menu do navegador (⋮) > Instalar Aplicativo.'
        );
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA do Painel instalado.');
      }
    } catch (err) {
      console.error('Erro ao abrir instalador PWA do painel:', err);
    } finally {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      localStorage.setItem('panel_pwa_install_dismissed', 'true');
    }
  };

  const handleRequestNotification = async () => {
    if (!isLogged || !user?.id) return;
    if (!('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowNotificationBanner(false);

      if (permission === 'granted' && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const applicationServerKey = urlBase64ToUint8Array(
          DEFAULT_VAPID_PUBLIC_KEY
        );

        let subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          const currentKey = subscription.options?.applicationServerKey;
          const hasKeyMismatch =
            currentKey && !areKeysEqual(currentKey, applicationServerKey);
          const storedKey = localStorage.getItem('paroquia_panel_push_vapid_key');
          const needsRenewal =
            hasKeyMismatch || (storedKey && storedKey !== DEFAULT_VAPID_PUBLIC_KEY);

          if (needsRenewal) {
            try {
              await subscription.unsubscribe();
              subscription = null;
            } catch (err) {
              console.error('Erro ao cancelar inscrição push antiga no painel:', err);
            }
          }
        }

        if (!subscription) {
          subscription = await registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey,
            })
            .catch((err) => {
              console.error('Erro ao solicitar inscrição push no painel:', err);
              return null;
            });
        }

        if (subscription) {
          localStorage.setItem('paroquia_panel_push_vapid_key', DEFAULT_VAPID_PUBLIC_KEY);
          await sendSubscriptionToApi(subscription);
        }

        registration.showNotification('Painel Paróquia São José', {
          body: `Olá ${user?.name || ''}, notificações administrativas ativadas!`,
          icon: '/icons/icon-192x192.png',
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar notificações no painel:', error);
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('panel_pwa_install_dismissed', 'true');
  };

  const dismissNotificationBanner = () => {
    setShowNotificationBanner(false);
    localStorage.setItem('panel_pwa_notif_dismissed', 'true');
  };

  return (
    <>
      {/* PWA Install Banner (Priority 1) */}
      {showInstallBanner && deferredPrompt ? (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-lg bg-zinc-800 p-2 text-amber-500 shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-zinc-100">
                Instalar App do Painel
              </h4>
              <p className="mt-1 text-xs text-zinc-400">
                Instale o painel como aplicativo no desktop ou celular para
                acesso rápido.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500 active:scale-95 cursor-pointer"
                >
                  Instalar Painel
                </button>
                <button
                  type="button"
                  onClick={dismissInstallBanner}
                  className="rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Depois
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissInstallBanner}
              className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : showNotificationBanner && notificationPermission === 'default' ? (
        /* Push Notification Banner (Priority 2) */
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-lg bg-zinc-800 p-2 text-amber-500 shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-zinc-100">
                Notificações do Painel
              </h4>
              <p className="mt-1 text-xs text-zinc-400">
                Receba alertas em tempo real sobre agendamentos, novos eventos e
                avisos.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRequestNotification}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-100 border border-zinc-600 hover:bg-zinc-700 active:scale-95 cursor-pointer"
                >
                  Ativar Alertas
                </button>
                <button
                  type="button"
                  onClick={dismissNotificationBanner}
                  className="rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Agora Não
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissNotificationBanner}
              className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
