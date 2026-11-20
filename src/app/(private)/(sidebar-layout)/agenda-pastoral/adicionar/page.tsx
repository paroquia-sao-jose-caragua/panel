'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { AppointmentInfoStep } from '@/components/features/appointments/appointment-info-step';
import { AppointmentConfirmStep } from '@/components/features/appointments/appointment-confirm-step';
import type { AppointmentFormValues } from '@/components/features/appointments/types';
import {
  useCreateAppointment,
  useAppointmentServices,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';

export default function AddAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams?.get('date') || '';
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';

  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { services } = useAppointmentServices();
  const { createAppointment, isCreating } = useCreateAppointment();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<AppointmentFormValues>({
    agentId: '',
    serviceId: '',
    communityId: null,
    appointmentDate: dateParam,
    startTime: '',
    requesterName: '',
    requesterPhone: '',
    requesterEmail: '',
    requesterRelationship: '',
    requesterNotes: '',
    patientName: '',
    patientAddress: '',
    isBedridden: false,
    canSwallowHost: true,
    isLucid: true,
    patientNotes: '',
    status: 'confirmed',
    privatePastoralNotes: '',
  });

  const selectedService = useMemo(() => {
    return services?.find((s) => s.id === values.serviceId) || null;
  }, [services, values.serviceId]);

  const handleChange = useCallback(
    <K extends keyof AppointmentFormValues>(
      field: K,
      value: AppointmentFormValues[K]
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

      const effectiveAgentId = isPastoralAgent ? myAgent?.id || values.agentId : values.agentId;

      if (!effectiveAgentId) {
        newErrors.agentId = 'Selecione o agente pastoral responsável';
      }
      if (!values.serviceId) {
        newErrors.serviceId = 'Selecione a categoria / tipo de atendimento';
      }
      if (!values.appointmentDate) {
        newErrors.appointmentDate = 'Informe a data do atendimento';
      }
      if (!values.startTime) {
        newErrors.startTime = 'Informe o horário de início';
      }
      if (!values.requesterName.trim()) {
        newErrors.requesterName = 'Nome do solicitante é obrigatório';
      }
      if (!values.requesterPhone.trim()) {
        newErrors.requesterPhone = 'WhatsApp / Telefone é obrigatório';
      }

      if (selectedService?.requiresAddress) {
        if (!values.patientName.trim()) {
          newErrors.patientName = 'Nome do enfermo é obrigatório para visitas';
        }
        if (!values.patientAddress.trim()) {
          newErrors.patientAddress = 'Endereço completo da visita é obrigatório';
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setActiveStep(2);
    }
  }, [activeStep, values, isPastoralAgent, myAgent, selectedService]);

  const handlePrevStep = useCallback(() => {
    setActiveStep((prev) => Math.max(1, prev - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    const effectiveAgentId = isPastoralAgent ? myAgent?.id || values.agentId : values.agentId;

    await createAppointment({
      agentId: effectiveAgentId,
      serviceId: values.serviceId,
      communityId: values.communityId || null,
      appointmentDate: values.appointmentDate,
      startTime: values.startTime,
      requesterName: values.requesterName.trim(),
      requesterPhone: values.requesterPhone.trim(),
      requesterEmail: values.requesterEmail?.trim() || null,
      requesterRelationship: values.requesterRelationship?.trim() || null,
      requesterNotes: values.requesterNotes?.trim() || null,
      patientName: selectedService?.requiresAddress ? values.patientName?.trim() || null : null,
      patientAddress: selectedService?.requiresAddress ? values.patientAddress?.trim() || null : null,
      patientConditions: selectedService?.requiresAddress
        ? {
            isBedridden: values.isBedridden,
            canSwallowHost: values.canSwallowHost,
            isLucid: values.isLucid,
            notes: values.patientNotes?.trim() || undefined,
          }
        : null,
      status: values.status,
      privatePastoralNotes: values.privatePastoralNotes?.trim() || null,
    });

    router.replace(ROUTES.APPOINTMENTS.LIST);
  }, [createAppointment, values, isPastoralAgent, myAgent, selectedService, router]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white border-b border-zinc-200/80 relative lg:sticky lg:top-0 z-10 lg:z-40 shadow-2xs mt-16 lg:mt-0 md:mt-20">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.APPOINTMENTS.LIST} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <div>
              <TypographyH1>Novo Atendimento</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {isPastoralAgent
                  ? 'Agendar novo atendimento pastoral na sua agenda'
                  : 'Registrar agendamento de atendimento presencial ou visita pastoral a enfermos'}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row items-center justify-center sm:justify-start gap-8 mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <Step
            variant={activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : 'pending'}
            step={1}
            label="Dados do Atendimento"
          />
          <Step
            variant={activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : 'pending'}
            step={2}
            label="Confirmação"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-220 px-4 lg:px-8 py-8">
        {activeStep === 1 && (
          <>
            <AppointmentInfoStep values={values} onChange={handleChange} errors={errors} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Link href={ROUTES.APPOINTMENTS.LIST}>
                <Button variant="outline" size="lg" className="cursor-pointer">
                  Cancelar
                </Button>
              </Link>
              <Button size="lg" onClick={handleNextStep} className="cursor-pointer">
                Continuar para Confirmação
              </Button>
            </div>
          </>
        )}

        {activeStep === 2 && (
          <>
            <AppointmentConfirmStep values={values} />

            <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
              <Button variant="outline" size="lg" onClick={handlePrevStep} className="cursor-pointer">
                Voltar
              </Button>
              <Button
                size="lg"
                isLoading={isCreating}
                loadingText="Agendando..."
                onClick={handleSubmit}
                className="cursor-pointer"
              >
                Confirmar e Criar Atendimento
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
