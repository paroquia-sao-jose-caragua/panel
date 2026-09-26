export type ClergyPosition =
  | 'supreme_pontiff'
  | 'diocesan_bishop'
  | 'parish_priest'
  | 'permanent_deacon'
  | 'vicar'
  | 'other';

export interface Clergy {
  id: string;
  title?: string | null;
  name: string;
  slug: string;
  position: ClergyPosition;
  roleName?: string | null;
  shortIntro?: string | null;
  bio?: string | null;
  orderIndex?: number;
  isMain?: boolean;
  photoId?: string | null;
  photoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}
