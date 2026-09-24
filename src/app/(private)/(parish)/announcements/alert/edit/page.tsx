'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { Spinner } from '@/components/ui/spinner';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import {
  UrgentAlertFormStep,
  type UrgentAlertFormValues,
} from '@/components/features/announcements/urgent-alert-form-step';
import { UrgentAlertConfirmStep } from '@/components/features/announcements/urgent-alert-confirm-step';
import { getUrgentAlert, updateUrgentAlert, deleteUrgentAlert } from '@/api/urgent-alert';
import { showAlert } from '@/utils/showAlert';

export default function EditUrgentAlertPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDeleteAlert, setConfirmDeleteAlert] = useState(false);

  const [values, setValues] = useState<UrgentAlertFormValues>({
    active: false,
    text: '',
    variant: 'alert',
    startsAt: '',
    endsAt: '',
    hasModal: false,
    modalButtonText: 'Ver Detalhes',
    modalTitle: '',
    modalDescription: '',
    modalImageId: null,
    modalActionText: '',
    modalActionUrl: '',
  });

  const { data, isPending: isLoadingData } = useQuery({
    queryKey: ['urgent-alert'],
    queryFn: getUrgentAlert,
  });

  useEffect(() => {
    if (data?.alert) {
      const item = data.alert;
      setValues({
        active: item.active ?? false,
        text: item.text ?? '',
        variant: item.variant ?? 'alert',
        startsAt: item.startsAt ? item.startsAt.substring(0, 16) : '',
        endsAt: item.endsAt ? item.endsAt.substring(0, 16) : '',
        hasModal: item.hasModal ?? false,
        modalButtonText: item.modalButtonText ?? 'Ver Detalhes',
        modalTitle: item.modalTitle ?? '',
        modalDescription: item.modalDescription ?? '',
        modalImageId: item.modalImageId ?? null,
        modalActionText: item.modalActionText ?? '',
        modalActionUrl: item.modalActionUrl ?? '',
      });
    }
  }, [data]);

  const handleChange = useCallback(
    <K extends keyof UrgentAlertFormValues>(field: K, value: UrgentAlertFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const editMutation = useMutation({
    mutationFn: updateUrgentAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urgent-alert'] });
      queryClient.invalidateQueries({ queryKey: ['active-urgent-alert'] });
      showAlert('Faixa de alerta atualizada com sucesso!');
      router.replace('/announcements');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao salvar alterações: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUrgentAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urgent-alert'] });
      queryClient.invalidateQueries({ queryKey: ['active-urgent-alert'] });
      showAlert('Faixa de alerta desativada e limpa com sucesso!');
      router.replace('/announcements');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao desativar faixa: ${err.message}`);
    },
  });

  const handleNextStep = useCallback(() => {
    if (activeStep === 1) {
      const newErrors: Record<string, string> = {};
      if (values.active && !values.text.trim()) {
        newErrors.text = 'O texto da faixa é obrigatório quando a faixa estiver ativa';
      }
      if (values.hasModal && !values.modalTitle?.trim() && !values.modalDescription?.trim()) {
        newErrors.modalTitle = 'Informe pelo menos um título ou descrição para o modal';
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

  const handleSubmit = useCallback(() => {
    editMutation.mutate({
      active: values.active,
      text: values.text.trim(),
      variant: values.variant,
      startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : null,
      endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : null,
      hasModal: values.hasModal,
      modalButtonText: values.modalButtonText.trim() || 'Ver Detalhes',
      modalTitle: values.modalTitle?.trim() || null,
      modalDescription: values.modalDescription?.trim() || null,
      modalImageId: values.modalImageId || null,
      modalActionText: values.modalActionText?.trim() || null,
      modalActionUrl: values.modalActionUrl?.trim() || null,
    });
  }, [editMutation, values]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href="/announcements" />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>Editar Faixa de Alerta</TypographyH1>
              <span className="text-xs sm:text-sm text-zinc-500 font-medium">
                Configure a mensagem em destaque e a janela de detalhes para avisos importantes.
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row items-center justify-center sm:justify-start gap-4 sm:gap-8 mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <Step
            variant={activeStep === 1 ? 'default' : 'completed'}
            step={1}
            label="Informações"
          />
          <Separator className="flex-1 max-w-16 sm:max-w-20" />
          <Step
            variant={activeStep === 2 ? 'default' : 'pending'}
            step={2}
            label="Confirmação"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-220 px-4 lg:px-8 py-8">
        {isLoadingData ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="w-8 h-8 text-brand-600" />
          </div>
        ) : (
          <>
            {activeStep === 1 && (
              <div className="space-y-6">
                <UrgentAlertFormStep
                  values={values}
                  onChange={handleChange}
                  errors={errors}
                />

                <div className="flex flex-row justify-between items-center pt-4">
                  <Link href="/announcements">
                    <Button variant="outline" type="button">
                      Cancelar
                    </Button>
                  </Link>

                  <Button type="button" onClick={handleNextStep}>
                    Próximo Passo
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <UrgentAlertConfirmStep values={values} />

                <div className="flex flex-row justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handlePrevStep}
                    disabled={editMutation.isPending}
                  >
                    Voltar
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    isLoading={editMutation.isPending}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}

            {/* DANGER ZONE: Desativar / Limpar Faixa */}
            <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Gerenciamento do Comunicado
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Desativar e limpar os dados da faixa de alerta removerá o comunicado imediatamente do site.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteAlert(true)}
                className="text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 px-3 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Desativar e Limpar Faixa</span>
              </Button>
            </div>

            <DeleteConfirmationDialog
              open={confirmDeleteAlert}
              onOpenChange={setConfirmDeleteAlert}
              title="Desativar e Limpar Faixa"
              description="Deseja realmente desativar e limpar todos os dados da faixa de alerta? O aviso deixará de ser exibido no site."
              confirmText="Desativar"
              isPending={deleteMutation.isPending}
              onConfirm={async () => {
                await deleteMutation.mutateAsync();
                setConfirmDeleteAlert(false);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
