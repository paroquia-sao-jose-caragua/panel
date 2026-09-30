'use client';

import React, { useState, useEffect, useCallback, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, CalendarX } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { AppointmentInfoStep } from '@/components/features/appointments/appointment-info-step';
import { AppointmentConfirmStep } from '@/components/features/appointments/appointment-confirm-step';
import type { AppointmentFormValues } from '@/components/features/appointments/types';
import type { Appointment } from '@/entities/appointment';
import {
  useAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useAppointmentServices,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import {
  AppointmentWhatsAppDialog,
  type WhatsAppTemplateType,
} from '@/components/features/appointments/appointment-whatsapp-dialog';

export default function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';

  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { services } = useAppointmentServices();
  const { appointment, isPending: isLoadingAppointment } = useAppointment(id);
  const { updateAppointment, isUpdating } = useUpdateAppointment();
  const { deleteAppointment, isDeleting } = useDeleteAppointment();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [whatsAppDialogState, setWhatsAppDialogState] = useState<{
    open: boolean;
    appointment: Appointment | null;
    template: WhatsAppTemplateType;
    cancellationReason?: string;
  }>({
    open: false,
    appointment: null,
    template: 'confirmation',
  });

  const handleWhatsAppDialogClose = useCallback(
    (open: boolean) => {
      setWhatsAppDialogState((prev) => ({ ...prev, open }));
      if (!open) {
        router.replace(ROUTES.APPOINTMENTS.LIST);
      }
    },
    [router]
  );

  const [values, setValues] = useState<AppointmentFormValues>({
    agentId: '',
    serviceId: '',
    communityId: null,
    appointmentDate: '',
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

  // Populate values when appointment data arrives
  useEffect(() => {
    if (appointment) {
      setValues({
        agentId: appointment.agentId || '',
        serviceId: appointment.serviceId || '',
        communityId: appointment.communityId || null,
        appointmentDate: appointment.appointmentDate || '',
        startTime: appointment.startTime || '',
        requesterName: appointment.requesterName || '',
        requesterPhone: appointment.requesterPhone || '',
        requesterEmail: appointment.requesterEmail || '',
        requesterRelationship: appointment.requesterRelationship || '',
        requesterNotes: appointment.requesterNotes || '',
        patientName: appointment.patientName || '',
        patientAddress: appointment.patientAddress || '',
        isBedridden: appointment.patientConditions?.isBedridden ?? false,
        canSwallowHost: appointment.patientConditions?.canSwallowHost ?? true,
        isLucid: appointment.patientConditions?.isLucid ?? true,
        patientNotes: appointment.patientConditions?.notes || '',
        status: appointment.status || 'confirmed',
        privatePastoralNotes: appointment.privatePastoralNotes || '',
      });
    }
  }, [appointment]);

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

    await updateAppointment({
      id,
      data: {
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
      },
    });

    const isStaff = user?.role === 'admin' || user?.role === 'secretary';
    const wasPendingApproved =
      appointment?.status === 'pending' &&
      values.status === 'confirmed' &&
      isStaff;
    const wasCancelled =
      appointment?.status !== 'cancelled' &&
      values.status === 'cancelled' &&
      isStaff;

    if (wasPendingApproved && appointment) {
      setWhatsAppDialogState({
        open: true,
        appointment: {
          ...appointment,
          ...values,
          agentId: effectiveAgentId,
          id,
        },
        template: 'confirmation',
      });
    } else if (wasCancelled && appointment) {
      setWhatsAppDialogState({
        open: true,
        appointment: {
          ...appointment,
          ...values,
          agentId: effectiveAgentId,
          id,
        },
        template: 'cancellation',
        cancellationReason: 'Houve um imprevisto na agenda pastoral',
      });
    } else {
      router.replace(ROUTES.APPOINTMENTS.LIST);
    }
  }, [
    id,
    updateAppointment,
    values,
    isPastoralAgent,
    myAgent,
    selectedService,
    appointment,
    user,
    router,
  ]);

  const handleDelete = useCallback(async () => {
    await deleteAppointment(id);
    setConfirmDelete(false);
    router.replace(ROUTES.APPOINTMENTS.LIST);
  }, [id, deleteAppointment, router]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white border-b border-zinc-200/80 relative lg:sticky lg:top-0 z-10 lg:z-40 shadow-2xs mt-16 lg:mt-0 md:mt-20">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.APPOINTMENTS.LIST} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <div>
              <TypographyH1>Editar Agendamento</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {isLoadingAppointment
                  ? 'Carregando dados do agendamento...'
                  : appointment
                  ? `${appointment.requesterName} • ${appointment.appointmentDate} às ${appointment.startTime}`
                  : 'Agendamento não encontrado'}
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
        {isLoadingAppointment ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : !appointment ? (
          <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center bg-zinc-50/50">
            <CalendarX className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-zinc-800">Agendamento não encontrado</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
              O agendamento solicitado não foi localizado ou você não tem permissão para acessá-lo.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href={ROUTES.APPOINTMENTS.LIST}>Voltar para Atendimentos</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {activeStep === 1 && (
              <>
                <AppointmentInfoStep
                  values={values}
                  onChange={handleChange}
                  errors={errors}
                  isEdit
                />

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
                <AppointmentConfirmStep values={values} isEdit />

                <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
                  <Button variant="outline" size="lg" onClick={handlePrevStep} className="cursor-pointer">
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    isLoading={isUpdating}
                    loadingText="Salvando..."
                    onClick={handleSubmit}
                    className="cursor-pointer"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </>
            )}

            {/* DANGER ZONE: Exclusão no Footer */}
            <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Gerenciamento do Registro
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Excluir este agendamento removerá permanentemente o atendimento da base de dados da paróquia.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 px-3 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Agendamento</span>
              </Button>
            </div>

            <DeleteConfirmationDialog
              open={confirmDelete}
              onOpenChange={setConfirmDelete}
              title="Excluir Agendamento"
              itemName={appointment.requesterName || 'Agendamento'}
              description={`Tem certeza que deseja excluir o agendamento de "${appointment.requesterName}" em ${appointment.appointmentDate}? Esta ação é irreversível.`}
              isPending={isDeleting}
              onConfirm={handleDelete}
            />

            <AppointmentWhatsAppDialog
              open={whatsAppDialogState.open}
              onOpenChange={handleWhatsAppDialogClose}
              appointment={whatsAppDialogState.appointment}
              initialTemplate={whatsAppDialogState.template}
              cancellationReason={whatsAppDialogState.cancellationReason}
            />
          </>
        )}
      </main>
    </div>
  );
}
