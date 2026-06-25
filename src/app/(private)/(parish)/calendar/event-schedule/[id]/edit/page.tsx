'use client';

import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import React, { useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import Link from 'next/link';
import { InfoFormStep } from '@/components/features/event-schedules/info-form-step';
import { Spinner } from '@/components/ui/spinner';
import { focusFirstFieldError } from '@/utils/focusFirstFieldError';
import { ConfirmStep } from '@/components/features/event-schedules/confirm-step';
import { useEditEventSchedule } from '@/components/features/event-schedules/use-edit-event-schedule';

export default function EditEventSchedulePage() {
  const [activeStep, setActiveStep] = React.useState(1);

  const { formik, isPending } = useEditEventSchedule();

  const handleNextStep = useCallback(async () => {
    const errors = await formik.validateForm();

    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      formik.setTouched({});

      focusFirstFieldError();

      return;
    }

    setActiveStep((prev) => prev + 1);
  }, [formik]);

  const handlePrevStep = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href={'/calendar'} />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>Editar Evento</TypographyH1>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row items-center justify-center sm:justify-start gap-8 mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <Step
            variant={activeStep === 1 ? 'default' : 'completed'}
            step={1}
            label="Informações"
          />
          <Separator className="flex-1 max-w-20" />
          <Step
            variant={activeStep === 1 ? 'pending' : 'default'}
            step={2}
            label="Confirmação"
          />
        </div>
      </header>

      <main className="w-full max-w-200 px-4 pt-8 pb-12 mx-auto lg:px-8">
        {activeStep === 1 && (
          <>
            <InfoFormStep formik={formik} />
            <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
              <Link href={'/calendar'}>
                <Button variant="outline" size="lg">
                  Cancelar
                </Button>
              </Link>
              <Button size="lg" onClick={handleNextStep}>
                Continuar
              </Button>
            </div>
          </>
        )}

        {activeStep === 2 && (
          <>
            <ConfirmStep {...formik.values} />
            <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
              <Button variant="outline" size="lg" onClick={handlePrevStep}>
                Voltar
              </Button>
              <Button
                size="lg"
                disabled={isPending}
                onClick={formik.submitForm}
              >
                {isPending ? (
                  <Spinner className="border-brand-300 border-2 w-5 h-5" />
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
