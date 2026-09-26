'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Clock, CalendarOff } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { AgentInfoStep } from '@/components/features/pastoral-agents/agent-info-step';
import { AgentConfirmStep } from '@/components/features/pastoral-agents/agent-confirm-step';
import type { PastoralAgentFormValues } from '@/components/features/pastoral-agents/types';
import { usePastoralAgents } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

export default function EditPastoralAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { agents, isPending: isLoadingAgents, saveAgent, isSaving, deleteAgent, isDeleting } =
    usePastoralAgents();

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDeleteAgent, setConfirmDeleteAgent] = useState(false);

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

  const agent = agents.find((a) => a.id === id);

  useEffect(() => {
    if (agent) {
      setValues({
        name: agent.name,
        title: agent.title || '',
        actingRole: agent.actingRole,
        phone: agent.phone,
        email: agent.email || '',
        communityId: agent.communityId,
        serviceIds: agent.services?.map((s) => s.id) || [],
        userId: agent.userId || null,
        acceptsAppointments: agent.acceptsAppointments,
        active: agent.active,
      });
    }
  }, [agent]);

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
      id,
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
  }, [id, saveAgent, values, router]);

  const handleDelete = useCallback(async () => {
    await deleteAgent(id);
    setConfirmDeleteAgent(false);
    router.replace(ROUTES.PASTORAL_AGENTS.HOME);
  }, [id, deleteAgent, router]);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.PASTORAL_AGENTS.HOME} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <TypographyH1>Editar Agente Pastoral</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {agent?.name ? `${agent.title ? `${agent.title} ` : ''}${agent.name}` : 'Carregando dados...'}
              </span>
            </div>

            {/* Atalhos para Grade e Bloqueios */}
            <div className="flex items-center gap-2">
              <Link href={ROUTES.PASTORAL_AGENTS.SCHEDULE(id)}>
                <Button variant="outline" size="sm">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Grade de Horários
                </Button>
              </Link>
              <Link href={ROUTES.PASTORAL_AGENTS.BLOCKED_DATES(id)}>
                <Button variant="outline" size="sm">
                  <CalendarOff className="w-3.5 h-3.5 mr-1.5" />
                  Bloqueios
                </Button>
              </Link>
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
        {isLoadingAgents ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : (
          <>
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
                <AgentConfirmStep mode="edit" values={values} />

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
                  Excluir este agente removerá permanentemente seus vínculos de atendimento e configurações da paróquia.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteAgent(true)}
                className="text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 px-3 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Agente</span>
              </Button>
            </div>

            <DeleteConfirmationDialog
              open={confirmDeleteAgent}
              onOpenChange={setConfirmDeleteAgent}
              title="Excluir Agente Pastoral"
              itemName={values.name || 'Agente pastoral'}
              description={`Tem certeza que deseja excluir "${values.name || 'este agente'}"? Esta ação é irreversível e removerá todos os horários e serviços vinculados.`}
              isPending={isDeleting}
              onConfirm={handleDelete}
            />
          </>
        )}
      </main>
    </div>
  );
}
