---
name: paroquia-panel
description: >-
  Use this skill when developing, refactoring, extending, or maintaining the Paróquia São José administrative panel
  (built on Next.js 15 App Router, React 19, OpenNext Cloudflare Workers, Tailwind CSS 4, Radix UI / shadcn,
  TanStack Query v5, Zustand, Formik, Yup, and i18n dictionaries). It enforces standard UI components,
  state management, form workflows, API integration, routing architecture, and styling guidelines.
---

# Paróquia São José Painel — Development & Architecture Skill

Guia operacional para desenvolvimento, refatoração, padronização e manutenção do **Painel Administrativo da Paróquia São José de Caraguatatuba** (`panel`).

---

## 1. Visão Geral do Projeto

O painel é a aplicação web administrativa que permite à secretaria paroquial, pároco, clérigos e agentes pastorais gerenciar comunidades, horários e exceções de missa, eventos do calendário, avisos, doações e atendimentos pastorais.

- **Framework Web**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, Client e Server Components).
- **Biblioteca de Interface**: [React 19](https://react.dev/).
- **Runtime de Deploy na Edge**: Cloudflare Workers através do adaptador [@opennextjs/cloudflare](https://opennext.js.org/cloudflare).
- **Estilização**: Tailwind CSS v4 (`@import "tailwindcss"`, tokens em `@theme` em `src/app/globals.css`).
- **Componentes e Acessibilidade**: Radix UI Primitives + shadcn/ui (estilo `radix-vega`).
- **Gerenciamento de Cache & Requisições**: [@tanstack/react-query](https://tanstack.com/query/latest) v5 (`useQuery`, `useMutation`, `invalidateQueries`).
- **Estado Global do Cliente**: [Zustand](https://github.com/pmndrs/zustand) v5 com persistência em `localStorage` para sessão (`useAuthStore`).
- **Formulários e Validação**: Formik v2 integrado a schemas Yup v1 via hooks com suporte a i18n.
- **Internacionalização (i18n)**: Dicionários estáticos em `src/dictionaries/` (`pt-br.json`, `en-us.json`) e hook `useTranslator()`.
- **Ícones**: [Lucide React](https://lucide.dev/).

---

## 2. Padrão Arquitetural e Regras Invioláveis do Painel

O painel segue uma arquitetura orientada a componentes, fluxos de formulários em múltiplos passos e desacoplamento de estado do servidor e cliente:

```text
Next.js App Router (src/app/(private)/...)
       │
       ▼
Feature Page (Page Wrapper com Stepper, Header e Breadcrumb)
       │
       ▼
Orchestration Hook (useCreate<Feature>, useEdit<Feature>)
       │  ├─ useFormik + use<Feature>Schema(t) (Validação Yup com i18n)
       │  ├─ useMutation (TanStack React Query com networkMode: 'always')
       │  └─ useFileInputStore / Stores de Domínio (Zustand)
       ▼
UI Component Steps
       ├─ Step 1: <Feature>FormStep (FieldSection, Input, Select, FileInput)
       └─ Step 2: <Feature>ConfirmStep (Resumo e revisão visual antes de enviar)
       ▼
API Client Layer (src/api/<feature>/)
       │  (api.ts com interceptor de 401, refresh automático e injeção de headers)
       ▼
API Backend Paróquia São José (Cloudflare Workers)
```

### Regras Invioláveis do Padrão

1. **Nunca use `window.confirm()` ou `window.prompt()` nativos**:
   - Para confirmações de exclusão, utilize sempre o `<DeleteConfirmationDialog>` de `@/components/common/dialog/confirm-dialog`.
   - Para confirmações gerais, utilize o `<ConfirmDialog>`.
2. **Componente `Button` Padronizado**:
   - Utilize sempre `@/components/ui/button`.
   - Para links no Next.js, utilize o padrão polimórfico `<Button asChild><Link href="...">...</Link></Button>`.
   - Para estados de carregamento, passe a prop `isLoading={isPending}` e opcionalmente `loadingText="..."`. Nunca recrie spinners manuais dentro do botão.
3. **Schemas Yup como Custom Hooks (`use<Feature>Schema`)**:
   - Schemas de validação nunca devem ser objetos estáticos fora do React, pois precisam consumir o hook `useTranslator()` para mensagens internacionalizadas dinâmicas (`t(...)`).
4. **Foco e Scroll Automático em Erros de Formulário**:
   - Sempre que o usuário tentar avançar de passo ou submeter com erro, invoque `focusFirstFieldError()` após marcar os campos como `touched`. O componente `Input` e o utilitário utilizam a classe `.focus-error`.
5. **Skeletons Fiéis no Carregamento**:
   - Durante `isPending` em listagens ou páginas de detalhes, renderize skeletons fiéis à estrutura final de cards/tabelas usando `<Skeleton />`. Não use telas brancas ou apenas um spinner solitário centralizado.
6. **Internacionalização Obrigatória**:
   - Nenhuma mensagem de erro, texto de alerta ou label de validação deve ser chumbada em código puro. Adicione as chaves em `src/dictionaries/pt-br.json` e `src/dictionaries/en-us.json`.
7. **Upload de Mídia Desacoplado**:
   - Upload de imagens deve utilizar a infraestrutura de `useFileInputStore` e `uploadFileWithProgress` conectada ao endpoint `/attachments/images`.
8. **Rotas e URLs em Português Centralizadas (`ROUTES`)**:
   - Todas as URLs do painel devem ser em português (`/entrar`, `/clerigos`, `/avisos`, `/agenda`, `/secretaria`, `/doacoes`, `/adicionar-comunidade`, `/[slug]/editar`, etc.).
   - Nunca utilize URLs literais hardcoded nos componentes, links ou redirects. Importe e utilize sempre a constante tipada `ROUTES` de `@/constants/routes` (ex: `ROUTES.PARISH.CLERGY.LIST`, `ROUTES.AUTH.LOGIN`, `ROUTES.PARISH.COMMUNITY.EDIT(slug)`).
9. **Nunca crie formulários em modais (Dialogs/Sheets) para cadastro ou edição de entidades**:
   - Formulários de criação e edição **SEMPRE** devem ser páginas dedicadas no App Router (ex.: `/adicionar`, `/editar/[id]`), nunca modais.
   - A página de formulário deve conter a estrutura padrão de cabeçalho (`<header className="bg-white ...">` com `<BackButton>`, `<TypographyH1>`, subtítulo descritivo e `<Separator />`), passos de formulário com `<Step>` e etapa de revisão/confirmação (`confirm-step`) antes de salvar quando fizer sentido.
   - Em páginas de **edição**, inclua sempre a área de exclusão no rodapé ("Danger Zone" / Gerenciamento do Registro) com botão discreto de excluir acionando o `<DeleteConfirmationDialog>`.
   - Modais (`<Dialog>`) são estritamente reservados para confirmações de ações pontuais ou diálogos de exclusão, **nunca** para preenchimento de formulários de entidades.

---

## 3. Estrutura do Workspace

```text
src/
├── api/                 # Camada de comunicação REST (funções por endpoint e hooks React Query)
│   ├── announcements/   # Banners e avisos paroquiais (endpoints de API)
│   ├── attachments/     # Upload/gestão de imagens no Cloudflare R2
│   ├── calendar/        # Agenda consolidada
│   ├── clergy/          # Gestão do clero
│   ├── communities/     # Comunidades e capelas
│   │   ├── mass-schedules/ # Horários e exceções de missa
│   │   └── photos/      # Fotos da comunidade
│   ├── donations/       # Informações bancárias e PIX
│   ├── event-schedules/ # Eventos com datas específicas
│   ├── users/           # Login, logout, refresh e contas de usuários
│   └── utils/           # api.ts central e wrappers especializados (communityApi, etc.)
├── app/                 # Next.js App Router (Rotas, Layouts, Grupos de Rota)
│   ├── (public)/        # Rotas públicas (/entrar, /confirm-code)
│   ├── (private)/       # Rotas privadas administrativas
│   │   ├── (parish)/    # Módulos centrais (churches, agenda, avisos, clerigos, pastorais)
│   │   │   ├── (churches)/ # Comunidades (/, /adicionar-comunidade, /[slug], /[slug]/editar, /[slug]/sobre, /[slug]/padroeiro, /[slug]/galeria)
│   │   │   ├── agenda/  # Gestão do calendário (/agenda, /agenda/adicionar-evento, /agenda/evento/[id]/editar)
│   │   │   ├── avisos/  # Gestão de avisos (/avisos, /avisos/adicionar, /avisos/alerta/editar, /avisos/editar/[id])
│   │   │   ├── clerigos/ # Gestão do clero (/clerigos, /clerigos/adicionar, /clerigos/editar/[id])
│   │   │   └── pastorais/ # Gestão de pastorais (/pastorais)
│   │   ├── doacoes/     # Gestão de doações (/doacoes)
│   │   ├── secretaria/  # Secretaria e dados institucionais (/secretaria/editar, /secretaria/doacoes)
│   │   ├── (pending-development)/ # Módulos em desenvolvimento (/artigos, /noticias, /comunicados, /albuns, /fotos, /gerenciar-acessos, /alterar-senha)
│   │   └── layout.tsx   # Layout privado com AppSidebar e TooltipProvider
│   ├── globals.css      # Tokens Tailwind CSS 4, CSS variables e tema
│   └── layout.tsx       # Root layout com AppProvider e fontes
├── components/          # Componentes reutilizáveis
│   ├── common/          # Componentes estruturais (Sidebar, Dialogs, Input/Select customizados)
│   ├── features/        # Componentes por domínio (churches, clergy, announcements, etc.)
│   └── ui/              # Design System base (Button, Badge, Skeleton, Dialog, FileInput)
├── constants/           # Constantes da aplicação (ROUTES centralizado em routes.ts)
├── dictionaries/        # Arquivos de tradução (pt-br.json, en-us.json)
├── entities/            # Contratos de tipos TypeScript da API
├── hooks/               # Hooks transversais (useTranslator, useNavigate, useMobile)
├── lib/                 # Utilitários (ex: cn() para Tailwind)
├── providers/           # Providers globais (AppProvider, AuthGuardProvider, HydrationProvider)
├── schemas/             # Validações Yup em formato de hook com i18n
├── stores/              # Stores Zustand (useAuthStore, useFileInputStore, stores de entidades)
└── utils/               # Utilitários puros (formatadores, foco em erros, PIX)
```

---

## 4. Documentos de Referência Detalhados

Consulte os guias especializados na pasta `references/` para implementar ou alterar código no painel:

- **[Padrões de Arquitetura](./references/architecture-pattern.md)**: Fluxo completo de autenticação, providers, tratamento automático de 401 e separação de estado Zustand vs React Query.
- **[Componentes, Design System e Estilização](./references/components-and-styling.md)**: Catálogo dos componentes UI, variantes do `Button`, `ConfirmDialog`, `Input`, `Select`, `FileInput`, `FieldSection` e tokens de estilo Tailwind 4.
- **[Formulários, Validação e i18n](./references/forms-and-validation.md)**: Guia completo do padrão Formik + Yup hook, multi-step wizards, regras de i18n e foco automático no erro.
- **[Templates de Código e Boilerplates](./references/code-templates.md)**: Modelos prontos para copiar e adaptar (Entity, API Client, Zustand Store, Yup Hook, Formik Orchestrator, Form Step, Confirm Step e Páginas).
- **[Guia Passo a Passo de Novas Funcionalidades](./references/step-by-step-feature-guide.md)**: Checklist sequencial para construir qualquer tela no painel, do contrato à publicação.

---

## 5. Comandos e Procedimentos Frequentes

### Execução Local
```bash
# Iniciar servidor de desenvolvimento com Turbopack (porta 3000)
npm run dev

# Gerar tipos TypeScript dos bindings Cloudflare (se alterado wrangler.jsonc)
npm run cf-typegen
```

### Validação & Qualidade de Código
```bash
# Executar verificação de lint (Next.js ESLint)
npm run lint

# Validar compilação do TypeScript e build do Next.js
npm run build
```

### Preview & Deploy na Cloudflare
```bash
# Gerar build OpenNext e testar localmente no runtime Cloudflare Workers
npm run preview

# Publicar no ambiente de Staging (panel-staging)
npm run deploy:staging

# Publicar no ambiente de Produção (panel)
npm run deploy
```
