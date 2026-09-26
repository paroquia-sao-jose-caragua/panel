export interface DonationsInfo {
  id: string;
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
  updatedAt?: string | null;
  createdAt?: string;
}
