# Painel Administrativo Paróquia São José Caraguatatuba

Painel administrativo do sistema institucional da Paréquia São José de Caraguatatuba. O projeto foi desenvolvido com Next.js, React, TypeScript e OpenNext, com deploy em Cloudflare Workers.

O painel consome a API backend da paréquia para autenticar usuérios administrativos e gerenciar comunidades, horérios de missa, eventos do calendério e demais conteudos paroquiais.

## Sumario

- [Tecnologias](#tecnologias)
- [Manual de instalação](#manual-de-instalacao)
- [Execução local](#execucao-local)
- [Scripts disponiveis](#scripts-disponiveis)
- [Esquemas e validações](#esquemas-e-validacoes)
- [Organização do código](#organizacao-do-codigo)
- [Principais telas](#principais-telas)
- [Integração com a API](#integracao-com-a-api)
- [Deploy](#deploy)
- [Licença](#licenca)

## Tecnologias

- **Next.js 15**: framework React usado com App Router.
- **React 19**: biblioteca de interface.
- **TypeScript**: tipagem estática do projeto.
- **OpenNext Cloudflare**: adaptador para executar Next.js na Cloudflare.
- **Cloudflare Workers**: runtime de deploy do painel.
- **Tailwind CSS 4**: estilos da interface.
- **Radix UI e shadcn**: componentes acessíveis de interface.
- **React Query**: controle de chamadas, cache e mutações assíncronas.
- **Zustand**: gerenciamento de estado global.
- **Yup**: validação de formulários.
- **Formik**: apoio a formulários.

## Manual de instalação

### 1. Pré-requisitos

Instale previamente:

- Node.js em versao LTS.
- npm.
- Conta Cloudflare com acesso a Workers.
- API backend da paroquia configurada e acessivel.

### 2. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd panel
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

Crie ou atualize o arquivo `.env` na raiz do projeto. A aplicação usa a variável publica abaixo para encontrar a API:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:3333
```

Quando necessário, também configure:

```env
NEXT_PUBLIC_DOMAIN=localhost
```

Em staging e produção, a URL da API deve apontar para os domínios correspondentes do backend.

### 5. Configurar Cloudflare

O arquivo de configuração do Worker e [wrangler.jsonc](./wrangler.jsonc). Ele define:

- Worker local: `panel-dev`
- Ambiente de staging: `panel-staging`
- Ambiente de produção: `panel`
- Assets gerados em `.open-next/assets`
- Binding de assets: `ASSETS`
- Binding de imagens: `IMAGES`
- Binding de service: `WORKER_SELF_REFERENCE`

Antes de publicar em outra conta Cloudflare, revise no [wrangler.jsonc](./wrangler.jsonc):

- nome dos Workers;
- domínios em `route.pattern`;
- `zone_name`;
- bindings e configurações de assets.

### 6. Login na Cloudflare

```bash
npx wrangler login
```

## Execucao local

Para iniciar o servidor de desenvolvimento do Next.js:

```bash
npm run dev
```

Por padrão, o painel fica disponível em:

```text
http://localhost:3000
```

Para testar a aplicação no runtime da Cloudflare:

```bash
npm run preview
```

## Scripts disponiveis

Os scripts estao definidos em [package.json](./package.json):

| Script                   | Descricao                                                            |
| ------------------------ | -------------------------------------------------------------------- |
| `npm run dev`            | Inicia o Next.js local com Turbopack.                                |
| `npm run build`          | Gera o build Next.js.                                                |
| `npm run start`          | Inicia o servidor Next.js a partir do build local.                   |
| `npm run lint`           | Executa a verificação de lint configurada para Next.js.              |
| `npm run preview`        | Gera o build OpenNext e executa preview local no runtime Cloudflare. |
| `npm run upload`         | Gera o build OpenNext e faz upload para Cloudflare.                  |
| `npm run deploy`         | Gera o build OpenNext e publica em producao.                         |
| `npm run deploy:staging` | Gera o build OpenNext e publica em staging.                          |
| `npm run cf-typegen`     | Gera os tipos dos bindings Cloudflare em `cloudflare-env.d.ts`.      |

## Esquemas e validacoes

Este projeto nao define o banco de dados diretamente. Os esquemas de banco ficam no repositório da API. No painel, os principais esquemas sao validações de formulários e contratos de dados consumidos da API.

Validacoes de formulario em [src/schemas](./src/schemas):

| Arquivo               | Finalidade                                        |
| --------------------- | ------------------------------------------------- |
| `useLoginSchema.tsx`  | Valida email e senha do formulário de login.      |
| `useChurchSchema.tsx` | Valida cadastro e edição de comunidades/capelas.  |
| `useAdressSchema.tsx` | Valida campos de endereço usados nos formulários. |

Entidades TypeScript em [src/entities](./src/entities):

| Entidade                | Finalidade                                            |
| ----------------------- | ----------------------------------------------------- |
| `Community`             | Representa comunidade, capela ou matriz.              |
| `MassSchedule`          | Representa regra recorrente de horario de missa.      |
| `MassScheduleTime`      | Representa horários vinculados a uma missa.           |
| `MassScheduleException` | Representa exceções de horário por data.              |
| `EventSchedule`         | Representa eventos específicos do calendário.         |
| `CalendarSchedule`      | Representa itens consolidados exibidos no calendário. |

## Organizacao do codigo

```text
src/
  app/                 Rotas, layouts e paginas do App Router
  api/                 Clientes HTTP e hooks de integração com a API
  components/          Componentes comuns, UI e componentes de features
  dictionaries/        Arquivos de tradução e utilitérios de idioma
  entities/            Tipos e contratos de domínio usados no painel
  hooks/               Hooks reutilizáveis
  lib/                 Utilitarios compartilhados
  providers/           Providers globais de autenticação, hidratação e React Query
  schemas/             Validacoes Yup dos formulários
  stores/              Estados globais com Zustand
  utils/               Formatadores e funções auxiliares
public/                Imagens e assets públicos
```

Fluxo geral da aplicação:

1. `src/app/layout.tsx` define o layout raiz.
2. `src/providers/AppProvider.tsx` registra hidratação, React Query e guarda de autenticação.
3. `src/providers/AuthGuardProvider.tsx` controla sessão, refresh de token e redirecionamentos.
4. `src/api/utils/api.ts` centraliza chamadas HTTP, headers, idioma, timezone e token.
5. Paginas em `src/app/(private)` usam components, stores e hooks para consumir a API.

## Principais telas

| Caminho                              | Finalidade                                 |
| ------------------------------------ | ------------------------------------------ |
| `/login`                             | Autenticação dos usuários administrativos. |
| `/`                                  | Área inicial privada do painel.            |
| `/calendar`                          | Visualização do calendÁrio paroquial.      |
| `/calendar/add-event-schedule`       | Cadastro de evento no calendário.          |
| `/calendar/event-schedule/[id]/edit` | Edição de evento do calendário.            |
| `/[slug]`                            | Detalhes de uma comunidade/capela.         |
| `/add`                               | Cadastro de comunidade/capela.             |
| `/[slug]/edit`                       | Edição de comunidade/capela.               |
| `/[slug]/add-ordinary-mass`          | Cadastro de missa ordinária.               |
| `/[slug]/add-devotional-mass`        | Cadastro de missa devocional.              |
| `/[slug]/add-annual-mass`            | Cadastro de missa anual.                   |
| `/pastorals`                         | Área de pastorais.                         |
| `/clergies`                          | Área de clero.                             |

Algumas telas em `src/app/(private)/(pending-development)` existem como páginas previstas para evolução futura, como blog, galeria, configurações e suporte.

## Integracao com a API

O painel se comunica com o backend por meio dos módulos em [src/api](./src/api). Os principais grupos são:

| Modulo                       | Finalidade                                              |
| ---------------------------- | ------------------------------------------------------- |
| `users`                      | Login, logout e refresh de sessão.                      |
| `communities`                | Listagem, criação, consulta e edição de comunidades.    |
| `communities/mass-schedules` | Criacao e listagem de horários de missa por comunidade. |
| `mass-schedules`             | Edicao, exclusao e exceções de horários de missa.       |
| `event-schedules`            | Criação, edição, consulta e exclusão de eventos.        |
| `calendar`                   | Listagem consolidada do calendário.                     |
| `attachments/images`         | Upload de imagens.                                      |

A URL base da API e lida de `NEXT_PUBLIC_BASE_API_URL`.

## Deploy

Build local:

```bash
npm run build
```

Preview no runtime Cloudflare:

```bash
npm run preview
```

Deploy para staging:

```bash
npm run deploy:staging
```

Deploy para producao:

```bash
npm run deploy
```

Antes do deploy, confirme se o [wrangler.jsonc](./wrangler.jsonc) aponta para os domínios corretos e se a variável `NEXT_PUBLIC_BASE_API_URL` foi configurada para o ambiente desejado.

## Licenca

Este projeto e distribuído sob a licença **GNU General Public License v3.0 (GPLv3)**.

Consulte o arquivo [LICENSE](./LICENSE) para o texto completo da licença.
