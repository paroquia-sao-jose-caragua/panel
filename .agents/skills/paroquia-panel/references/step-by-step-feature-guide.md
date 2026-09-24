# Guia Passo a Passo: Desenvolvimento de Funcionalidades no Painel

Roteiro completo para planejar, estruturar, integrar e publicar novas telas e funcionalidades no **Painel Administrativo da Paróquia São José**.

---

## 1. Sequência Recomendada de Desenvolvimento

Para garantir consistência e evitar retrabalho, siga este fluxo ordenado:

```text
[Passo 1: Entidade TypeScript] ──► src/entities/<Feature>.ts
            │
            ▼
[Passo 2: Chaves de Tradução] ──► src/dictionaries/pt-br.json e en-us.json
            │
            ▼
[Passo 3: Módulo de API & Hooks] ──► src/api/<feature>/ (create, list, get, use-*)
            │
            ▼
[Passo 4: Store Zustand] ──► src/stores/use<Feature>Store.ts
            │
            ▼
[Passo 5: Schema Yup com i18n] ──► src/schemas/use<Feature>Schema.ts
            │
            ▼
[Passo 6: Componentes de Feature] ──► src/components/features/<feature>/
            ├─► use-create-<feature>.ts (Formik + TanStack mutation)
            ├─► <feature>-form-step.tsx (Entrada com FieldSection)
            └─► <feature>-confirm-step.tsx (Revisão visual)
            │
            ▼
[Passo 7: Páginas do App Router] ──► src/app/(private)/(parish)/<feature>/
            ├─► page.tsx (Listagem com Skeleton e Empty State)
            └─► adicionar/page.tsx (Fluxo Stepper com foco no erro)
            │
            ▼
[Passo 8: Integração na Navegação] ──► src/components/common/sidebar/index.tsx
            │
            ▼
[Passo 9: Validação e Qualidade] ──► npm run lint && npm run build
```

---

## 2. Detalhamento de Cada Etapa

### Passo 1: Definir a Entidade de Domínio
Crie a tipagem em `src/entities/<Entity>.ts`.
- Mantenha propriedades em `camelCase`.
- IDs como `string` (padrão ULID da API).
- Booleans explícitos (`active: boolean`, `acceptsAppointments: boolean`).
- Datas como `string` no formato ISO 8601.

### Passo 2: Cadastrar Traduções e Mensagens de Erro
Abra `src/dictionaries/pt-br.json` e `src/dictionaries/en-us.json`.
- Registre o nome do recurso e ações: `"pastoral-agents": "Agentes Pastorais"`.
- Registre validações: `"error-phone-number-required": "Informe o número de telefone"`.
- Utilize interpolação quando aplicável: `"error-name-min-length": "O nome deve possuir pelo menos {{min}} caracteres"`.

### Passo 3: Criar o Módulo de Integração com a API
Em `src/api/<feature>/`:
1. Defina `src/api/utils/<feature>Api.ts` ou utilize `api(...)` diretamente.
2. Crie as funções assíncronas para cada endpoint (`create.ts`, `list.ts`, `get.ts`, `delete.ts`, etc.).
3. Crie os hooks React Query com controle de cache:
   - `use<Feature>s()` com `queryKey: ['<feature>s']`.
   - `use<Feature>(id)` com `queryKey: ['<feature>', id]`.
   - Lembre-se de sincronizar com a store Zustand se a entidade for compartilhada globalmente.

### Passo 4: Criar Store Zustand
Em `src/stores/use<Feature>Store.ts`:
- Declare `State` e `Action`.
- Mantenha a lista de itens e o item ativo selecionado.

### Passo 5: Criar o Schema de Validação Yup
Em `src/schemas/use<Feature>Schema.ts`:
- Crie como uma função que invoca `useTranslator()`.
- Valide campos obrigatórios, comprimentos mínimos/máximos e formatos (email, URL, telefone).

### Passo 6: Construir os Componentes da Funcionalidade
Em `src/components/features/<feature>/`:
1. **Hook do Formulário (`use-create-<feature>.ts`)**:
   - Conecte `useFormik` ao schema de validação.
   - Configure a mutação do React Query com `networkMode: 'always'`.
   - Se houver fotos, amarre ao `useFileInputStore`.
   - Trate o sucesso invalidando a query via `queryClient.invalidateQueries` e redirecionando com `navigate.push`.
2. **Form Step (`<feature>-form-step.tsx`)**:
   - Utilize `<FieldSection title="..." description="...">` para organizar o layout.
   - Utilize `<InputRoot>` e `<InputControl>` com suporte a erro.
   - Se for seleção, use `<Select>` e `<SelectItem>`.
3. **Confirm Step (`<feature>-confirm-step.tsx`)**:
   - Apresente um resumo limpo e agradável dos dados digitados para revisão antes de persistir.

### Passo 7: Criar as Rotas no App Router
Em `src/app/(private)/(parish)/<feature>/`:
1. **`page.tsx` (Listagem)**:
   - Cabeçalho com título (`<TypographyH1>`) e botão de ação (`<Button asChild size="lg">`).
   - Se `isPending`: exiba Skeletons em formato de grid ou tabela.
   - Se a lista estiver vazia: exiba o `<EmptyState>`.
   - Ações de exclusão: sempre envolva em `<DeleteConfirmationDialog>`.
2. **`adicionar/page.tsx` (Cadastro)**:
   - Estrutura com `<BackButton>`, `<Stepper>` (Passo 1 e 2) e botões de avançar/voltar.
   - Antes de passar do passo 1 para o 2, execute `formik.validateForm()` e `focusFirstFieldError()`.

### Passo 8: Registrar o Módulo na Sidebar
Em `src/components/common/sidebar/index.tsx`:
- Importe o ícone correspondente de `lucide-react`.
- Adicione o `<NavItem title="..." icon={...} links={[{ title: '...', href: ROUTES.PARISH.<FEATURE>.LIST }]} onLinkClick={handleClose} />` utilizando sempre a constante tipada `ROUTES` de `@/constants/routes`.

---

## 3. Checklist de Validação Final (Critérios de Qualidade)

Antes de considerar uma funcionalidade concluída, verifique os seguintes itens:

- [ ] **Rotas em Português e Centralizadas**: O roteamento utiliza URLs em português registradas em `@/constants/routes` (`ROUTES`), sem URLs literais soltas em links ou redirects?
- [ ] **Responsividade Mobile**: A tela funciona perfeitamente em telas pequenas (menu hamburger, campos empilhados em 1 coluna, botões de ação com toque confortável)?
- [ ] **Skeletons de Loading**: A tela apresenta feedback visual durante `isPending` compatível com o formato final dos cards ou tabelas?
- [ ] **Sem `window.confirm`**: Ações de exclusão e perigo utilizam o `<DeleteConfirmationDialog>` padronizado?
- [ ] **Internacionalização**: Todas as mensagens de erro e rótulos de botões foram extraídos para os arquivos de tradução (`pt-br.json` e `en-us.json`)?
- [ ] **Botões Unificados**: Todos os botões utilizam o componente padronizado `@/components/ui/button` com `isLoading` e `asChild` adequados?
- [ ] **Foco Automático em Erros**: O formulário rola e foca no primeiro campo com erro usando `focusFirstFieldError()`?
- [ ] **Invalidação de Cache**: Após mutações (criação, edição ou exclusão), o cache do React Query é invalidado com `queryClient.invalidateQueries(...)`?
- [ ] **Typecheck e Lint**: O comando `npm run lint` executa sem erros?
