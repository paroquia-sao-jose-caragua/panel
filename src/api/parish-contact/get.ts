import type { ParishContact } from '@/entities/ParishContact';
import { api } from '../utils/api';

interface GetParishContactResponse {
  contact: ParishContact;
}

export const getParishContact = async () => {
  const result = await api<GetParishContactResponse>('/parish-contact');

  return result;
};
