import type { ParishContact } from '@/entities/ParishContact';
import { api } from '../utils/api';

interface UpdateParishContactResponse {
  contact: ParishContact;
}

export interface UpdateParishContactParams {
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  officeHours?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  whatsappUrl?: string | null;
}

export const updateParishContact = async (data: UpdateParishContactParams) => {
  const result = await api<UpdateParishContactResponse>('/parish-contact', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return result;
};
