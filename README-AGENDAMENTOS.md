# 📅 Plano de Implementação: Módulo de Agendamentos Pastorais e Portal do Agente

> Documento vivo de planejamento técnico e arquitetural para o sistema de agendamentos da Paróquia São José de Caraguatatuba.
> 
> ⚠️ **Módulo Pré-requisito:** Antes de executar este módulo, consulte e execute o [README-GESTAO-USUARIOS.md](file:///Users/gisellehoekveldsilva/Development/www/paroquiasaojosecaraguatatuba/panel/README-GESTAO-USUARIOS.md) (Gestão de Usuários, Controle de Acessos e Recuperação de Senha).
> 
> **Aplica-se aos projetos:**
> - `api` (Cloudflare Workers + Hono + D1)
> - `panel` (Next.js 15 App Router - Gestão da Secretaria & Portal do Agente)
> - `site` (Next.js 16 App Router - Agendamento Público pelos Fiéis)

---

## 1. Visão Geral e Objetivos

O objetivo deste módulo é permitir que paroquianos possam agendar atendimentos pelo site público com:
1. **Padre e Diácono** para confissões, direção espiritual, aconselhamento e bênçãos;
2. **Ministros e Agentes Pastorais** (ex.: Ministros da Sagrada Comunhão - MESC, Pastoral da Saúde) para levar a comunhão a enfermos/idosos acamados ou visitas pastorais.

### Premissas Fundamentais
- **Independência Total da Tabela `clergy`**: A tabela `clergy` permanece puramente institucional (Papa, Bispo Diocesano, Pároco, Diácono). O sistema de agendamento utiliza uma tabela própria e independente de **Agentes Pastorais (`pastoral_agents`)**, com uma flag/função de atuação na comunidade.
- **Sem aplicativo nas lojas (App Store / Google Play)**: Notificações enviadas diretamente no celular (WhatsApp e Web Push Notification / PWA).
- **Sem criar um 4º site**: Reaproveitamento da estrutura do `panel` utilizando *Route Groups* do Next.js para criar um **Portal do Agente 100% Mobile-First**, sem menus complexos de secretaria.
- **Privilégios e Permissões Rígidas (RBAC)**: Agentes pastorais só acessam a sua própria agenda, sem acesso a dízimo, avisos urgentes ou configurações da secretaria.

---

## 2. Controle de Privilégios e Níveis de Acesso (RBAC)

Para que clérigos, ministros e agentes acessem o painel sem visualizar dados administrativos e financeiros, expandimos os papéis do sistema:

### Matriz de Papéis (`users.role`)

| Papel (`role`) | Descrição | O que acessa no Painel? |
| :--- | :--- | :--- |
| `admin` | Pároco / Administrador Geral | Acesso total a tudo (usuários, doações/dízimo, avisos, blog, comunidades, agenda de todos). |
| `secretary` / `user` | Secretaria Paroquial | Gestão de avisos, missas, comunidades, cadastro de agentes e agendamento em nome dos fiéis. |
| `pastoral_agent` | Clérigo local ou Ministro/Agente | **Acesso restrito exclusivamente à sua própria agenda e seus horários**. Não vê sidebar da secretaria nem telas administrativas. |
| `viewer` | Apenas Leitura | Visualização de dados sem permissão de alteração. |

### Regras de Acesso para o `pastoral_agent`
1. **Redirecionamento Automático**: Ao fazer login, se `user.role === 'pastoral_agent'`, o sistema redireciona direto para `/minha-agenda` (ou `/agente`).
2. **Layout Dedicado (Sem Sidebar)**: O agente não vê a sidebar lateral de navegação da secretaria. Ele visualiza apenas:
   - Lista/Calendário dos seus atendimentos;
   - Botão para confirmar, concluir ou cancelar com justificativa;
   - Botão para abrir o WhatsApp do fiel com 1 toque;
   - Campo para anotações pastorais confidenciais (privadas do agente);
   - Configuração da sua própria grade de horários disponíveis e bloqueio de datas (férias, retiros, imprevistos).
3. **Bloqueio em Nível de API (Backend)**:
   - A rota de listagem de agendamentos (`GET /appointments`) só devolve os agendamentos do próprio agente autenticado, a menos que o solicitante seja `admin` ou `secretary`.

---

## 3. Modelagem de Dados no Cloudflare D1

A tabela **`pastoral_agents`** é 100% independente da tabela `clergy`. Qualquer pessoa que atue no atendimento na paróquia (Padre, Diácono, Ministro da Eucaristia, Agente da Pastoral da Saúde) é cadastrada diretamente nela com sua respectiva atuação.

```
       +-------------------------+
       |          users          |
       | (Auth, email, password, |
       |  role='pastoral_agent') |
       +------------+------------+
                    | (opcional)
                    |
              +-----v-------------------+
              |     pastoral_agents     |
              | (Nome, Atuação, Whats,  |
              |  Comunidade, Status)    |
              +-----+---------+---------+
                    |         |
  +-----------------+         +-------------------+
  |                                               |
+-v-----------------------+             +---------v---------------+
|   agent_availabilities  |             |      appointments       |
| (Horários semanais e    |             | (Atendimentos marcados  |
|  bloqueios de data)     |             |  com fiéis e enfermos)  |
+-------------------------+             +-------------------------+
```

### Estrutura das Tabelas (Migration SQL)

```sql
-- 1. Agentes pastorais que realizam atendimentos ou visitas (Independente de clergy)
CREATE TABLE IF NOT EXISTS pastoral_agents (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(50),                      -- Ex: "Pe.", "Diác.", "Ministro(a)", "Ir."
  acting_role VARCHAR(100) NOT NULL,      -- Flag/Atuação: "Pároco", "Diácono", "Ministro da Eucaristia (MESC)", "Pastoral da Saúde", etc.
  
  -- Vinculado a users caso tenha login no painel (opcional)
  user_id VARCHAR(26) REFERENCES users(id) ON DELETE SET NULL,
  
  phone VARCHAR(50) NOT NULL,             -- Celular com WhatsApp para notificações
  email VARCHAR(255),
  community_id VARCHAR(26) REFERENCES communities(id) ON DELETE SET NULL, -- Comunidade onde atua
  photo_id VARCHAR(26) REFERENCES attachments(id) ON DELETE SET NULL,     -- Foto do agente
  
  accepts_appointments BOOLEAN NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

-- 2. Tipos de Atendimento oferecidos
CREATE TABLE IF NOT EXISTS appointment_services (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  title VARCHAR(150) NOT NULL,         -- Ex: "Confissão", "Direção Espiritual", "Comunhão aos Enfermos"
  category VARCHAR(50) NOT NULL,      -- 'clergy_sacramental', 'home_visit', 'pastoral'
  description TEXT,
  default_duration_minutes INTEGER NOT NULL DEFAULT 30,
  requires_address BOOLEAN DEFAULT 0, -- Se for 1 (ex: visita a enfermo), exige endereço
  active BOOLEAN NOT NULL DEFAULT 1
);

-- 3. Relação N:N entre Agente e Serviços que realiza
CREATE TABLE IF NOT EXISTS agent_services (
  agent_id VARCHAR(26) NOT NULL REFERENCES pastoral_agents(id) ON DELETE CASCADE,
  service_id VARCHAR(26) NOT NULL REFERENCES appointment_services(id) ON DELETE CASCADE,
  PRIMARY KEY (agent_id, service_id)
);

-- 4. Grade semanal de disponibilidade
CREATE TABLE IF NOT EXISTS agent_availabilities (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  agent_id VARCHAR(26) NOT NULL REFERENCES pastoral_agents(id) ON DELETE CASCADE,
  community_id VARCHAR(26) REFERENCES communities(id) ON DELETE SET NULL,
  day_of_week INTEGER NOT NULL,       -- 0=Dom, 1=Seg, ..., 6=Sáb
  start_time TIME NOT NULL,            -- "14:00"
  end_time TIME NOT NULL,              -- "17:00"
  slot_duration_minutes INTEGER DEFAULT 30,
  active BOOLEAN NOT NULL DEFAULT 1
);

-- 5. Bloqueios de data (férias, retiros, reuniões, imprevistos)
CREATE TABLE IF NOT EXISTS agent_blocked_dates (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  agent_id VARCHAR(26) NOT NULL REFERENCES pastoral_agents(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  start_time TIME,                     -- NULL = dia inteiro bloqueado
  end_time TIME,
  reason VARCHAR(255)
);

-- 6. Agendamentos dos Fiéis
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  agent_id VARCHAR(26) NOT NULL REFERENCES pastoral_agents(id) ON DELETE CASCADE,
  service_id VARCHAR(26) NOT NULL REFERENCES appointment_services(id) ON DELETE RESTRICT,
  community_id VARCHAR(26) REFERENCES communities(id) ON DELETE SET NULL,
  
  -- Solicitante (fiel ou familiar)
  requester_name VARCHAR(255) NOT NULL,
  requester_phone VARCHAR(50) NOT NULL,
  requester_email VARCHAR(255),
  requester_relationship VARCHAR(100), -- Ex: "Filho(a)", "Próprio fiel"
  
  -- Caso seja visita a enfermo em domicílio
  patient_name VARCHAR(255),
  patient_address TEXT,
  patient_conditions TEXT,             -- JSON ou texto com flags: acamado, engole hóstia, lúcido
  
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  access_token VARCHAR(64) UNIQUE NOT NULL,      -- Token seguro para o fiel consultar e cancelar sem login
  requester_notes TEXT,
  private_pastoral_notes TEXT,         -- Anotações sigilosas do padre/ministro
  cancellation_reason TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_access_token ON appointments(access_token);
```

---

## 4. Experiência de Usuário e Arquitetura de Telas

### A. No `site` (Para o Fiel)

#### ❓ O fiel vai precisar criar uma conta ou se cadastrar?
**NÃO! Cadastro zero (fricção mínima).**
Exigir criação de conta, login e senha afastaria idosos, pessoas em momentos de dor/luto ou fiéis com pouca afinidade digital.

O fiel recebe a resposta e acompanha de 3 formas automáticas e sem atrito:
1. **WhatsApp Instantâneo**: No momento em que conclui a solicitação, ele recebe uma mensagem no seu WhatsApp confirmando o recebimento. Quando o padre ou a secretaria aprova/confirma, recebe outra mensagem confirmando o horário.
2. **E-mail com Convite**: Caso informe o e-mail, recebe o comprovante com botão *"Adicionar ao Google Agenda / Apple Calendar (.ics)"*.
3. **Link de Acompanhamento (Código/Token)**: Ao finalizar no site, é gerado um link seguro (ex.: `site.../agendamentos/acompanhar?token=abc...`) onde ele pode ver o status em tempo real (*Pendente*, *Confirmado*, *Realizado*, *Cancelado*) e cancelar o atendimento caso tenha um imprevisto.

---

#### 📋 Quais dados a pessoa precisará informar?

Os campos solicitados são divididos conforme a natureza do serviço:

##### 1. Atendimento Presencial (Confissão, Direção Espiritual, Aconselhamento, Bênção)
- **Nome Completo** *(Obrigatório)* — Para o clérigo saber quem vai atender;
- **WhatsApp com DDD** *(Obrigatório)* — Canal principal para envio da confirmação e contato direto caso haja um imprevisto (ex.: unção de emergência);
- **E-mail** *(Opcional)* — Para envio do convite de calendário e comprovante;
- **Comunidade que frequenta** *(Opcional - Dropdown)* — Matriz, Capela São Francisco, Capela N. Sra. de Fátima, ou "Visitante";
- **Motivo ou Breve Observação** *(Opcional)* — Campo de texto livre (ex.: *"Dúvidas sobre processo matrimonial"*, *"Confissão geral"*). Nunca é exigido detalhamento íntimo em respeito ao sigilo.

##### 2. Visita a Enfermos / Idosos Acamados (Ministro da Eucaristia ou Padre)
- **Dados do Solicitante (Familiar ou Cuidador):**
  - Nome completo *(Obrigatório)*;
  - WhatsApp com DDD *(Obrigatório)*;
  - Parentesco / Relação *(Opcional)* — Ex.: *"Filho(a)"*, *"Cônjuge"*, *"Vizinho(a)"*;
- **Dados do Enfermo / Destinatário da Comunhão:**
  - Nome do enfermo *(Obrigatório)*;
  - Condição do enfermo *(Opcional / Checkboxes simples)*:
    - [ ] Está acamado;
    - [ ] Consegue engolir a hóstia normalmente (partícula inteira ou apenas pequena fração);
    - [ ] Está lúcido;
- **Endereço Completo para a Visita:**
  - CEP, Rua, Número, Bairro, Complemento e Ponto de Referência *(Obrigatórios)*;
  - Observações de acesso (ex.: *"Interfone 203"*, *"Cachorro no quintal, chamar no portão"*).

---

### B. No `panel` (Para o Padre e o Ministro - Portal Mobile-First)
- **Rota**: `panel/src/app/(portal)/minha-agenda` (ou `/agente`).
- **Visual**: Design mobile-first (parece um aplicativo nativo quando adicionado à tela de início):
  - **Aba "Hoje"**: Cartões dos atendimentos do dia com horário, nome da pessoa, telefone com botão de WhatsApp e botão de "Concluir" ou "Cancelar".
  - **Aba "Agenda"**: Calendário semanal/mensal com a contagem de atendimentos.
  - **Aba "Horários"**: O próprio agente pode ativar/desativar dias da semana ou tocar em *"Bloquear data"* se tiver retiro, velório ou imprevisto.
- **Sem menus de secretaria**: Foco 100% na missão pastoral do agente.

---

### C. No `panel` (Para a Secretaria Paroquial)
- **Rota**: `panel/src/app/(private)/(parish)/appointments`
- **Funcionalidades**:
  - Visão geral de todos os agendamentos da paróquia (filtro por agente, serviço, data e status);
  - Possibilidade da secretária agendar um atendimento manualmente caso o fiel ligue ou compareça na secretaria;
  - Cadastro de novos agentes pastorais e configuração da sua atuação na comunidade.

---

## 5. Estratégia de Notificação no Celular

1. **WhatsApp Instantâneo (Canal Primário)**:
   - Ao criar o agendamento, a API chama o webhook de mensageria WhatsApp.
   - Mensagem direta no WhatsApp do agente com o nome da pessoa, horário, tipo e link seguro para abrir a ficha.
2. **PWA & Web Push Notification**:
   - O padre ou ministro clica em *"Adicionar à Tela de Início"* no Safari (iOS) ou Chrome (Android).
   - O ícone da paróquia fica na tela inicial como um app.
   - Suporte a notificações de tela bloqueada via Web Push API padrão.
3. **E-mail com Convite de Calendário (.ics)**:
   - Envio de e-mail com anexo `.ics` para adicionar automaticamente ao Google Agenda ou Apple Calendar.

---

## 6. Roadmap e Checklist de Implementação

### Fase 1: Banco de Dados & API (`api`)
- [ ] Criar migration `0010-add-pastoral-appointments.sql` com as tabelas de agentes, serviços e agendamentos.
- [ ] Atualizar schema de usuários para aceitar `role = 'pastoral_agent'`.
- [ ] Implementar middleware de permissões e controle de acesso RBAC por rota.
- [ ] Criar endpoints de gestão de agentes e disponibilidades:
  - [ ] `GET /pastoral-agents`
  - [ ] `POST /pastoral-agents`
  - [ ] `GET /pastoral-agents/:id/availabilities`
  - [ ] `PUT /pastoral-agents/:id/availabilities`
  - [ ] `POST /pastoral-agents/:id/block-date`
- [ ] Criar endpoint público para consulta de slots vagos:
  - [ ] `GET /appointments/available-slots?agentId=...&date=...`
- [ ] Criar endpoints de agendamento:
  - [ ] `POST /appointments` (público para criação)
  - [ ] `GET /appointments/my` (privado para o agente autenticado)
  - [ ] `PATCH /appointments/:id/status` (confirmar, cancelar, concluir)

### Fase 2: Portal do Agente Mobile no Painel (`panel`)
- [ ] Configurar layout independente `(portal)` ou `(agent)` sem sidebar de secretaria.
- [ ] Implementar redirecionamento automático de login conforme o `role`.
- [ ] Desenvolver tela "Minha Agenda" otimizada para celular.
- [ ] Adicionar modal de detalhes do agendamento com atalho para WhatsApp do solicitante.
- [ ] Adicionar funcionalidade rápida de bloqueio de datas pelo clérigo/ministro.

### Fase 3: Módulo de Secretaria no Painel (`panel`)
- [ ] Tela de gerenciamento de Agentes Pastorais (cadastrar agentes com sua função na comunidade, como Pároco, Diácono, Ministro da Eucaristia, etc.).
- [ ] Configuração de serviços de atendimento e horários.
- [ ] Tabela e calendário geral de agendamentos para a secretária.

### Fase 4: Fluxo de Agendamento no Site (`site`)
- [ ] Criar página `/agendamentos` com stepper amigável (Serviço $\rightarrow$ Agente $\rightarrow$ Horário $\rightarrow$ Dados).
- [ ] Suporte a formulário especial para Visitas a Enfermos (endereço + observações).

### Fase 5: Notificações no Celular
- [ ] Integrar serviço de mensageria WhatsApp na Worker da API ao salvar agendamento.
- [ ] Configurar manifest PWA e service worker para suporte a Web Push Notifications.
- [ ] Envio de confirmação também para o WhatsApp/E-mail do fiel solicitante.
