import type { UrgentAlert, UrgentAlertVariant } from '@/entities/urgent-alert';
import { api } from '../utils/api';

export interface UpdateUrgentAlertPayload {
  active: boolean;
  text: string;
  variant: UrgentAlertVariant;
  startsAt?: string | null;
  endsAt?: string | null;
  hasModal: boolean;
  modalButtonText?: string | null;
  modalTitle?: string | null;
  modalDescription?: string | null;
  modalImageId?: string | null;
  modalActionText?: string | null;
  modalActionUrl?: string | null;
}

interface UpdateUrgentAlertResponse {
  alert: UrgentAlert;
}

export const updateUrgentAlert = async (payload: UpdateUrgentAlertPayload) => {
  const result = await api<UpdateUrgentAlertResponse>('/urgent-alert', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return result;
};
