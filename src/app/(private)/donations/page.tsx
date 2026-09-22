'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  QrCode,
  Building2,
  Phone,
  Mail,
  FileText,
  Save,
  Sparkles,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { useDonations } from '@/api/donations/use-donations';

const validationSchema = Yup.object().shape({
  pixKey: Yup.string().max(150, 'Máximo de 150 caracteres').nullable(),
  pixKeyType: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  pixReceiverName: Yup.string().max(150, 'Máximo de 150 caracteres').nullable(),
  pixReceiverCity: Yup.string().max(100, 'Máximo de 100 caracteres').nullable(),
  bankName: Yup.string().max(100, 'Máximo de 100 caracteres').nullable(),
  bankAgency: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  bankAccount: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  bankAccountType: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  bankCnpj: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  bankBeneficiary: Yup.string().max(150, 'Máximo de 150 caracteres').nullable(),
  receiptWhatsapp: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  receiptWhatsappUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  receiptEmail: Yup.string().email('E-mail inválido').nullable(),
  title: Yup.string().max(200, 'Máximo de 200 caracteres').nullable(),
  description: Yup.string().nullable(),
  pastoralCenterTitle: Yup.string().max(200, 'Máximo de 200 caracteres').nullable(),
  pastoralCenterDescription: Yup.string().nullable(),
});

export default function DonationsPage() {
  const { donations, isPending, isUpdating, updateDonations } = useDonations();

  const formik = useFormik({
    initialValues: {
      pixKey: donations?.pixKey || '',
      pixKeyType: donations?.pixKeyType || 'phone',
      pixReceiverName: donations?.pixReceiverName || '',
      pixReceiverCity: donations?.pixReceiverCity || '',
      bankName: donations?.bankName || '',
      bankAgency: donations?.bankAgency || '',
      bankAccount: donations?.bankAccount || '',
      bankAccountType: donations?.bankAccountType || 'Conta Corrente',
      bankCnpj: donations?.bankCnpj || '',
      bankBeneficiary: donations?.bankBeneficiary || '',
      receiptWhatsapp: donations?.receiptWhatsapp || '',
      receiptWhatsappUrl: donations?.receiptWhatsappUrl || '',
      receiptEmail: donations?.receiptEmail || '',
      title: donations?.title || '',
      description: donations?.description || '',
      pastoralCenterTitle: donations?.pastoralCenterTitle || '',
      pastoralCenterDescription: donations?.pastoralCenterDescription || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateDonations({
        pixKey: values.pixKey || null,
        pixKeyType: values.pixKeyType || null,
        pixReceiverName: values.pixReceiverName || null,
        pixReceiverCity: values.pixReceiverCity || null,
        bankName: values.bankName || null,
        bankAgency: values.bankAgency || null,
        bankAccount: values.bankAccount || null,
        bankAccountType: values.bankAccountType || null,
        bankCnpj: values.bankCnpj || null,
        bankBeneficiary: values.bankBeneficiary || null,
        receiptWhatsapp: values.receiptWhatsapp || null,
        receiptWhatsappUrl: values.receiptWhatsappUrl || null,
        receiptEmail: values.receiptEmail || null,
        title: values.title || null,
        description: values.description || null,
        pastoralCenterTitle: values.pastoralCenterTitle || null,
        pastoralCenterDescription: values.pastoralCenterDescription || null,
      });
    },
  });

  return (
    <div className="w-full lg:col-start-2 min-h-screen flex flex-col bg-zinc-50/40">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="mx-auto w-full max-w-4xl px-4 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
              <Heart className="w-6 h-6 fill-[#B8872E]/20 text-[#B8872E]" />
            </div>
            <div>
              <TypographyH1>Quero Contribuir</TypographyH1>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                Gerencie as chaves PIX, contas bancárias para transferência e dados de arrecadação
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={isUpdating || isPending}
            className="bg-[#18351E] hover:bg-[#23472b] text-white gap-2 shrink-0 min-w-36 h-10 shadow-xs cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Spinner className="w-4 h-4" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl px-4 py-8 mx-auto lg:px-8 flex-1">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner className="w-8 h-8 text-[#B8872E]" />
            <span className="text-sm text-zinc-500 font-medium">Carregando dados de doações...</span>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
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
                    />
                  </InputRoot>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
                    Link Direto WhatsApp
                  </label>
                  <InputRoot error={formik.errors.receiptWhatsappUrl} touched={formik.touched.receiptWhatsappUrl}>
                    <InputControl
                      name="receiptWhatsappUrl"
                      value={formik.values.receiptWhatsappUrl || ''}
                      onChange={formik.handleChange}
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
                    className="min-h-[90px] text-sm"
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
                    className="min-h-[100px] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end pt-4 pb-12 border-t border-zinc-200">
              <Button
                type="submit"
                size="lg"
                disabled={isUpdating || isPending}
                className="bg-[#18351E] hover:bg-[#23472b] text-white min-w-44 h-11 text-sm shadow-md cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
