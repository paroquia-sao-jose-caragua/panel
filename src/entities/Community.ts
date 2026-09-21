export type CommunityPhoto = {
  id: string;
  communityId?: string;
  photoId: string;
  photoUrl?: string;
  caption?: string | null;
  orderIndex?: number;
  createdAt?: string;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  type: 'parish_church' | 'chapel';
  address: string;
  coverId: string;
  coverUrl?: string;
  heroSubtitle?: string | null;
  aboutTitle?: string | null;
  aboutDescription?: string | null;
  historySummary?: string | null;
  patronName?: string | null;
  patronDescription?: string | null;
  patronPhotoId?: string | null;
  patronPhotoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  officeHours?: string | null;
  photos?: CommunityPhoto[];
};

