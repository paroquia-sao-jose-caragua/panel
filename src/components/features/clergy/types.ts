import type { ClergyPosition } from '@/entities/Clergy';

export interface ClergyFormValues {
  name: string;
  title: string;
  position: ClergyPosition;
  roleName: string;
  shortIntro: string;
  bio: string;
  orderIndex: number;
  isMain: boolean;
  photoId: string | null;
  photoUrl?: string | null;
}
