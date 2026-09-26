'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { AgentInfoStep } from '@/components/features/pastoral-agents/agent-info-step';
import { AgentConfirmStep } from '@/components/features/pastoral-agents/agent-confirm-step';
import type { PastoralAgentFormValues } from '@/components/features/pastoral-agents/types';
import { usePastoralAgents } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

export default function AddPastoralAgentPage() {
  const router = useRouter();
  const { saveAgent, isSaving } = usePastoralAgents();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<PastoralAgentFormValues>({
    name: '',
    title: 'Pe.',
    actingRole: 'Pároco',
    phone: '',
    email: '',
    communityId: null,
    serviceIds: [],
    userId: null,
    acceptsAppointments: true,
    active: true,
  });

  const handleChange = useCallback(
    <K extends keyof PastoralAgentFormValues>(
      field: K,
      value: PastoralAgentFormValues[K]
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
      if (!values.name.trim()) {
        newErrors.name = 'Nome completo é obrigatório';
      }
      if (!values.actingRole.trim()) {
        newErrors.actingRole = 'Função pastoral é obrigatória';
      }
      if (!values.phone.trim()) {
        newErrors.phone = 'WhatsApp / Telefone é obrigatório';
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
    await saveAgent({
      name: values.name.trim(),
      title: values.title.trim() || null,
      actingRole: values.actingRole.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || null,
      communityId: values.communityId || null,
      serviceIds: values.serviceIds,
      userId: values.userId || null,
      acceptsAppointments: values.acceptsAppointments,
      active: values.active,
    });

    router.replace(ROUTES.PASTORAL_AGENTS.HOME);
  }, [saveAgent, values, router]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.PASTORAL_AGENTS.HOME} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <div>
              <TypographyH1>Adicionar Agente Pastoral</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                Cadastrar novo padre, diácono ou ministro para atendimentos e visitas
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row items-center justify-center sm:justify-start gap-8 mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <Step
            variant={activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : 'pending'}
            step={1}
            label="Dados do Agente"
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
            <AgentInfoStep values={values} onChange={handleChange} errors={errors} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Link href={ROUTES.PASTORAL_AGENTS.HOME}>
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
            <AgentConfirmStep mode="create" values={values} />

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
                Cadastrar Agente Pastoral
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
