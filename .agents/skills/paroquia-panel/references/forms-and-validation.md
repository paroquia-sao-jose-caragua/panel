# Formulários, Validação e Internacionalização (i18n)

Guia de engenharia para criação de formulários, validação tipada com Yup, ciclo de vida com Formik e internacionalização no **Painel Administrativo da Paróquia São José**.

---

## 1. Padrão Arquitetural de Formulários

Todos os formulários de cadastro e edição no painel seguem uma separação estrita em 4 camadas:

```text
1. Yup Schema Hook (src/schemas/use<Feature>Schema.ts)
   └─ Define regras de validação consumindo useTranslator() para mensagens i18n.
          │
          ▼
2. Orchestration Hook (src/components/features/<feature>/use-create-<feature>.ts)
   └─ Instancia useFormik, conecta a mutação do React Query, lê arquivos da store e trata o redirecionamento.
          │
          ▼
3. Multi-Step Components
   ├─ Step 1: <Feature>FormStep (campos visuais, upload de arquivo, feedback de erro)
   └─ Step 2: <Feature>ConfirmStep (revisão visual de todos os campos antes do envio)
          │
          ▼
4. Page Route (src/app/(private)/(parish)/<feature>/adicionar/page.tsx)
   └─ Controla o stepper ativo (Step 1 -> Step 2), validação antes de avançar e scroll automático para o primeiro erro.
```

---

## 2. Criação do Schema Yup com i18n (`src/schemas/`)

### 2.1. Por que Schemas são Custom Hooks?
Schemas de validação **devem ser criados como hooks** (`use<Feature>Schema()`) para que possam executar no contexto do React e consumir o hook `useTranslator()`. Dessa forma, nenhuma mensagem de erro fica fixa no código e o sistema mantém suporte total aos idiomas configurados (`pt-br`, `en-us`).

### 2.2. Exemplo de Implementação:
```typescript
// src/schemas/useCommunitySchema.ts
import useTranslator from '@/hooks/use-translator';
import * as yup from 'yup';
import useAddressSchema from './useAdressSchema';

export const useCommunitySchema = () => {
  const { t } = useTranslator();
  const addressSchema = useAddressSchema();

  const communitySchema = yup
    .object({
      name: yup
        .string()
        .required(t('error-name-required'))
        .min(5, t('error-name-min-length', { variables: { min: 5 } }))
        .max(255, t('error-name-max-length', { variables: { max: 255 } })),
      type: yup
        .string()
        .oneOf(['chapel', 'parish_church'], t('error-invalid-community-type'))
        .required(t('error-name-required')),
      coverId: yup.string().required(t('error-cover-required')),
      heroSubtitle: yup.string().max(500).optional().nullable(),
      aboutTitle: yup.string().max(255).optional().nullable(),
      aboutDescription: yup.string().optional().nullable(),
      phone: yup.string().max(50).optional().nullable(),
      email: yup.string().email(t('error-email-invalid')).optional().nullable(),
    })
    .concat(addressSchema);

  return communitySchema;
};

export default useCommunitySchema;
```

---

## 3. Hook de Orquestração com Formik e React Query

O hook de orquestração encapsula toda a lógica de negócio do formulário:

```typescript
// src/components/features/communities/use-create-community.ts
import { createCommunity } from '@/api/communities/create';
import { useNavigate } from '@/hooks/use-navigate';
import useCommunitySchema from '@/schemas/useChurchSchema';
import useCommunityStore from '@/stores/useCommunityStore';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { formatFullAddress } from '@/utils/formatFullAddress';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';

export const useCreateCommunity = () => {
  const validationSchema = useCommunitySchema();
  const navigate = useNavigate();
  const { files } = useFileInputStore();
  const { setCommunity } = useCommunityStore();

  // Localiza o arquivo enviado com sucesso no storage de upload
  const coverId = files.find((f) => f.state === 'complete')?.id;

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: createCommunity,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'chapel' as 'chapel' | 'parish_church',
      coverId: coverId || '',
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: 'Caraguatatuba',
      state: 'SP',
    },
    validationSchema,
    enableReinitialize: true, // Garante que atualizações de coverId reflitam no formulário
    onSubmit: (values) => {
      mutate(
        {
          name: values.name,
          type: values.type,
          coverId: values.coverId,
          address: formatFullAddress(values),
        },
        {
          onSuccess: ({ community, statusCode, message }) => {
            if (community && statusCode === 201) {
              setCommunity(community);
              navigate.push(`/${community.slug}`);
            } else {
              showAlert(`Erro ao cadastrar comunidade: ${message || 'Erro desconhecido'}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro ao cadastrar comunidade: ${error.message}`);
          },
        }
      );
    },
  });

  return { formik, isPending };
};
```

---

## 4. Validação de Múltiplos Passos e Foco no Erro

Ao navegar entre passos (de *Informações* para *Confirmação*), o formulário deve validar todos os campos manualmente, marcá-los como `touched` e focar automaticamente no primeiro elemento inválido:

```typescript
const handleNextStep = useCallback(async () => {
  const errors = await formik.validateForm();
  const hasErrors = Object.keys(errors).length > 0;

  if (hasErrors) {
    // Marca todos os campos do primeiro passo como tocados
    formik.setTouched({
      name: true,
      type: true,
      coverId: true,
      street: true,
      number: true,
      district: true,
      city: true,
      state: true,
      zipCode: true,
    });

    // Rola suavemente até o primeiro campo com a classe .focus-error
    focusFirstFieldError();
    return;
  }

  setActiveStep((prev) => prev + 1);
}, [formik]);
```

---

## 5. Ciclo de Upload de Arquivos com Progresso

O upload de mídias para o Cloudflare R2 é gerenciado de forma desacoplada:

1. O componente `<FileInputControl accept="image/png,image/jpeg" />` captura o arquivo do usuário.
2. A store `useFileInputStore` adiciona o arquivo no estado `'uploading'` com percentual em 0%.
3. A função `uploadFileWithProgress(file, onProgress)` (`src/api/attachments/images/upload.ts`) dispara uma requisição `XMLHttpRequest` para reportar o progresso real (`onprogress`).
4. Ao completar, a API retorna `{ attachmentId: string }`. A store atualiza o status do item para `'complete'` e salva seu `id`.
5. O hook do formulário lê o `coverId` correspondente e popula o Formik.

---

## 6. Regras de Internacionalização (i18n)

1. **Nunca use textos fixos em português diretamente na lógica de validação**: Todas as mensagens devem vir de `t('sua-chave')`.
2. **Padrão de Nomenclatura das Chaves**:
   - Campos obrigatórios: `error-<campo>-required` (ex: `error-name-required`, `error-cover-required`).
   - Comprimento mínimo: `error-<campo>-min-length` com interpolação `{{min}}`.
   - Comprimento máximo: `error-<campo>-max-length` com interpolação `{{max}}`.
   - Formato inválido: `error-<campo>-invalid` (ex: `error-email-invalid`, `error-code-invalid`).
3. **Sincronização Obrigatória**: Ao criar uma nova chave, registre-a simultaneamente em:
   - `src/dictionaries/pt-br.json`
   - `src/dictionaries/en-us.json`
