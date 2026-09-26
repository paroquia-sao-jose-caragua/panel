'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { ServiceInfoStep } from '@/components/features/appointment-services/service-info-step';
import { ServiceConfirmStep } from '@/components/features/appointment-services/service-confirm-step';
import type { AppointmentServiceFormValues } from '@/components/features/appointment-services/types';
import { useAppointmentServices } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

export default function EditAppointmentServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    services,
    isPending: isLoadingServices,
    saveService,
    isSaving,
    deleteService,
    isDeleting,
  } = useAppointmentServices({ all: true });

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDeleteService, setConfirmDeleteService] = useState(false);

  const [values, setValues] = useState<AppointmentServiceFormValues>({
    id,
    title: '',
    category: 'clergy_sacramental',
    description: '',
    defaultDurationMinutes: 30,
    requiresAddress: false,
    active: true,
  });

  const service = services?.find((s) => s.id === id);

  useEffect(() => {
    if (service) {
      setValues({
        id: service.id,
        title: service.title,
        category: service.category,
        description: service.description || '',
        defaultDurationMinutes: service.defaultDurationMinutes || 30,
        requiresAddress: service.requiresAddress,
        active: service.active,
      });
    }
  }, [service]);

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
      id,
      title: values.title.trim(),
      category: values.category,
      description: values.description?.trim() || null,
      defaultDurationMinutes: Number(values.defaultDurationMinutes) || 30,
      requiresAddress: values.requiresAddress,
      active: values.active,
    });

    router.replace(ROUTES.APPOINTMENT_SERVICES.HOME);
  }, [saveService, id, values, router]);

  const handleDelete = useCallback(async () => {
    await deleteService(id);
    setConfirmDeleteService(false);
    router.replace(ROUTES.APPOINTMENT_SERVICES.HOME);
  }, [deleteService, id, router]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.APPOINTMENT_SERVICES.HOME} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <div>
              <TypographyH1>
                {isLoadingServices && !service ? 'Carregando Categoria...' : `Editar: ${values.title || 'Categoria'}`}
              </TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                Altere os parâmetros, regras de endereço e visibilidade desta categoria
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
        {isLoadingServices && !service ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : (
          <>
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
                <ServiceConfirmStep mode="edit" values={values} />

                <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
                  <Button variant="outline" size="lg" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    isLoading={isSaving}
                    loadingText="Salvando..."
                    onClick={handleSubmit}
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
                  Excluir esta categoria removerá permanentemente o tipo de atendimento do catálogo da paróquia.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteService(true)}
                className="text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 px-3 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Categoria</span>
              </Button>
            </div>

            <DeleteConfirmationDialog
              open={confirmDeleteService}
              onOpenChange={setConfirmDeleteService}
              title="Excluir Categoria de Atendimento"
              description={`Tem certeza que deseja excluir permanentemente a categoria "${values.title}"? Esta ação não poderá ser desfeita.`}
              onConfirm={handleDelete}
              isPending={isDeleting}
            />

          </>
        )}
      </main>
    </div>
  );
}
