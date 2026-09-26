# 🔐 Pré-requisito: Gestão de Usuários, Controle de Acessos e Recuperação de Senha

> **Status:** Módulo Pré-requisito Obrigatório para o [README-AGENDAMENTOS.md](file:///Users/gisellehoekveldsilva/Development/www/paroquiasaojosecaraguatatuba/panel/README-AGENDAMENTOS.md)
> 
> **Aplica-se aos projetos:**
> - `api` (Cloudflare Workers + Hono + D1)
> - `panel` (Next.js 15 App Router - Telas de Acesso e Configurações)

---

## 1. Visão Geral e Justificativa

Antes de implementar o módulo de agendamentos e o portal do clero/ministros, o sistema precisa de uma infraestrutura robusta de **controle de identidade, segurança e privilégios**. 

Hoje, a criação de usuários e autenticação no sistema são básicas (`admin`, `user`, `viewer`), sem interface no painel para o Administrador gerenciar quem tem acesso, sem fluxo de recuperação de senha esquecida e sem mecanismo de revogação de acessos.

### Objetivos deste Módulo
1. **Recuperação de Senha para Qualquer Usuário**: Fluxo seguro de "Esqueci minha senha" com envio de e-mail transacional contendo link e token com tempo de expiração;
2. **Criação e Convítes de Usuários pelo Admin**: O administrador cadastra novos usuários e define seus papéis no sistema;
3. **Gerenciamento e Alteração de Privilégios (RBAC)**: Interface visual no painel em `(settings)/manage-access` para alterar permissões (`admin`, `secretary`, `pastoral_agent`, `viewer`);
4. **Alteração de Senha pelo Admin**: Capacidade de redefinir ou enviar link de reset para usuários que perderam acesso;
5. **Revogação Imediata de Acessos**: Capacidade de suspender uma conta ou invalidar sessões ativas (refresh tokens) em tempo real caso um voluntário, funcionário ou ministro deixe a função.

---

## 2. Níveis de Privilégios e Matriz de Permissões (RBAC)

O sistema passará a suportar os seguintes papéis formalizados:

| Papel (`role`) | Descrição | Permissões no Painel |
| :--- | :--- | :--- |
| `admin` | Pároco / Administrador Geral | **Acesso irrestrito**: Cria usuários, altera papéis, revoga acessos, gerencia doações/dízimo, avisos, blog, comunidades e agenda de todos. |
| `secretary` / `user` | Secretaria Paroquial | **Gestão operacional**: Avisos, comunidades, missas, notícias, e agendamentos gerais em nome dos fiéis. Não acessa gerenciamento de usuários nem dízimo. |
| `pastoral_agent` | Clérigo local ou Ministro | **Acesso estritamente restrito**: Redirecionado diretamente para `/minha-agenda`. Só visualiza e gerencia os seus próprios atendimentos e horários. |
| `viewer` | Consulta | Apenas visualização de dados públicos/administrativos sem poder de edição. |

---

## 3. Especificação das Funcionalidades

### A. Fluxo de Recuperação de Senha (Qualquer Usuário)
1. Na tela de login (`/login`), inclusão do link **"Esqueci minha senha"**;
2. O usuário informa seu e-mail cadastrado na rota `/forgot-password`;
3. A API gera um token criptográfico único (armazenado com hash e validade de 1 hora) e dispara um e-mail transacional formatado;
4. O usuário clica no link do e-mail: `https://panel.../reset-password?token=XYZ...`;
5. Na tela `/reset-password`, o usuário digita a nova senha e a confirmação;
6. A API valida a expiração do token, atualiza o hash da senha, invalida o token usado e incrementa a versão da sessão para deslogar outros aparelhos antigos.

### B. Criação de Novos Usuários (Perfil Admin)
- Na tela `/manage-access`, botão **"Novo Usuário"**:
  - Campos: Nome completo, E-mail, Papel inicial (`admin`, `secretary`, `pastoral_agent`, `viewer`);
  - Opção de envio de e-mail de convite com link para o próprio usuário definir sua senha inicial OU definição de senha temporária pelo administrador.

### C. Gerenciamento de Privilégios e Papéis (Perfil Admin)
- Tabela de listagem de usuários com:
  - Nome e E-mail;
  - Papel atual (badge colorido com dropdown para alteração rápida);
  - Status (`Ativo`, `Suspenso`, `Pendente de ativação`);
  - Data de criação e data do último login (`last_login_at`);
- Modal de confirmação ao alterar papel de um usuário para evitar alterações acidentais.

### D. Alteração e Reset de Senha pelo Admin
- Opção no menu de ações do usuário:
  - **"Enviar e-mail de redefinição de senha"** (dispara o fluxo de reset direto para o e-mail dele);
  - **"Definir nova senha manualmente"** (o admin digita uma nova senha provisória e entrega ao usuário).

### E. Revogação de Acesso e Suspensão de Conta
- O Admin pode alternar o status do usuário para **Suspenso (`suspended`)** ou clicar em **"Revogar Sessões Ativas"**:
  - O campo `token_version` do usuário é incrementado no banco D1;
  - Na próxima requisição do usuário (ou ao tentar usar o refresh token), o sistema rejeita a autenticação e força o logout imediato em todos os dispositivos.

### F. Alteração da Própria Senha (Usuário Autenticado)
- Implementação da tela real em `(settings)/change-password`:
  - Campo: Senha atual;
  - Campo: Nova senha (com validação de força: mínimo 8 caracteres, números e letras);
  - Campo: Confirmação da nova senha.

---

## 4. Modelagem de Dados no Cloudflare D1

### Migration: `0009-add-user-access-management.sql`

```sql
-- 1. Expandir a tabela users com campos de controle e revogação
ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending'));
ALTER TABLE users ADD COLUMN last_login_at DATETIME;
ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 1;

-- 2. Tabela para tokens de recuperação de senha e convites
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  user_id VARCHAR(26) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'reset_password' CHECK (type IN ('reset_password', 'invite')),
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_tokens(expires_at);
```

---

## 5. Serviço de E-mail Transacional (`api`)

Para o envio de e-mails de recuperação de senha e convites na Cloudflare Worker sem custos adicionais:

- **Padrão e Provedor:** **Resend** via `fetch` HTTP direto — **exatamente o mesmo modelo já utilizado com sucesso no projeto do site em [`site/src/app/api/contact/route.ts`](file:///Users/gisellehoekveldsilva/Development/www/paroquiasaojosecaraguatatuba/site/src/app/api/contact/route.ts)**.
- **Vantagens desta Abordagem:**
  1. **Zero dependências adicionais**: Não precisa instalar pacotes npm pesados; utiliza o `fetch()` nativo global do Cloudflare Workers;
  2. **Reaproveitamento de credenciais**: Reutiliza a mesma conta, domínio autenticado e variáveis já configurados para o site (`RESEND_API_KEY` e `RESEND_FROM_EMAIL`);
  3. **Altíssima performance**: Chamada REST direta para `https://api.resend.com/emails`.

- **Binding de Configuração (`api/wrangler.jsonc` & Secrets)**:
  ```jsonc
  "vars": {
    "RESEND_API_KEY": "re_...", // Ou secret via wrangler secret put
    "RESEND_FROM_EMAIL": "Paróquia São José <nao-responda@paroquiasaojosecaragua.org.br>"
  }
  ```
- **Template de E-mail de Recuperação:**
  - Layout limpo, responsivo, com o brasão/identidade visual da paróquia;
  - Botão de ação centralizado (*"Redefinir Minha Senha"*);
  - Link alternativo em texto puro;
  - Aviso de segurança: *"Se você não solicitou esta alteração, ignore este e-mail. O link expira em 60 minutos."*.

---

## 6. Endpoints na API Hono (`api`)

### Autenticação & Recuperação Pública
- `POST /sessions` $\rightarrow$ Valida e-mail, senha e verifica se `status === 'active'`. Atualiza `last_login_at`.
- `POST /forgot-password` $\rightarrow$ Recebe o e-mail, gera o token e dispara o e-mail transacional.
- `POST /reset-password` $\rightarrow$ Recebe token + nova senha, valida expiração e atualiza a senha.

### Gerenciamento de Usuários (Apenas `admin`)
- `GET /users` $\rightarrow$ Listagem paginada de todos os usuários com filtros por status e papel.
- `POST /users` $\rightarrow$ Criação de novo usuário pelo admin (com convite por e-mail ou senha inicial).
- `PATCH /users/:id/role` $\rightarrow$ Alteração de privilégios (`admin`, `secretary`, `pastoral_agent`, `viewer`).
- `PATCH /users/:id/status` $\rightarrow$ Alteração de status (`active`, `suspended`).
- `POST /users/:id/revoke-sessions` $\rightarrow$ Incrementa `token_version` invalidando todos os tokens do usuário.
- `POST /users/:id/reset-password` $\rightarrow$ Admin redefine a senha ou dispara e-mail de reset para o usuário.

### Minha Conta (Qualquer Usuário Logado)
- `PATCH /users/me/password` $\rightarrow$ Altera a própria senha mediante confirmação da senha atual.

---

## 7. Telas no Painel (`panel`)

### 1. Telas Públicas
- [ ] `src/app/(public)/login`: Adicionar link *"Esqueceu sua senha?"*;
- [ ] `src/app/(public)/forgot-password/page.tsx`: Tela para digitar o e-mail e botão de envio;
- [ ] `src/app/(public)/reset-password/page.tsx`: Tela de definição da nova senha validando o token da URL.

### 2. Telas de Configuração do Admin
- [ ] `src/app/(private)/(settings)/manage-access/page.tsx`: Substituir o `DevNoticeCard` pela tela completa de gestão:
  - Tabela com busca, filtros por papel e status;
  - Botão "Novo Usuário" com modal de cadastro;
  - Menu de ações por linha (Editar Papel, Resetar Senha, Suspender Conta, Revogar Sessões);
  - Diálogos de confirmação para ações críticas (ex.: suspensão ou alteração de privilégios);
  - Proteção para impedir que o último administrador ativo remova seu próprio papel de admin.

### 3. Tela de Segurança Pessoal
- [ ] `src/app/(private)/(settings)/change-password/page.tsx`: Substituir o `DevNoticeCard` pelo formulário funcional de troca de senha com validações Yup/Zod.

---

## 8. Checklist e Roadmap de Implementação

### Fase 1: Backend D1 & API (`api`)
- [ ] Criar migration `0009-add-user-access-management.sql` (campos de status, `token_version` e tabela de tokens);
- [ ] Configurar serviço de e-mail (Resend) na API Hono;
- [ ] Criar use-cases e rotas de recuperação de senha (`/forgot-password` e `/reset-password`);
- [ ] Criar use-cases e rotas administrativas (`GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/status`, `POST /users/:id/revoke-sessions`);
- [ ] Atualizar middleware de autenticação para validar `token_version` e barrar usuários com `status === 'suspended'`;
- [ ] Adicionar testes unitários dos use-cases de recuperação e controle de acesso.

### Fase 2: Telas de Recuperação no Painel (`panel`)
- [ ] Implementar página e formulário de solicitação de recuperação (`/forgot-password`);
- [ ] Implementar página de redefinição de senha com token (`/reset-password`);
- [ ] Implementar tela de alteração da própria senha em `(settings)/change-password`.

### Fase 3: Tela de Gerenciamento de Acessos no Painel (`panel`)
- [ ] Criar hooks e clientes da API para listar, criar, suspender e alterar usuários;
- [ ] Implementar a tabela de usuários com paginação e busca em `(settings)/manage-access`;
- [ ] Implementar modal de criação de usuário com seleção de papel;
- [ ] Implementar ações de suspensão, revogação de sessão e redefinição de senha;
- [ ] Validar guardas de rota (apenas perfil `admin` pode visualizar `manage-access`).
