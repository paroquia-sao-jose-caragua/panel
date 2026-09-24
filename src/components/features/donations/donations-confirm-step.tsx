'use client';

import React from 'react';
import { TypographyH2 } from '@/components/ui/typography/h2';
import {
  Check,
  QrCode,
  Building2,
  FileText,
  MessageCircle,
  Mail,
} from 'lucide-react';
import type { DonationsFormValues } from './donations-form-step';

interface DonationsConfirmStepProps {
  values: DonationsFormValues;
}

function getPixKeyTypeLabel(type: string) {
  switch (type) {
    case 'phone':
      return 'Telefone / Celular';
    case 'cnpj':
      return 'CNPJ';
    case 'email':
      return 'E-mail';
    case 'random':
      return 'Chave Aleatória (EVP)';
    default:
      return type;
  }
}

export const DonationsConfirmStep = ({ values }: DonationsConfirmStepProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 sm:py-8 flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-700">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <TypographyH2 className="text-center">Confirmação</TypographyH2>
          <p className="text-center text-zinc-600 mt-2 text-sm">
            Revise as informações de PIX, dados bancários e mensagens antes de salvar.
          </p>
        </div>

        <div className="w-full max-w-2xl divide-y divide-divider mt-2">
          {/* 1. Dados do PIX */}
          <div className="py-4 space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Dados do PIX
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <QrCode className="w-4 h-4 text-[#B8872E] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Chave PIX</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.pixKey || <span className="text-zinc-400 font-normal italic">Não informada</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Tipo de Chave</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {getPixKeyTypeLabel(values.pixKeyType)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Nome do Titular</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.pixReceiverName || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Cidade do Titular</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.pixReceiverCity || <span className="text-zinc-400 font-normal italic">Não informada</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Dados Bancários */}
          <div className="py-4 space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Dados Bancários (TED / DOC)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[11px] text-zinc-400 block font-medium">Banco</span>
                <span className="font-semibold text-zinc-900 truncate block">
                  {values.bankName || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[11px] text-zinc-400 block font-medium">Agência</span>
                <span className="font-semibold text-zinc-900 truncate block">
                  {values.bankAgency || <span className="text-zinc-400 font-normal italic">Não informada</span>}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[11px] text-zinc-400 block font-medium">Conta Corrente</span>
                <span className="font-semibold text-zinc-900 truncate block">
                  {values.bankAccount || <span className="text-zinc-400 font-normal italic">Não informada</span>}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[11px] text-zinc-400 block font-medium">Tipo de Conta</span>
                <span className="font-semibold text-zinc-900 truncate block">
                  {values.bankAccountType || 'Conta Corrente'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[11px] text-zinc-400 block font-medium">CNPJ</span>
                <span className="font-semibold text-zinc-900 truncate block">
                  {values.bankCnpj || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[11px] text-zinc-400 block font-medium">Beneficiário</span>
                <span className="font-semibold text-zinc-900 truncate block">
                  {values.bankBeneficiary || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Envio de Comprovante */}
          <div className="py-4 space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Envio de Comprovante
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">WhatsApp</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.receiptWhatsapp || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Mail className="w-4 h-4 text-[#B8872E] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">E-mail</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.receiptEmail || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              {values.receiptWhatsappUrl && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] text-zinc-400 block font-medium">Link WhatsApp Direto</span>
                  <span className="text-xs text-zinc-700 truncate block font-mono">
                    {values.receiptWhatsappUrl}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Textos da Página */}
          <div className="py-4 space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Textos e Mensagens da Página
            </span>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                <span className="text-[11px] text-zinc-400 block font-medium">Título Principal</span>
                <span className="font-semibold text-zinc-900 block">
                  {values.title || <span className="text-zinc-400 font-normal italic">Padrão da página</span>}
                </span>
                {values.description && (
                  <p className="text-xs text-zinc-600 mt-1 whitespace-pre-line leading-relaxed">
                    {values.description}
                  </p>
                )}
              </div>

              {(values.pastoralCenterTitle || values.pastoralCenterDescription) && (
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Centro Pastoral e Obras</span>
                  <span className="font-semibold text-zinc-900 block">
                    {values.pastoralCenterTitle || 'Obras do Centro Pastoral'}
                  </span>
                  {values.pastoralCenterDescription && (
                    <p className="text-xs text-zinc-600 mt-1 whitespace-pre-line leading-relaxed">
                      {values.pastoralCenterDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
