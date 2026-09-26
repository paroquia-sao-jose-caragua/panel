'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { Save } from 'lucide-react';
import { useDonations } from '@/api/donations/use-donations';
import {
  DonationsFormStep,
  type DonationsFormValues,
} from '@/components/features/donations/donations-form-step';
import { DonationsConfirmStep } from '@/components/features/donations/donations-confirm-step';

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

export default function EditDonationsPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const { donations, isPending, isUpdating, updateDonations } = useDonations();

  const formik = useFormik<DonationsFormValues>({
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
    onSubmit: async (values) => {
      try {
        const response = await updateDonations({
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
        if (response.statusCode === 200) {
          router.push('/secretaria');
        }
      } catch {
        // Error handled in useDonations
      }
    },
  });

  const handleNextStep = useCallback(async () => {
    const errors = await formik.validateForm();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      formik.setTouched({
        pixKey: true,
        pixKeyType: true,
        pixReceiverName: true,
        pixReceiverCity: true,
        bankName: true,
        bankAgency: true,
        bankAccount: true,
        bankAccountType: true,
        bankCnpj: true,
        bankBeneficiary: true,
        receiptWhatsapp: true,
        receiptWhatsappUrl: true,
        receiptEmail: true,
        title: true,
        description: true,
        pastoralCenterTitle: true,
        pastoralCenterDescription: true,
      });
      return;
    }

    setActiveStep(2);
  }, [formik]);

  const handlePrevStep = useCallback(() => {
    setActiveStep(1);
  }, []);

  return (
    <div className="w-full lg:col-start-2 min-h-screen flex flex-col bg-zinc-50/40">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="mx-auto w-full max-w-4xl px-4 lg:px-8 py-4">
          <BackButton href="/secretaria" />

          <div className="flex flex-row items-center gap-4 mt-1">
            <div>
              <TypographyH1>Editar Quero Contribuir</TypographyH1>
              <span className="text-xs sm:text-sm text-zinc-500 font-medium">
                Atualize os dados de PIX, contas bancárias, envio de comprovantes e textos informativos
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stepper Bar */}
        <div className="flex flex-row items-center justify-center sm:justify-start gap-4 sm:gap-8 mx-auto w-full max-w-4xl px-4 lg:px-8 py-3.5">
          <Step
            variant={activeStep === 1 ? 'default' : 'completed'}
            step={1}
            label="Informações"
          />
          <Separator className="flex-1 max-w-16 sm:max-w-20" />
          <Step
            variant={activeStep === 1 ? 'pending' : 'default'}
            step={2}
            label="Confirmação"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl px-4 py-8 mx-auto lg:px-8 flex-1">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner className="w-8 h-8 text-[#B8872E]" />
            <span className="text-sm text-zinc-500 font-medium">
              Carregando dados de doações...
            </span>
          </div>
        ) : (
          <>
            {activeStep === 1 && (
              <>
                <DonationsFormStep formik={formik} />

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-zinc-200">
                  <Link href="/secretaria">
                    <Button variant="outline" size="lg">
                      Cancelar
                    </Button>
                  </Link>

                  <Button size="lg" onClick={handleNextStep}>
                    Continuar para Confirmação
                  </Button>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <DonationsConfirmStep values={formik.values} />

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-zinc-200">
                  <Button variant="outline" size="lg" onClick={handlePrevStep}>
                    Voltar
                  </Button>

                  <Button
                    size="lg"
                    isLoading={isUpdating}
                    loadingText="Salvando..."
                    disabled={isPending}
                    onClick={() => formik.handleSubmit()}
                    className="min-w-44 shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <span>Salvar Alterações</span>
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
