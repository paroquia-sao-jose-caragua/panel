export type Announcement = {
  id: string;
  badgeText?: string | null;
  title: string;
  description: string;
  actionText?: string | null;
  actionUrl?: string | null;
  coverDesktopId: string;
  coverTabletId?: string | null;
  coverMobileId?: string | null;
  sortOrder: number;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};
