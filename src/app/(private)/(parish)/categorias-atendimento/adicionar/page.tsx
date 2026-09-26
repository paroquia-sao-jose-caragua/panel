'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { ServiceInfoStep } from '@/components/features/appointment-services/service-info-step';
import { ServiceConfirmStep } from '@/components/features/appointment-services/service-confirm-step';
import type { AppointmentServiceFormValues } from '@/components/features/appointment-services/types';
import { useAppointmentServices } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

export default function AddAppointmentServicePage() {
  const router = useRouter();
  const { saveService, isSaving } = useAppointmentServices();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<AppointmentServiceFormValues>({
    title: '',
    category: 'clergy_sacramental',
    description: '',
    defaultDurationMinutes: 30,
    requiresAddress: false,
    active: true,
  });

  const handleChange = useCallback(
    <K extends keyof AppointmentServiceFormValues>(
      field: K,
      value: AppointmentServiceFormValues[K]
    ) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const handleNextStep = useCallback(() => {
    if (activeStep === 1) {
      const newErrors: Record<string, string> = {};
      if (!values.title.trim()) {
        newErrors.title = 'Nome da categoria é obrigatório';
      }
      if (!values.category) {
        newErrors.category = 'Selecione uma natureza';
      }
      if (!values.defaultDurationMinutes || values.defaultDurationMinutes < 5) {
        newErrors.defaultDurationMinutes = 'Duração mínima é de 5 minutos';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setActiveStep(2);
    }
  }, [activeStep, values]);

  const handlePrevStep = useCallback(() => {
    setActiveStep((prev) => Math.max(1, prev - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    await saveService({
      title: values.title.trim(),
      category: values.category,
      description: values.description?.trim() || null,
      defaultDurationMinutes: Number(values.defaultDurationMinutes) || 30,
      requiresAddress: values.requiresAddress,
      active: values.active,
    });

    router.replace(ROUTES.APPOINTMENT_SERVICES.HOME);
  }, [saveService, values, router]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.APPOINTMENT_SERVICES.HOME} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <div>
              <TypographyH1>Nova Categoria de Atendimento</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                Cadastrar novo tipo de serviço, sacramento ou acolhimento para agendamentos
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row items-center justify-center sm:justify-start gap-8 mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <Step
            variant={activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : 'pending'}
            step={1}
            label="Dados da Categoria"
          />
          <Step
            variant={activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : 'pending'}
            step={2}
            label="Confirmação"
          />
        </div>

        <Separator />
      </header>

      <main className="mx-auto w-full max-w-220 px-4 lg:px-8 py-8">
        {activeStep === 1 && (
          <>
            <ServiceInfoStep values={values} onChange={handleChange} errors={errors} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Link href={ROUTES.APPOINTMENT_SERVICES.HOME}>
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
            <ServiceConfirmStep mode="create" values={values} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Button variant="outline" size="lg" onClick={handlePrevStep}>
                Voltar
              </Button>
              <Button
                size="lg"
                isLoading={isSaving}
                loadingText="Cadastrando..."
                onClick={handleSubmit}
              >
                Cadastrar Categoria
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
