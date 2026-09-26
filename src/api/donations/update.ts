import type { DonationsInfo } from '@/entities/DonationsInfo';
import { api } from '../utils/api';

export interface UpdateDonationsInfoPayload {
  pixKey?: string | null;
  pixKeyType?: string | null;
  pixReceiverName?: string | null;
  pixReceiverCity?: string | null;
  bankName?: string | null;
  bankAgency?: string | null;
  bankAccount?: string | null;
  bankAccountType?: string | null;
  bankCnpj?: string | null;
  bankBeneficiary?: string | null;
  receiptWhatsapp?: string | null;
  receiptWhatsappUrl?: string | null;
  receiptEmail?: string | null;
  title?: string | null;
  description?: string | null;
  pastoralCenterTitle?: string | null;
  pastoralCenterDescription?: string | null;
}

interface UpdateDonationsInfoResponse {
  donations: DonationsInfo;
}

export const updateDonationsInfo = async (payload: UpdateDonationsInfoPayload) => {
  const result = await api<UpdateDonationsInfoResponse>('/donations', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return result;
};
