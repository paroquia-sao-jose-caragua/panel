import { api } from '../utils/api';
import type { Announcement } from '@/entities/announcement';

export async function listAnnouncements() {
  return api<{ announcements: Announcement[] }>('/announcements');
}

export async function createAnnouncement(payload: {
  badgeText?: string | null;
  title: string;
  description: string;
  actionText?: string | null;
  actionUrl?: string | null;
  coverDesktopId: string;
  coverTabletId?: string | null;
  coverMobileId?: string | null;
  active?: boolean;
}) {
  return api<{ announcement: Announcement }>('/announcements', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function editAnnouncement(
  id: string,
  payload: {
    badgeText?: string | null;
    title: string;
    description: string;
    actionText?: string | null;
    actionUrl?: string | null;
    coverDesktopId: string;
    coverTabletId?: string | null;
    coverMobileId?: string | null;
    active?: boolean;
  }
) {
  return api<{ announcement: Announcement }>(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteAnnouncement(id: string) {
  return api<{ message: string }>(`/announcements/${id}`, {
    method: 'DELETE',
  });
}

export async function reorderAnnouncements(orderedIds: string[]) {
  return api<{ message: string }>('/announcements/reorder', {
    method: 'PUT',
    body: JSON.stringify({ orderedIds }),
  });
}
