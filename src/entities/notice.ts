export type NoticeVariant = 'alert' | 'info' | 'solemnity';

export type Notice = {
  id: string;
  title: string;
  summary?: string | null;
  description: string;
  variant: NoticeVariant;
  imageId?: string | null;
  actionText?: string | null;
  actionUrl?: string | null;
  pinned: boolean;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};
