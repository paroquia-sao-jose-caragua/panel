# Arquitetura e Padrões de Projeto do Painel Administrativo

Documento de referência detalhado sobre as camadas arquiteturais, fluxo de dados, autenticação, gerenciamento de estado e convenções do **Painel Administrativo da Paróquia São José** (Next.js 15 App Router + React 19 + OpenNext Cloudflare + Tailwind CSS 4 + Zustand + TanStack Query).

---

## 1. Visão Geral da Pilha Tecnológica

- **Framework Web**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack local, Server Components & Client Components híbridos).
- **Biblioteca de Interface**: [React 19](https://react.dev/).
- **Runtime de Deploy na Edge**: Cloudflare Workers através do adaptador [@opennextjs/cloudflare](https://opennext.js.org/cloudflare).
- **Estilização**: Tailwind CSS v4 (`@import "tailwindcss"`, design tokens configurados via `@theme` em `src/app/globals.css`).
- **Design System / Componentes Base**: Radix UI Primitives com customizações inspiradas em shadcn/ui (estilo `radix-vega`).
- **Gerenciamento de Estado do Servidor**: [@tanstack/react-query](https://tanstack.com/query/latest) v5 (cache, queries desabilitadas/condicionais, mutações com `networkMode: 'always'`).
- **Gerenciamento de Estado do Cliente**: [Zustand](https://github.com/pmndrs/zustand) v5 (persistência em `localStorage` para tokens/sessão, stores especializados para entidades em tela).
- **Formulários e Validação**: Formik v2 + Yup v1 (schemas instanciados através de hooks customizados integrados ao sistema de i18n).
- **Internacionalização (i18n)**: Dicionários estáticos em `src/dictionaries/` (`pt-br.json`, `en-us.json`) consumidos pelo hook `useTranslator()`.
- **Manipulação de Datas**: `date-fns` e `dayjs`.
- **Ícones**: [Lucide React](https://lucide.dev/).

---

## 2. Estrutura de Diretórios (`src/`)

```text
src/
├── api/                 # Clientes HTTP, funções de chamada REST e hooks React Query por domínio
│   ├── announcements/   # Banners e avisos paroquiais
│   ├── attachments/     # Upload e download de mídia (Cloudflare R2 via API)
│   ├── calendar/        # Agenda paroquial consolidada
│   ├── clergy/          # Gestão do clero institucional
│   ├── communities/     # Comunidades e capelas (CRUD, fotos, sobre, padroeiro)
│   │   ├── mass-schedules/ # Horários e exceções de missa vinculados à comunidade
│   │   └── photos/      # Galeria de fotos da comunidade
│   ├── donations/       # Dados bancários e chaves PIX da paróquia
│   ├── event-schedules/ # Eventos com datas específicas do calendário
│   ├── mass-schedules/  # Operações diretas de horários e exceções
│   ├── parish-contact/  # Informações de contato e expediente da secretaria
│   ├── urgent-alert/    # Alerta urgente exibido no topo do site e painel
│   ├── users/           # Login, logout, refresh de sessão e gestão de contas
│   ├── utils/           # api.ts central e wrappers especializados (communityApi, etc.)
│   └── zip-code.ts      # Consulta de CEP (ViaCEP / API externa)
├── app/                 # Rotas, layouts e páginas do Next.js App Router
│   ├── (public)/        # Rotas públicas desprotegidas
│   │   └── entrar/      # Tela de login e autenticação (/entrar)
│   ├── (private)/       # Rotas protegidas envolvidas pelo layout administrativo
│   │   ├── (parish)/    # Rotas principais da administração paroquial
│   │   │   ├── (churches)/ # Lista (/), adição (/adicionar-comunidade), detalhes e sub-rotas (/[slug], /[slug]/editar, /[slug]/sobre, /[slug]/padroeiro, /[slug]/galeria)
│   │   │   ├── agenda/      # Visualização e gestão do calendário (/agenda, /agenda/adicionar-evento)
│   │   │   ├── avisos/      # Gerenciamento de avisos e banners (/avisos, /avisos/adicionar, /avisos/alerta/editar)
│   │   │   ├── clerigos/    # Gestão de padres e diáconos (/clerigos, /clerigos/adicionar, /clerigos/editar/[id])
│   │   │   └── pastorais/   # Gestão de equipes pastorais (/pastorais)
│   │   ├── doacoes/     # Gestão de doações (/doacoes)
│   │   ├── secretaria/  # Informações da secretaria paroquial (/secretaria/editar, /secretaria/doacoes)
│   │   ├── (pending-development)/ # Páginas planejadas traduzidas (/artigos, /noticias, /comunicados, /albuns, /fotos, /gerenciar-acessos, /alterar-senha)
│   │   └── layout.tsx   # Layout privado (AppSidebar + TooltipProvider)
│   ├── globals.css      # Tokens Tailwind 4, CSS variables e animações
│   └── layout.tsx       # Root layout contendo AppProvider e fontes
├── components/          # Biblioteca de componentes React
│   ├── common/          # Componentes transversais da aplicação (Sidebar, Breadcrumb, Dialogs, Input/Select customizados)
│   ├── features/        # Componentes agrupados por domínio/funcionalidade (churches, announcements, etc.)
│   └── ui/              # Componentes atômicos do Design System (Button, Badge, Skeleton, Dialog, FileInput, etc.)
├── constants/           # Constantes da aplicação (ROUTES centralizado em routes.ts)
├── dictionaries/        # Arquivos de tradução JSON e utilitários de i18n
├── entities/            # Contratos de tipos TypeScript que espelham os dados da API
├── hooks/               # Hooks reutilizáveis (useTranslator, useNavigate, useMobile)
├── lib/                 # Utilitários gerais (ex: cn() para fusão de classes Tailwind)
├── providers/           # Provedores de contexto globais (AppProvider, AuthGuardProvider, HydrationProvider)
├── schemas/             # Validações Yup criadas como custom hooks com suporte a i18n
├── stores/              # Stores Zustand para estado global e de sessão
└── utils/               # Funções utilitárias puras (formatadores, focus de erros, cálculo de PIX)
```

---

## 3. Pipeline de Providers e Ciclo de Sessão

A aplicação inicializa no `src/app/layout.tsx` encapsulando as páginas no `AppProvider`:

```text
RootLayout (src/app/layout.tsx)
  │
  ▼
AppProvider (src/providers/AppProvider.tsx)
  │
  ├─► HydrationProvider (garante montagem no cliente evitando hydration mismatch)
  │
  ├─► QueryClientProvider (TanStack React Query com cache configurado)
  │
  └─► AuthGuardProvider (src/providers/AuthGuardProvider.tsx)
        │
        ├─► Executa mutação refresh() da sessão via API
        │     ├─ Se sucesso (200): atualiza token e user no useAuthStore
        │     └─ Se falha/401: limpa sessão e redireciona para /entrar
        │
        └─► Bloqueia telas privadas exibindo <FullLoading /> até a verificação terminar
```

### 3.1. Controle de Rotas e Redirecionamentos
- **Rotas de Autenticação (`/entrar`, `/confirm-code`)**: Se o usuário já estiver autenticado (`isLogged && token`), o `AuthGuardProvider` redireciona automaticamente para `/`.
- **Rotas Privadas (`/(private)/*`)**: Se o usuário não estiver autenticado (`!isLogged`), o provider redireciona imediatamente para `/entrar`.

### 3.2. Centralização de Rotas (`ROUTES`) e Redirecionamentos Legados
Todas as rotas da aplicação administrativa são definidas de forma tipada em `src/constants/routes.ts`:
- `ROUTES.AUTH.LOGIN`: `/entrar`
- `ROUTES.PARISH.COMMUNITY.ADD`: `/adicionar-comunidade`
- `ROUTES.PARISH.COMMUNITY.EDIT(slug)`: `/${slug}/editar`
- `ROUTES.PARISH.COMMUNITY.ABOUT(slug)`: `/${slug}/sobre`
- `ROUTES.PARISH.COMMUNITY.PATRON(slug)`: `/${slug}/padroeiro`
- `ROUTES.PARISH.COMMUNITY.GALLERY(slug)`: `/${slug}/galeria`
- `ROUTES.PARISH.ANNOUNCEMENTS.LIST`: `/avisos`
- `ROUTES.PARISH.ANNOUNCEMENTS.ADD`: `/avisos/adicionar`
- `ROUTES.PARISH.ANNOUNCEMENTS.EDIT(id)`: `/avisos/editar/${id}`
- `ROUTES.PARISH.ANNOUNCEMENTS.URGENT_ALERT`: `/avisos/alerta/editar`
- `ROUTES.PARISH.CALENDAR.LIST`: `/agenda`
- `ROUTES.PARISH.CALENDAR.ADD`: `/agenda/adicionar-evento`
- `ROUTES.PARISH.CALENDAR.EDIT(id)`: `/agenda/evento/${id}/editar`
- `ROUTES.PARISH.CLERGY.LIST`: `/clerigos`
- `ROUTES.PARISH.CLERGY.ADD`: `/clerigos/adicionar`
- `ROUTES.PARISH.CLERGY.EDIT(id)`: `/clerigos/editar/${id}`
- `ROUTES.PARISH.PASTORALS`: `/pastorais`
- `ROUTES.PARISH.DONATIONS`: `/doacoes`
- `ROUTES.SECRETARIAT.EDIT`: `/secretaria/editar`
- `ROUTES.SECRETARIAT.DONATIONS`: `/secretaria/doacoes`

**Redirecionamentos 308 (Legado)**: Para garantir total retrocompatibilidade com URLs salvas em favoritos ou histórico, as rotas antigas em inglês (ex: `/login`, `/clergies`, `/calendar`, `/announcements`, `/secretariat`, `/donations`, `/add`) possuem redirecionamento permanente (status 308) configurado em `next.config.ts`.

---

## 4. Camada de Integração HTTP (`src/api/`)

Toda a comunicação com a API backend da Paróquia São José é centralizada em `src/api/utils/api.ts`.

### 4.1. Wrapper Central `api<ResponseData, K>()`
O wrapper central executa:
1. **Injeção de Headers**:
   - `Accept-Language`: obtido dinamicamente de `useLocaleConfigStore.getState().lang`.
   - `X-Timezone` e `X-Timezone-Offset`: sincronizados do fuso do usuário.
   - `Authorization`: `Bearer <token>` injetado automaticamente a partir de `useAuthStore.getState().token`.
   - `Content-Type: application/json`.
2. **Tratamento de 401 e Refresh Automático**:
   - Quando uma requisição recebe status `401 Unauthorized` e o retry estiver habilitado (`options.retry !== false`), o cliente chama automaticamente `refresh()`.
   - Se o refresh for bem-sucedido, o novo token é salvo na store e a requisição original é refeita de forma transparente.
   - Se o refresh falhar, o usuário é deslogado via `setLoggedOut()`, a sessão é limpa e a tela é redirecionada para `/entrar`.
3. **Contrato de Retorno Tipado**:
   ```typescript
   export interface ApiResponse<ResponseData, K extends string = never> {
     errors?: { field: K; message: string }[];
     statusCode: number;
     message?: string;
   } & ResponseData;
   ```

### 4.2. Helpers de Domínio (`<feature>Api.ts`)
Para evitar repetição de rotas base, cada recurso pode expor seu próprio helper:
```typescript
import { api } from './api';

export const communityApi = async <ResponseData, K extends string = never>(
  path = '',
  init?: RequestInit
) => {
  return api<ResponseData, K>(`/communities${path}`, init);
};
```

---

## 5. Gerenciamento de Estado: Zustand vs. React Query

O painel adota uma divisão clara entre **estado do cliente** e **estado do servidor**:

| Tipo de Estado | Ferramenta | Onde fica? | Exemplos |
| :--- | :--- | :--- | :--- |
| **Sessão & Auth** | Zustand (`persist`) | `src/stores/useAuthStore.ts` | Token JWT, usuário logado, flags de onboarding |
| **Localização & I18n** | Zustand | `src/stores/useLocaleConfigStore.ts` | Idioma (`pt-br`, `en-us`), fuso horário |
| **Uploads em Andamento** | Zustand | `src/stores/useFileInputStore.ts` | Arquivos selecionados, percentual de progresso, IDs de capa |
| **Cache do Servidor** | TanStack Query | `src/api/<feature>/` | Listagem de comunidades, horários de missa, avisos |
| **Entidade Ativa em Tela** | Zustand | `src/stores/useCommunityStore.ts` | Comunidade em edição ou visualização atual |

### Padrão de Sincronização entre Query e Store:
Ao carregar detalhes de uma entidade (ex: `useCommunity`), o hook consome o `useQuery` da API e, em caso de sucesso, sincroniza os dados no Zustand store correspondente, permitindo que subcomponentes e formulários acessem a entidade sem recarregamentos desnecessários.
