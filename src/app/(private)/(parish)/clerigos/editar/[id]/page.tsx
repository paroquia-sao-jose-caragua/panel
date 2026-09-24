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
import { ClergyInfoStep } from '@/components/features/clergy/clergy-info-step';
import { ClergyBioStep } from '@/components/features/clergy/clergy-bio-step';
import { ClergyConfirmStep } from '@/components/features/clergy/clergy-confirm-step';
import type { ClergyFormValues } from '@/components/features/clergy/types';
import { listClergy } from '@/api/clergy/list';
import { editClergy } from '@/api/clergy/edit';
import { deleteClergy } from '@/api/clergy/delete';
import { showAlert } from '@/utils/showAlert';

export default function EditClergyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDeleteClergy, setConfirmDeleteClergy] = useState(false);

  const [values, setValues] = useState<ClergyFormValues>({
    name: '',
    title: 'Padre',
    position: 'parish_priest',
    roleName: 'Pároco',
    shortIntro: '',
    bio: '',
    orderIndex: 1,
    isMain: false,
    photoId: null,
    photoUrl: null,
  });

  const { data, isPending: isLoadingData } = useQuery({
    queryKey: ['clergy'],
    queryFn: listClergy,
  });

  useEffect(() => {
    if (data?.clergy) {
      const item = data.clergy.find((c) => c.id === id);
      if (item) {
        setValues({
          name: item.name,
          title: item.title || '',
          position: item.position || 'parish_priest',
          roleName: item.roleName || '',
          shortIntro: item.shortIntro || '',
          bio: item.bio || '',
          orderIndex: item.orderIndex ?? 1,
          isMain: Boolean(item.isMain),
          photoId: item.photoId || null,
          photoUrl: item.photoUrl || null,
        });
      }
    }
  }, [data, id]);

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

  const editMutation = useMutation({
    mutationFn: editClergy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clergy'] });
      showAlert('Dados do clérigo atualizados com sucesso!');
      router.replace('/clerigos');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao salvar alterações: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (clergyId: string) => deleteClergy(clergyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clergy'] });
      showAlert('Membro do clero excluído com sucesso!');
      router.replace('/clerigos');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao excluir membro do clero: ${err.message}`);
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
    editMutation.mutate({
      id,
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
  }, [editMutation, id, values]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href="/clerigos" />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>Editar Dados do Clérigo</TypographyH1>
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
        {isLoadingData ? (
          <div className="flex items-center gap-2 text-zinc-500 py-16 justify-center">
            <Spinner className="w-6 h-6" />
            Carregando dados do clérigo...
          </div>
        ) : (
          <>
            {activeStep === 1 && (
              <>
                <ClergyInfoStep values={values} onChange={handleChange} errors={errors} />

                <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
                  <Link href="/clerigos">
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
                <ClergyConfirmStep mode="edit" {...values} />

                <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
                  <Button variant="outline" size="lg" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    isLoading={editMutation.isPending}
                    loadingText="Salvando..."
                    onClick={handleSubmit}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </>
            )}

            {/* DANGER ZONE: Opções Avançadas / Exclusão discreta do Clérigo */}
            <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Gerenciamento do Registro
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Excluir este membro removerá permanentemente suas informações, biografia e foto do site.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteClergy(true)}
                className="text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 px-3 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Clérigo</span>
              </Button>
            </div>

            <DeleteConfirmationDialog
              open={confirmDeleteClergy}
              onOpenChange={setConfirmDeleteClergy}
              title="Excluir Clérigo"
              itemName={values.name || 'Membro do clero'}
              description={`Tem certeza que deseja excluir "${values.name || 'este membro'}"? Esta ação é irreversível e removerá todos os dados e fotos associados.`}
              isPending={deleteMutation.isPending}
              onConfirm={async () => {
                await deleteMutation.mutateAsync(id);
                setConfirmDeleteClergy(false);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
