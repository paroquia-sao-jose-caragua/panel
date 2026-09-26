'use client';

import React from 'react';
import type { FormikProps } from 'formik';
import {
  QrCode,
  Building2,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';

export interface DonationsFormValues {
  pixKey: string;
  pixKeyType: string;
  pixReceiverName: string;
  pixReceiverCity: string;
  bankName: string;
  bankAgency: string;
  bankAccount: string;
  bankAccountType: string;
  bankCnpj: string;
  bankBeneficiary: string;
  receiptWhatsapp: string;
  receiptWhatsappUrl: string;
  receiptEmail: string;
  title: string;
  description: string;
  pastoralCenterTitle: string;
  pastoralCenterDescription: string;
}

interface DonationsFormStepProps {
  formik: FormikProps<DonationsFormValues>;
}

export const DonationsFormStep = ({ formik }: DonationsFormStepProps) => {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Dados do PIX */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <QrCode className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Dados do PIX
            </h2>
            <p className="text-xs text-zinc-500">
              Chave PIX e identificação do recebedor para geração do QR Code e Copia e Cola
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Chave PIX
            </label>
            <InputRoot error={formik.errors.pixKey} touched={formik.touched.pixKey}>
              <InputControl
                name="pixKey"
                value={formik.values.pixKey || ''}
                onChange={formik.handleChange}
                placeholder="Ex: (12) 99999-0000 ou CNPJ"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Tipo de Chave
            </label>
            <select
              name="pixKeyType"
              value={formik.values.pixKeyType || 'phone'}
              onChange={formik.handleChange}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-800 focus:border-[#B8872E] outline-none"
            >
              <option value="phone">Telefone / Celular</option>
              <option value="cnpj">CNPJ</option>
              <option value="email">E-mail</option>
              <option value="random">Chave Aleatória (EVP)</option>
            </select>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Nome do Titular / Recebedor
            </label>
            <InputRoot error={formik.errors.pixReceiverName} touched={formik.touched.pixReceiverName}>
              <InputControl
                name="pixReceiverName"
                value={formik.values.pixReceiverName || ''}
                onChange={formik.handleChange}
                placeholder="Ex: Paróquia São José de Caraguatatuba"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Cidade do Titular
            </label>
            <InputRoot error={formik.errors.pixReceiverCity} touched={formik.touched.pixReceiverCity}>
              <InputControl
                name="pixReceiverCity"
                value={formik.values.pixReceiverCity || ''}
                onChange={formik.handleChange}
                placeholder="Ex: Caraguatatuba"
              />
            </InputRoot>
          </div>
        </div>
      </div>

      {/* 2. Dados Bancários para Transferência */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <Building2 className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Dados Bancários e Transferência (TED / DOC)
            </h2>
            <p className="text-xs text-zinc-500">
              Informações da conta corrente da paróquia para doações e dízimo por transferência
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Banco
            </label>
            <InputRoot error={formik.errors.bankName} touched={formik.touched.bankName}>
              <InputControl
                name="bankName"
                value={formik.values.bankName || ''}
                onChange={formik.handleChange}
                placeholder="Ex: Banco Bradesco (237)"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Agência
            </label>
            <InputRoot error={formik.errors.bankAgency} touched={formik.touched.bankAgency}>
              <InputControl
                name="bankAgency"
                value={formik.values.bankAgency || ''}
                onChange={formik.handleChange}
                placeholder="Ex: 0001-9"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Conta Corrente
            </label>
            <InputRoot error={formik.errors.bankAccount} touched={formik.touched.bankAccount}>
              <InputControl
                name="bankAccount"
                value={formik.values.bankAccount || ''}
                onChange={formik.handleChange}
                placeholder="Ex: 12345-6"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Tipo de Conta
            </label>
            <InputRoot error={formik.errors.bankAccountType} touched={formik.touched.bankAccountType}>
              <InputControl
                name="bankAccountType"
                value={formik.values.bankAccountType || ''}
                onChange={formik.handleChange}
                placeholder="Ex: Conta Corrente"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              CNPJ da Conta
            </label>
            <InputRoot error={formik.errors.bankCnpj} touched={formik.touched.bankCnpj}>
              <InputControl
                name="bankCnpj"
                value={formik.values.bankCnpj || ''}
                onChange={formik.handleChange}
                placeholder="Ex: 00.000.000/0001-00"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Razão Social / Beneficiário
            </label>
            <InputRoot error={formik.errors.bankBeneficiary} touched={formik.touched.bankBeneficiary}>
              <InputControl
                name="bankBeneficiary"
                value={formik.values.bankBeneficiary || ''}
                onChange={formik.handleChange}
                placeholder="Ex: Mitra Diocesana de Caraguatatuba"
              />
            </InputRoot>
          </div>
        </div>
      </div>

      {/* 3. Envio de Comprovante */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <MessageCircle className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Envio de Comprovante
            </h2>
            <p className="text-xs text-zinc-500">
              Canais para os fiéis enviarem o comprovante de contribuição ou identificação do dízimo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              WhatsApp para Comprovante
            </label>
            <InputRoot error={formik.errors.receiptWhatsapp} touched={formik.touched.receiptWhatsapp}>
              <InputControl
                name="receiptWhatsapp"
                value={formik.values.receiptWhatsapp || ''}
                onChange={formik.handleChange}
                placeholder="Ex: (12) 99999-0000"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Link Direto WhatsApp (wa.me)
            </label>
            <InputRoot error={formik.errors.receiptWhatsappUrl} touched={formik.touched.receiptWhatsappUrl}>
              <InputControl
                name="receiptWhatsappUrl"
                value={formik.values.receiptWhatsappUrl || ''}
                onChange={formik.handleChange}
                placeholder="https://wa.me/5512999990000"
              />
            </InputRoot>
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              E-mail para Comprovante (Opcional)
            </label>
            <InputRoot error={formik.errors.receiptEmail} touched={formik.touched.receiptEmail}>
              <InputControl
                name="receiptEmail"
                type="email"
                value={formik.values.receiptEmail || ''}
                onChange={formik.handleChange}
                placeholder="Ex: dizimo@paroquiasaojosecaragua.com.br"
              />
            </InputRoot>
          </div>
        </div>
      </div>

      {/* 4. Textos da Página de Contribuição */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <FileText className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Textos e Obras Sociais
            </h2>
            <p className="text-xs text-zinc-500">
              Mensagens de acolhida e descrição do Centro Pastoral e obras comunitárias
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Título Principal da Página
            </label>
            <InputRoot error={formik.errors.title} touched={formik.touched.title}>
              <InputControl
                name="title"
                value={formik.values.title || ''}
                onChange={formik.handleChange}
                placeholder="Ex: Sua generosidade transforma vidas e sustenta a evangelização"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Descrição / Mensagem Pastoral
            </label>
            <Textarea
              name="description"
              value={formik.values.description || ''}
              onChange={formik.handleChange}
              placeholder="Mensagem explicando o valor do dízimo, da oferta e da solidariedade comunitária..."
              className="min-h-[100px] text-sm"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Título da Seção de Obras / Centro Pastoral
            </label>
            <InputRoot error={formik.errors.pastoralCenterTitle} touched={formik.touched.pastoralCenterTitle}>
              <InputControl
                name="pastoralCenterTitle"
                value={formik.values.pastoralCenterTitle || ''}
                onChange={formik.handleChange}
                placeholder="Ex: Obras do Centro Pastoral Paroquial"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Descrição do Centro Pastoral
            </label>
            <Textarea
              name="pastoralCenterDescription"
              value={formik.values.pastoralCenterDescription || ''}
              onChange={formik.handleChange}
              placeholder="Detalhes sobre a construção, reformas ou manutenções sustentadas pelo dízimo..."
              className="min-h-[110px] text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
