'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
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
import { AnnouncementFormStep, type AnnouncementFormValues } from '@/components/features/announcements/announcement-form-step';
import { AnnouncementConfirmStep } from '@/components/features/announcements/announcement-confirm-step';
import { listAnnouncements, editAnnouncement, deleteAnnouncement } from '@/api/announcements';
import { showAlert } from '@/utils/showAlert';

export default function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDeleteAnnouncement, setConfirmDeleteAnnouncement] = useState(false);

  const [values, setValues] = useState<AnnouncementFormValues>({
    title: '',
    badgeText: '',
    description: '',
    actionText: '',
    actionUrl: '',
    coverDesktopId: '',
    coverTabletId: '',
    coverMobileId: '',
    active: true,
  });

  // Fetch announcements list to find item by id
  const { data, isPending: isLoadingData } = useQuery({
    queryKey: ['announcements'],
    queryFn: listAnnouncements,
  });

  useEffect(() => {
    if (data?.announcements) {
      const item = data.announcements.find((a) => a.id === id);
      if (item) {
        setValues({
          title: item.title,
          badgeText: item.badgeText || '',
          description: item.description,
          actionText: item.actionText || '',
          actionUrl: item.actionUrl || '',
          coverDesktopId: item.coverDesktopId,
          coverTabletId: item.coverTabletId || '',
          coverMobileId: item.coverMobileId || '',
          active: item.active,
        });
      }
    }
  }, [data, id]);

  const handleChange = (
    field: keyof AnnouncementFormValues,
    value: AnnouncementFormValues[keyof AnnouncementFormValues]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const editMutation = useMutation({
    mutationFn: (payload: Parameters<typeof editAnnouncement>[1]) => editAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      showAlert('Banner / Comunicado atualizado com sucesso!');
      router.replace('/avisos');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao salvar alterações: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      showAlert('Banner / Comunicado excluído com sucesso!');
      router.replace('/avisos');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao excluir banner: ${err.message}`);
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
    editMutation.mutate({
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
  }, [editMutation, values]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href="/avisos" />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>Editar Banner / Aviso</TypographyH1>
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
        {isLoadingData ? (
          <div className="flex items-center gap-2 text-zinc-500 py-12 justify-center">
            <Spinner className="w-6 h-6" />
            Carregando dados do banner...
          </div>
        ) : (
          <>
            {activeStep === 1 && (
              <>
                <AnnouncementFormStep values={values} onChange={handleChange} errors={errors} />

                <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
                  <Link href="/avisos">
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
                <AnnouncementConfirmStep mode="edit" {...values} />

                <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
                  <Button variant="outline" size="lg" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    disabled={editMutation.isPending}
                    onClick={handleSubmit}
                  >
                    {editMutation.isPending ? (
                      <Spinner className="border-brand-300 border-2 w-5 h-5" />
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* DANGER ZONE: Opções Avançadas / Exclusão discreta do Banner */}
            <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Gerenciamento do Registro
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Excluir este banner removerá permanentemente as imagens e informações cadastradas do site.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteAnnouncement(true)}
                className="text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 px-3 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Banner</span>
              </Button>
            </div>

            <DeleteConfirmationDialog
              open={confirmDeleteAnnouncement}
              onOpenChange={setConfirmDeleteAnnouncement}
              title="Excluir Banner / Comunicado"
              itemName={values.title || 'este banner'}
              description={`Tem certeza que deseja excluir o banner "${values.title || 'selecionado'}"? Esta ação é irreversível e o banner não será mais exibido no site.`}
              isPending={deleteMutation.isPending}
              onConfirm={async () => {
                await deleteMutation.mutateAsync();
                setConfirmDeleteAnnouncement(false);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
