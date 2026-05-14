'use client';

import React, { useCallback } from 'react';
import { BackButton } from '@/components/common/back-button';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/api/communities/use-community';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { useEditMassSchedule } from '@/components/features/churches/mass-schedules/use-edit-mass-schedule';
import { Spinner } from '@/components/ui/spinner';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { CoverImage } from '@/components/common/cover-image';
import { InfoFormStep } from '@/components/features/churches/mass-schedules/annual-mass/info-form-step';
import { ConfirmStep } from '@/components/features/churches/mass-schedules/annual-mass/confirm-step';

export default function EditOrdinaryMassPage() {
  const [activeStep, setActiveStep] = React.useState(1);

  const { community } = useCommunity();

  const { formik, isPending } = useEditMassSchedule({ type: 'ordinary' });

  const handleNextStep = useCallback(async () => {
    const errors = await formik.validateForm();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      formik.setTouched({
        isPrecept: true,
        recurrenceType: true,
        dayOfWeek: true,
        dayOfMonth: true,
        startDate: true,
        endDate: true,
        isSolemn: true,
        orientations: true,
        times: [{ startTime: true, endTime: true }],
        title: true,
        weekOfMonth: true,
      });
      return;
    }

    setActiveStep((prev) => prev + 1);
  }, [formik]);

  const handlePrevStep = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-16.25 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href={`/${community?.slug}`} />

          <div className="flex flex-row items-center gap-4">
            <CoverImage url={community?.coverUrl} className="h-20 w-24" />

            <div>
              <TypographyH1>Editar Missa Anual</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {community?.name}
              </span>
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
              <Link href={`/${community?.slug}`}>
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
            <ConfirmStep mode="edit" {...formik.values} />
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
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Salvando...
                  </>
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
