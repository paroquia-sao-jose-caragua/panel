import { api } from '../utils/api';
import type { Notice, NoticeVariant } from '@/entities/notice';

export type NoticePayload = {
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
};

export async function listNotices() {
  return api<{ notices: Notice[] }>('/notices');
}

export async function getNotice(id: string) {
  return api<{ notice: Notice }>(`/notices/${id}`);
}

export async function createNotice(payload: NoticePayload) {
  return api<{ notice: Notice }>('/notices', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function editNotice(id: string, payload: NoticePayload) {
  return api<{ notice: Notice }>(`/notices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteNotice(id: string) {
  return api<{ message: string }>(`/notices/${id}`, {
    method: 'DELETE',
  });
}
