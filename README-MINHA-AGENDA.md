Quero criar uma experiência própria para os AGENTES PASTORAIS,
otimizada principalmente para celular.

NÃO quero adaptar a tela administrativa atual de
"Agenda de Atendimentos".

Quero uma nova experiência isolada em:

/minha-agenda

A imagem de referência fornecida serve APENAS para referência de
estrutura, hierarquia, composição e experiência mobile.

NÃO copie fontes, cores, estilos tipográficos ou componentes visuais
diretamente da imagem.

IMPORTANTE:
Antes de implementar, analise o projeto atual e identifique o sistema
visual já utilizado.

As fontes, pesos tipográficos, cores, espaçamentos, bordas, raios,
componentes, botões, ícones e demais tokens visuais DEVEM seguir o
design system/padrão já existente no projeto.

Não instalar ou importar uma nova fonte apenas para reproduzir a imagem
de referência.

A imagem deve ser usada somente como referência de UX/UI.

==================================================
OBJETIVO
==================================================

O agente pastoral deve possuir uma espécie de "agenda pessoal pastoral".

Ele poderá:

- visualizar seus próprios atendimentos
- visualizar detalhes de seus atendimentos
- criar um novo atendimento
- cancelar seus atendimentos
- visualizar solicitações pendentes
- configurar seus próprios horários disponíveis
- bloquear uma data específica
- bloquear um período/range de datas
- bloquear parcialmente um horário específico
- consultar atendimentos antigos realizados ou cancelados

Ele NÃO deve visualizar ou gerenciar a agenda de outros agentes.

==================================================
STATUS DOS ATENDIMENTOS
==================================================

O sistema possui exatamente estes status:

Pendente
Confirmado
Cancelado
Realizado

Não criar novos status.

A experiência deve tratar cada status da seguinte maneira:

PENDENTE
Aguardando confirmação.

CONFIRMADO
Atendimento confirmado e que deve aparecer na agenda ativa.

CANCELADO
Atendimento cancelado e que deve sair da agenda ativa e ir para o
Arquivo.

REALIZADO
Atendimento concluído e que deve sair da agenda ativa e ir para o
Arquivo.

==================================================
REGRA PRINCIPAL DE VISUALIZAÇÃO
==================================================

Na tela inicial /minha-agenda devem aparecer SOMENTE atendimentos
com status:

Confirmado

Não mostrar na tela inicial:

- Pendentes
- Cancelados
- Realizados

A tela inicial deve ser focada nos compromissos atuais e futuros.

==================================================
NAVEGAÇÃO MOBILE
==================================================

Criar uma bottom navigation:

Início
Agenda
Solicitações
Perfil

Não criar sidebar no mobile.

A navegação deve permanecer simples e confortável para uso com uma mão.

==================================================
INÍCIO
==================================================

Rota:

/minha-agenda

Mostrar:

"Olá, [nome]!"

"Veja seus próximos atendimentos."

A seção principal deve ser:

"Próximos atendimentos"

Mostrar SOMENTE atendimentos com status "Confirmado".

Cada atendimento deve apresentar:

- data
- horário
- tipo de atendimento
- solicitante
- comunidade/local

Exemplo:

08:00
Confissão
João da Cruz
Comunidade Matriz

10:00
Aconselhamento
Maria Aparecida
Comunidade São José

14:00
Visita pastoral
Ana Clara
Nossa Senhora do Rosário

Os cards devem ser tocáveis e abrir os detalhes.

CTA principal:

"+ Agendar atendimento"

==================================================
AGENDA
==================================================

Rota:

/minha-agenda/agenda

A agenda deve mostrar SOMENTE atendimentos confirmados.

Não mostrar na agenda principal:

- pendentes
- cancelados
- realizados

Utilizar uma visualização mobile-first.

Pode utilizar:

- seletor de mês
- dias da semana
- data selecionada
- lista cronológica

Exemplo:

< Outubro 2026 >

Seg Ter Qua Qui Sex Sáb Dom
28  29  30  01  02  03  04

Quinta-feira, 1 de outubro

08:00
Confissão
Giselle Silva
Comunidade Matriz

10:00
Aconselhamento
Caio Aparecido
Comunidade São José

14:00
Visita pastoral
Maria Aparecida
Nossa Senhora do Rosário

==================================================
ARQUIVO / HISTÓRICO
==================================================

O Arquivo NÃO deve ser uma das opções principais da bottom navigation.

Ele deve existir como uma funcionalidade secundária dentro da Agenda.

No final da tela da Agenda, adicionar discretamente:

"Ver histórico de atendimentos →"

Essa ação abre:

/minha-agenda/arquivo

O objetivo do Arquivo é consultar atendimentos que já não fazem parte
da agenda ativa.

O Arquivo deve conter:

- atendimentos Realizados
- atendimentos Cancelados

Não colocar o Arquivo em destaque visual.

Não adicionar um grande card ou CTA chamativo para o Arquivo.

A tela pode ter:

"Arquivo"

"Atendimentos anteriores e cancelados"

Filtros simples:

[ Todos ] [ Realizados ] [ Cancelados ]

Cada item deve mostrar:

- data
- horário
- tipo
- solicitante
- local
- status

Exemplo:

02 SET
08:00
Confissão
Maria Aparecida
Comunidade Matriz
Realizado

28 AGO
14:00
Aconselhamento
João Guilherme
Comunidade São José
Cancelado

O Arquivo é principalmente para consulta, não para operação.

==================================================
SOLICITAÇÕES
==================================================

Criar uma área própria:

/minha-agenda/solicitacoes

Ela deve mostrar atendimentos com status:

Pendente

Esses atendimentos estão aguardando confirmação.

A bottom navigation deve mostrar um indicador quando existirem
solicitações pendentes.

Exemplo:

Solicitações   [2]

A tela deve deixar claro:

"Solicitações de atendimento"

"Atendimentos aguardando sua confirmação."

Cada solicitação deve mostrar:

- data
- horário
- tipo
- solicitante
- comunidade/local
- informações relevantes do solicitante, caso já façam parte do
  modelo existente

Permitir as ações que o sistema atual já suporta para confirmação,
sem recriar regras de negócio.

IMPORTANTE:

Pendente NÃO deve aparecer na tela principal ou na Agenda ativa.

Somente depois de confirmado ele passa a aparecer na Agenda.

==================================================
NOVO ATENDIMENTO
==================================================

Rota:

/minha-agenda/novo

O agente poderá criar um novo atendimento.

Campos:

1. Data
2. Horário
3. Tipo de atendimento
4. Nome do solicitante
5. Comunidade/local
6. Observação opcional

O agente autenticado deve ser automaticamente definido como responsável.

Não permitir selecionar outro agente.

Respeitar todas as regras existentes de:

- disponibilidade
- bloqueios
- conflitos
- horários
- categorias
- permissões

==================================================
DETALHES DO ATENDIMENTO
==================================================

Rota:

/minha-agenda/[id]

Mostrar:

- tipo
- data
- horário
- solicitante
- local
- agente
- status
- observações

Se estiver:

CONFIRMADO

Permitir cancelamento quando permitido.

Se estiver:

PENDENTE

Mostrar claramente que está aguardando confirmação e apresentar as
ações permitidas pelo sistema.

Se estiver:

CANCELADO ou REALIZADO

O atendimento deve ser tratado como histórico.

Não apresentar ações de edição como se ainda estivesse ativo.

==================================================
CANCELAMENTO
==================================================

Ao tocar em "Cancelar atendimento", não cancelar imediatamente.

Mostrar confirmação:

"Cancelar atendimento?"

"Tem certeza de que deseja cancelar este atendimento?"

"Essa ação não pode ser desfeita."

Botões:

"Sim, cancelar"
"Voltar"

Depois do cancelamento:

- alterar status para Cancelado
- remover o atendimento da Agenda ativa
- disponibilizá-lo no Arquivo
- executar as notificações existentes no sistema, caso existam

==================================================
CONFIGURAÇÕES DA AGENDA
==================================================

No Perfil, criar:

"Configurações da agenda"

Com:

Minha disponibilidade
Bloqueios

Essas configurações são PESSOAIS do agente.

==================================================
MINHA DISPONIBILIDADE
==================================================

Rota:

/minha-agenda/configuracoes/disponibilidade

O agente deve definir seus horários recorrentes de atendimento.

Exemplo:

SEGUNDA
Indisponível

TERÇA
Disponível

08:00 — 12:00
14:00 — 17:00

QUARTA
Disponível

08:00 — 12:00

QUINTA
Indisponível

SEXTA
Disponível

14:00 — 18:00

Permitir:

- ativar/desativar cada dia
- definir horário inicial
- definir horário final
- adicionar mais de um intervalo no mesmo dia
- remover intervalos
- salvar alterações

Deixar claro que essa é a DISPONIBILIDADE RECORRENTE NORMAL.

==================================================
BLOQUEIOS
==================================================

Rota:

/minha-agenda/configuracoes/bloqueios

Bloqueios são EXCEÇÕES à disponibilidade normal.

Mostrar os bloqueios futuros do agente.

Exemplo:

06 — 10 OUT
Férias
Dia inteiro

18 OUT
Compromisso pessoal
Dia inteiro

25 OUT
Compromisso
14:00 — 18:00

Permitir:

- criar
- editar
- excluir

==================================================
NOVO BLOQUEIO
==================================================

Criar fluxo:

"Novo bloqueio"

Perguntar:

Como deseja bloquear?

[ Uma data ] [ Período ]

Se "Uma data":

Data
[ 18/10/2026 ]

Horário

[ Dia inteiro ]

ou

[ Horário específico ]

Se "Período":

Data inicial
[ 06/10/2026 ]

Data final
[ 10/10/2026 ]

Horário

[ Dia inteiro ]

ou

[ Horário específico ]

Motivo
[ Férias ]

Botão:

"Bloquear período"

Um range de datas deve realmente bloquear TODAS as datas dentro do
intervalo.

==================================================
REGRAS DE DISPONIBILIDADE
==================================================

A disponibilidade recorrente define quando o agente normalmente pode
receber atendimentos.

Os bloqueios são exceções à disponibilidade.

Exemplo:

Disponibilidade:

Terça
08:00 — 12:00

Bloqueio:

06/10/2026
Dia inteiro

Resultado:

06/10 não deve apresentar horários disponíveis.

Outro exemplo:

Disponibilidade:

Terça
08:00 — 12:00

Bloqueio:

06/10/2026
10:00 — 12:00

Resultado:

06/10:

08:00 — disponível
10:00 — bloqueado
11:00 — bloqueado

A lógica deve ser validada no backend.

==================================================
DESIGN / DESIGN SYSTEM
==================================================

Seguir rigorosamente o padrão visual JÁ EXISTENTE NO PROJETO.

Antes de implementar, identifique:

- fontes já utilizadas
- pesos tipográficos
- tamanhos de texto
- cores
- tokens de espaçamento
- border radius
- sombras
- estilos de botão
- estilos de input
- componentes existentes
- ícones
- estados de interação

NÃO importar uma fonte nova apenas para reproduzir a imagem de
referência.

NÃO copiar diretamente a tipografia da imagem.

NÃO extrair cores da imagem.

A imagem fornecida deve servir SOMENTE como referência visual de:

- composição
- hierarquia
- organização
- experiência mobile
- padrões de interação

A implementação deve parecer uma extensão NATURAL do sistema atual,
e não uma interface copiada da imagem.

==================================================
EXPERIÊNCIA MOBILE
==================================================

O foco principal é celular.

Não transformar a versão desktop existente em uma versão comprimida.

Projetar especificamente para:

- uso com uma mão
- toque
- leitura rápida
- poucos elementos por tela
- CTAs claros
- navegação simples
- feedback imediato
- áreas de toque confortáveis

Evitar:

- tabelas
- sidebars
- excesso de filtros
- cards gigantes
- informações administrativas
- excesso de texto

A experiência deve parecer uma agenda pessoal pastoral,
não um painel administrativo.

==================================================
DESKTOP
==================================================

A experiência deve continuar funcionando em desktop,
mas o mobile é a prioridade.

Não é necessário criar uma segunda arquitetura para desktop.

Utilizar uma largura máxima confortável no desktop.

==================================================
SEGURANÇA
==================================================

O agente atual deve ser identificado pelo usuário autenticado.

Não confiar em agentId enviado pela URL ou pelo frontend.

O backend deve validar que:

- o agente só consulta seus próprios atendimentos
- o agente só cancela seus próprios atendimentos
- o agente só cria atendimentos para si mesmo
- o agente só consulta suas próprias solicitações
- o agente só altera sua própria disponibilidade
- o agente só cria/altera/exclui seus próprios bloqueios

Não alterar as permissões da área administrativa existente.

==================================================
IMPLEMENTAÇÃO
==================================================

Antes de escrever código:

1. Analise a implementação atual.
2. Identifique os componentes reutilizáveis.
3. Identifique as regras existentes de disponibilidade.
4. Identifique as regras de conflito.
5. Identifique os endpoints existentes.
6. Identifique como o agente pastoral é relacionado ao usuário autenticado.
7. Identifique as transições existentes dos status:
   Pendente → Confirmado
   Confirmado → Cancelado
   Confirmado → Realizado
8. Proponha a estrutura de arquivos e rotas.

Só depois implemente.

Não recrie lógica de negócio existente se ela puder ser reutilizada.

Não quebre a área administrativa atual.