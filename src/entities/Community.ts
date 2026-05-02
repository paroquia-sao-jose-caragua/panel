export type Community = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  type: 'parish_church' | 'chapel';
  address: string;
  coverId: string;
  coverUrl: string;
};
