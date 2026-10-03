import { api } from '../utils/api';
import type { PushSubscriptionEntity } from '@/entities/push-subscription';

export async function listPushSubscriptions(origin?: 'site' | 'panel') {
  const query = origin ? `?origin=${origin}` : '';
  return api<{ subscriptions: PushSubscriptionEntity[] }>(
    `/push-subscriptions${query}`
  );
}

export async function deletePushSubscription(id: string) {
  return api<{ success: boolean }>(`/push-subscriptions/${id}`, {
    method: 'DELETE',
  });
}

export async function sendTestPushNotification(payload: {
  title: string;
  body: string;
  url?: string;
  targetId?: string;
  targetOrigin?: 'site' | 'panel';
}) {
  return api<{ sentCount: number; failedCount: number }>(
    '/push-subscriptions/test',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

export async function subscribePushNotification(data: {
  userName?: string | null;
  userId?: string | null;
  origin: 'site' | 'panel';
  deviceId?: string | null;
  deviceInfo?: string | null;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}) {
  return api<{ subscription: PushSubscriptionEntity }>('/push-subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
