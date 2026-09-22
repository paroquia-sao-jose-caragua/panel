'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { ClergyInfoStep } from '@/components/features/clergy/clergy-info-step';
import { ClergyBioStep } from '@/components/features/clergy/clergy-bio-step';
import { ClergyConfirmStep } from '@/components/features/clergy/clergy-confirm-step';
import type { ClergyFormValues } from '@/components/features/clergy/types';
import { createClergy } from '@/api/clergy/create';
import { showAlert } from '@/utils/showAlert';

export default function AddClergyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<ClergyFormValues>({
    name: '',
    title: 'Padre',
    position: 'parish_priest',
    roleName: 'Pároco',
    shortIntro: '',
    bio: '',
    orderIndex: 1,
    isMain: true,
    photoId: null,
    photoUrl: null,
  });

  const handleChange = useCallback(
    <K extends keyof ClergyFormValues>(field: K, value: ClergyFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const createMutation = useMutation({
    mutationFn: createClergy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clergy'] });
      showAlert('Membro do clero cadastrado com sucesso!');
      router.replace('/clergies');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao cadastrar clérigo: ${err.message}`);
    },
  });

  const handleNextStep = useCallback(() => {
    if (activeStep === 1) {
      const newErrors: Record<string, string> = {};
      if (!values.name.trim()) {
        newErrors.name = 'Nome completo é obrigatório';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    }
  }, [activeStep, values]);

  const handlePrevStep = useCallback(() => {
    setActiveStep((prev) => Math.max(1, prev - 1));
  }, []);

  const handleSubmit = useCallback(() => {
    createMutation.mutate({
      name: values.name.trim(),
      title: values.title.trim() || null,
      position: values.position,
      roleName: values.roleName.trim() || null,
      shortIntro: values.shortIntro.trim() || null,
      bio: values.bio.trim() || null,
      orderIndex: Number(values.orderIndex) || 0,
      isMain: values.isMain,
      photoId: values.photoId,
    });
  }, [createMutation, values]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href="/clergies" />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>Adicionar Membro do Clero</TypographyH1>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row items-center justify-center sm:justify-start gap-4 sm:gap-8 mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <Step
            variant={activeStep === 1 ? 'default' : activeStep > 1 ? 'completed' : 'pending'}
            step={1}
            label="Informações"
          />
          <Separator className="flex-1 max-w-16 sm:max-w-20" />
          <Step
            variant={activeStep === 2 ? 'default' : activeStep > 2 ? 'completed' : 'pending'}
            step={2}
            label="Biografia"
          />
          <Separator className="flex-1 max-w-16 sm:max-w-20" />
          <Step
            variant={activeStep === 3 ? 'default' : 'pending'}
            step={3}
            label="Confirmação"
          />
        </div>
      </header>

      <main className="w-full max-w-220 px-4 pt-8 pb-16 mx-auto lg:px-8">
        {activeStep === 1 && (
          <>
            <ClergyInfoStep values={values} onChange={handleChange} errors={errors} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Link href="/clergies">
                <Button variant="outline" size="lg">
                  Cancelar
                </Button>
              </Link>
              <Button size="lg" onClick={handleNextStep}>
                Continuar para Biografia
              </Button>
            </div>
          </>
        )}

        {activeStep === 2 && (
          <>
            <ClergyBioStep values={values} onChange={handleChange} errors={errors} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Button variant="outline" size="lg" onClick={handlePrevStep}>
                Voltar
              </Button>
              <Button size="lg" onClick={handleNextStep}>
                Continuar para Confirmação
              </Button>
            </div>
          </>
        )}

        {activeStep === 3 && (
          <>
            <ClergyConfirmStep mode="add" {...values} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Button variant="outline" size="lg" onClick={handlePrevStep}>
                Voltar
              </Button>
              <Button
                size="lg"
                disabled={createMutation.isPending}
                onClick={handleSubmit}
                className="bg-[#18351E] hover:bg-[#27442A] text-white"
              >
                {createMutation.isPending ? (
                  <Spinner className="border-brand-300 border-2 w-5 h-5" />
                ) : (
                  'Cadastrar Clérigo'
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
