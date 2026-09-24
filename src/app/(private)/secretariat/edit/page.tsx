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
import { useParishContact } from '@/api/parish-contact/use-parish-contact';
import {
  SecretariatFormStep,
  type SecretariatFormValues,
} from '@/components/features/secretariat/secretariat-form-step';
import { SecretariatConfirmStep } from '@/components/features/secretariat/secretariat-confirm-step';

const validationSchema = Yup.object().shape({
  phone: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  whatsapp: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  email: Yup.string().email('E-mail inválido').nullable(),
  address: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  officeHours: Yup.string().nullable(),
  instagramUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  youtubeUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  facebookUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  whatsappUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
});

export default function EditSecretariatPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const { contact, isPending, isUpdating, updateContact } = useParishContact();

  const formik = useFormik<SecretariatFormValues>({
    initialValues: {
      phone: contact?.phone || '',
      whatsapp: contact?.whatsapp || '',
      email: contact?.email || '',
      address: contact?.address || '',
      officeHours: contact?.officeHours || '',
      instagramUrl: contact?.instagramUrl || '',
      youtubeUrl: contact?.youtubeUrl || '',
      facebookUrl: contact?.facebookUrl || '',
      whatsappUrl: contact?.whatsappUrl || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateContact(
        {
          phone: values.phone || null,
          whatsapp: values.whatsapp || null,
          email: values.email || null,
          address: values.address || null,
          officeHours: values.officeHours || null,
          instagramUrl: values.instagramUrl || null,
          youtubeUrl: values.youtubeUrl || null,
          facebookUrl: values.facebookUrl || null,
          whatsappUrl: values.whatsappUrl || null,
        },
        {
          onSuccess: () => {
            router.push('/secretariat');
          },
        }
      );
    },
  });

  const handleNextStep = useCallback(async () => {
    const errors = await formik.validateForm();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      formik.setTouched({
        phone: true,
        whatsapp: true,
        email: true,
        address: true,
        officeHours: true,
        instagramUrl: true,
        youtubeUrl: true,
        facebookUrl: true,
        whatsappUrl: true,
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
          <BackButton href="/secretariat" />

          <div className="flex flex-row items-center gap-4 mt-1">
            <div>
              <TypographyH1>Editar Contato e Secretaria</TypographyH1>
              <span className="text-xs sm:text-sm text-zinc-500 font-medium">
                Atualize os canais de atendimento, horários de expediente e redes sociais
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
              Carregando informações da secretaria...
            </span>
          </div>
        ) : (
          <>
            {activeStep === 1 && (
              <>
                <SecretariatFormStep formik={formik} />

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-zinc-200">
                  <Link href="/secretariat">
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
                <SecretariatConfirmStep values={formik.values} />

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
