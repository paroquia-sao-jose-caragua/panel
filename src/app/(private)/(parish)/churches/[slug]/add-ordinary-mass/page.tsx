'use client';

import React, { useCallback } from 'react';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/api/communities/use-community';
import { ImagePreview } from '@/components/ui/file-input/image-preview';
import Link from 'next/link';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { ConfirmStep } from '@/components/domain/communities/add-ordinary-mass/confirm-step';
import { useCreateMassSchedule } from '@/components/domain/communities/use-create-mass-schedule';
import { InfoStep } from '@/components/domain/communities/add-ordinary-mass/info-step';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export default function AddOrdinaryMassPage() {
  const [activeStep, setActiveStep] = React.useState(1);

  const { community } = useCommunity();

  const { formik, isPending } = useCreateMassSchedule({ type: 'ordinary' });

  const handleNextStep = useCallback(() => {
    if (!formik.isValid) {
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
          <BackButton href={`/churches/${community?.slug}`} />

          <div className="flex flex-row items-center gap-4">
            <ImagePreview url={community?.coverUrl} className="h-20 w-24" />

            <div>
              <TypographyH2 className="pb-1">
                Adicionar Missa Regular
              </TypographyH2>
              <span className="text-md font-medium">{community?.name}</span>
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
            <InfoStep formik={formik} />
            <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
              <Link href={`/churches/${community?.slug}`}>
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
                Adicionar Missa
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
