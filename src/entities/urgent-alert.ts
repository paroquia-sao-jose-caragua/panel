export type UrgentAlertVariant = 'alert' | 'info' | 'solemnity';

export interface UrgentAlert {
  id: string;
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
  createdAt?: string;
  updatedAt?: string | null;
}
