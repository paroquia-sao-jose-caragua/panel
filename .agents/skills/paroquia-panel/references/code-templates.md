# Templates de Código e Boilerplates para o Painel

Modelos prontos para copiar, colar e adaptar respeitando a arquitetura padrão do **Painel Administrativo da Paróquia São José**.

---

## 1. Entidade de Domínio (`src/entities/<Feature>.ts`)

```typescript
// src/entities/PastoralAgent.ts
export type PastoralAgent = {
  id: string;
  name: string;
  title?: string | null;
  actingRole: string;
  userId?: string | null;
  phone: string;
  email?: string | null;
  communityId?: string | null;
  communityName?: string | null;
  photoId?: string | null;
  photoUrl?: string | null;
  acceptsAppointments: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string | null;
};
```

---

## 2. Camada de API (`src/api/<feature>/`)

### 2.1. Helper de Domínio (`src/api/utils/<feature>Api.ts`)
```typescript
import { api } from './api';

export const pastoralAgentApi = async <ResponseData, K extends string = never>(
  path = '',
  init?: RequestInit
) => {
  return api<ResponseData, K>(`/pastoral-agents${path}`, init);
};
```

### 2.2. Função de Criação (`src/api/<feature>/create.ts`)
```typescript
import { pastoralAgentApi } from '../utils/pastoralAgentApi';
import type { PastoralAgent } from '@/entities/PastoralAgent';

interface CreatePastoralAgentResponse {
  agent: PastoralAgent;
}

export interface CreatePastoralAgentParams {
  name: string;
  actingRole: string;
  phone: string;
  title?: string | null;
  email?: string | null;
  communityId?: string | null;
  photoId?: string | null;
  acceptsAppointments?: boolean;
}

export const createPastoralAgent = async (params: CreatePastoralAgentParams) => {
  return pastoralAgentApi<CreatePastoralAgentResponse>('/', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};
```

### 2.3. Função de Listagem (`src/api/<feature>/list.ts`)
```typescript
import { pastoralAgentApi } from '../utils/pastoralAgentApi';
import type { PastoralAgent } from '@/entities/PastoralAgent';

interface ListPastoralAgentsResponse {
  agents: PastoralAgent[];
}

export const listPastoralAgents = async () => {
  return pastoralAgentApi<ListPastoralAgentsResponse>('/');
};
```

### 2.4. Hook React Query de Listagem com Sincronização (`src/api/<feature>/use-<features>.ts`)
```typescript
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { listPastoralAgents } from './list';
import usePastoralAgentsStore from '@/stores/usePastoralAgentsStore';

export const usePastoralAgents = () => {
  const { agents, setAgents } = usePastoralAgentsStore();

  const { data, isPending, refetch } = useQuery({
    queryKey: ['pastoral-agents'],
    queryFn: listPastoralAgents,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.agents) {
      setAgents(data.agents);
    }
  }, [data?.agents, setAgents]);

  return { agents, isPending, refetch };
};
```

---

## 3. Zustand Store (`src/stores/use<Feature>Store.ts`)

```typescript
import { create } from 'zustand';
import type { PastoralAgent } from '@/entities/PastoralAgent';

type State = {
  agents: PastoralAgent[];
  activeAgent: PastoralAgent | null;
};

type Action = {
  setAgents: (agents: PastoralAgent[]) => void;
  setActiveAgent: (agent: PastoralAgent | null) => void;
};

const usePastoralAgentsStore = create<State & Action>()((set) => ({
  agents: [],
  activeAgent: null,
  setAgents: (agents) => set({ agents }),
  setActiveAgent: (activeAgent) => set({ activeAgent }),
}));

export default usePastoralAgentsStore;
```

---

## 4. Schema Yup com i18n (`src/schemas/use<Feature>Schema.ts`)

```typescript
import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';

export const usePastoralAgentSchema = () => {
  const { t } = useTranslator();

  return yup.object({
    name: yup
      .string()
      .required(t('error-name-required'))
      .min(3, t('error-name-min-length', { variables: { min: 3 } }))
      .max(255, t('error-name-max-length', { variables: { max: 255 } })),
    actingRole: yup.string().required(t('error-name-required')),
    phone: yup
      .string()
      .required(t('error-phone-number-required'))
      .max(50, t('error-phone-number-max-length', { variables: { max: 50 } })),
    email: yup.string().email(t('error-email-invalid')).optional().nullable(),
    title: yup.string().max(50).optional().nullable(),
    communityId: yup.string().optional().nullable(),
    photoId: yup.string().optional().nullable(),
    acceptsAppointments: yup.boolean().default(true),
  });
};

export default usePastoralAgentSchema;
```

---

## 5. Hook de Orquestração Formik + Mutation (`src/components/features/<feature>/use-create-<feature>.ts`)

```typescript
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPastoralAgent } from '@/api/pastoral-agents/create';
import { useNavigate } from '@/hooks/use-navigate';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';
import usePastoralAgentSchema from '@/schemas/usePastoralAgentSchema';

export const useCreatePastoralAgent = () => {
  const validationSchema = usePastoralAgentSchema();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { files } = useFileInputStore();

  const photoId = files.find((f) => f.state === 'complete')?.id;

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: createPastoralAgent,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      title: '',
      actingRole: 'Ministro da Sagrada Comunhão (MESC)',
      phone: '',
      email: '',
      communityId: '',
      photoId: photoId || '',
      acceptsAppointments: true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(
        {
          ...values,
          photoId,
        },
        {
          onSuccess: ({ agent, statusCode, message }) => {
            if (agent && (statusCode === 201 || statusCode === 200)) {
              queryClient.invalidateQueries({ queryKey: ['pastoral-agents'] });
              showAlert('Agente pastoral cadastrado com sucesso!');
              navigate.push(ROUTES.PARISH.PASTORALS);
            } else {
              showAlert(`Erro ao cadastrar agente: ${message || 'Erro inesperado'}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro na requisição: ${error.message}`);
          },
        }
      );
    },
  });

  return { formik, isPending };
};
```

---

## 6. Página de Criação com Stepper (`src/app/(private)/(parish)/<feature>/adicionar/page.tsx`)

```tsx
'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';
import { ROUTES } from '@/constants/routes';
import { focusFirstFieldError } from '@/utils/focusFirstFieldError';
import { useCreatePastoralAgent } from '@/components/features/pastoral-agents/use-create-pastoral-agent';
import { PastoralAgentFormStep } from '@/components/features/pastoral-agents/pastoral-agent-form-step';
import { PastoralAgentConfirmStep } from '@/components/features/pastoral-agents/pastoral-agent-confirm-step';

export default function AddPastoralAgentPage() {
  const [activeStep, setActiveStep] = useState(1);
  const { formik, isPending } = useCreatePastoralAgent();

  const handleNextStep = useCallback(async () => {
    const errors = await formik.validateForm();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      formik.setTouched({
        name: true,
        phone: true,
        actingRole: true,
        email: true,
      });
      focusFirstFieldError();
      return;
    }

    setActiveStep((prev) => prev + 1);
  }, [formik]);

  const handlePrevStep = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20 lg:mt-0">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.PARISH.PASTORALS} />
          <TypographyH1>Novo Agente Pastoral</TypographyH1>
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
            <PastoralAgentFormStep formik={formik} />
            <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
              <Button asChild variant="outline" size="lg">
                <Link href={ROUTES.PARISH.PASTORALS}>Cancelar</Link>
              </Button>
              <Button size="lg" onClick={handleNextStep}>
                Continuar
              </Button>
            </div>
          </>
        )}

        {activeStep === 2 && (
          <>
            <PastoralAgentConfirmStep formik={formik} />
            <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevStep}
                disabled={isPending}
              >
                Voltar
              </Button>
              <Button
                size="lg"
                isLoading={isPending}
                loadingText="Salvando..."
                onClick={() => formik.handleSubmit()}
              >
                Confirmar e Salvar
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
```

---

## 7. Modal de Exclusão com Confirmação Padrão

```tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { showAlert } from '@/utils/showAlert';

export function DeleteItemButton({ item }: { item: { id: string; name: string } }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // chamada da função de delete
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      showAlert('Item excluído com sucesso!');
      setOpen(false);
    },
    onError: (err: Error) => {
      showAlert(`Erro ao excluir: ${err.message}`);
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <DeleteConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        itemName={item.name}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}
```
