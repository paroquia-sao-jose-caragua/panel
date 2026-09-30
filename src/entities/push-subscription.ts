export type PushSubscriptionEntity = {
  id: string;
  userName?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  origin: 'site' | 'panel';
  deviceInfo?: string | null;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: string;
  updatedAt: string;
};
