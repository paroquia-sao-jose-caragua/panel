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
import { AnnouncementFormStep, type AnnouncementFormValues } from '@/components/features/announcements/announcement-form-step';
import { AnnouncementConfirmStep } from '@/components/features/announcements/announcement-confirm-step';
import { createAnnouncement } from '@/api/announcements';

export default function AddAnnouncementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<AnnouncementFormValues>({
    title: '',
    badgeText: 'AVISO IMPORTANTE',
    description: '',
    actionText: '',
    actionUrl: '',
    coverDesktopId: '',
    coverTabletId: '',
    coverMobileId: '',
    active: true,
  });

  const handleChange = (field: keyof AnnouncementFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      router.replace('/announcements');
    },
    onError: (err: any) => {
      alert(err?.message || 'Erro ao cadastrar banner.');
    },
  });

  const handleNextStep = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!values.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!values.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!values.coverDesktopId) {
      newErrors.coverDesktopId = 'Imagem para Desktop é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setActiveStep(2);
  }, [values]);

  const handlePrevStep = useCallback(() => {
    setActiveStep(1);
  }, []);

  const handleSubmit = useCallback(() => {
    createMutation.mutate({
      title: values.title,
      badgeText: values.badgeText || null,
      description: values.description,
      actionText: values.actionText || null,
      actionUrl: values.actionUrl || null,
      coverDesktopId: values.coverDesktopId,
      coverTabletId: values.coverTabletId || null,
      coverMobileId: values.coverMobileId || null,
      active: values.active,
    });
  }, [createMutation, values]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href="/announcements" />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>Adicionar Banner / Aviso</TypographyH1>
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
            <AnnouncementFormStep values={values} onChange={handleChange} errors={errors} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Link href="/announcements">
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
            <AnnouncementConfirmStep mode="add" {...values} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Button variant="outline" size="lg" onClick={handlePrevStep}>
                Voltar
              </Button>
              <Button
                size="lg"
                disabled={createMutation.isPending}
                onClick={handleSubmit}
              >
                {createMutation.isPending ? (
                  <Spinner className="border-brand-300 border-2 w-5 h-5" />
                ) : (
                  'Adicionar Banner'
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
