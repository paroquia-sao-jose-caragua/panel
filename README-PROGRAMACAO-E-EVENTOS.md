Quero redesenhar a arquitetura de navegação do painel administrativo da Paróquia São José de Caraguatatuba.

IMPORTANTE:
Não quero uma reformulação visual completa da aplicação. A identidade visual atual já está definida e deve ser preservada. O objetivo principal é reorganizar a arquitetura da informação e adaptar a sidebar/header para trabalhar com diferentes módulos de gerenciamento.

A aplicação atualmente possui muitos menus administrativos misturados em uma única navegação. Isso está começando a gerar confusão porque existem tipos de informação com frequências e responsáveis muito diferentes.

A solução desejada é trabalhar com “módulos” ou “modos de gerenciamento”, que podem ser alternados pelo usuário através do seletor no header.

==================================================
1. CONCEITO DE MÓDULOS
==================================================

No header existe atualmente o nome do contexto, por exemplo:

[ 📅 Programação & Eventos ▾ ]

Esse elemento deve funcionar como um seletor de módulo.

O usuário poderá alternar entre diferentes contextos administrativos.

Módulos previstos:

1. Programação & Eventos
2. Agenda Pastoral
3. Dados da Paróquia
4. Comunicação / Pascom (futuro)

IMPORTANTE:
Não implementar necessariamente o módulo de Blog/Pascom agora se as páginas ainda não existirem. A arquitetura deve apenas permitir sua inclusão futura.

Ao trocar o módulo, a sidebar deve mudar para mostrar somente os menus pertencentes àquele contexto.

==================================================
2. MÓDULO: PROGRAMAÇÃO & EVENTOS
==================================================

Este é o módulo que estamos implementando agora.

A sidebar deve ser organizada assim:

PROGRAMAÇÃO & EVENTOS

- Início
- Calendário Paroquial
- Programação Recorrente
- Eventos

COMUNICAÇÃO & AVISOS

- Banners
- Faixa de Alerta

IMPORTANTE:
“Banners” e “Faixa de Alerta” DEVEM ser mantidos neste módulo.

As telas já existentes de Banners e Faixa de Alerta não devem ser removidas nem recriadas desnecessariamente.

Elas já possuem uma estrutura visual consistente com o painel atual.

A ideia é que Programação & Eventos seja o contexto de administração da programação e do conteúdo de destaque/avisos do site paroquial.

Portanto:

Programação & Eventos
→ Calendário e programação pastoral

Comunicação & Avisos
→ Banners e avisos exibidos no site

Não criar uma nova seção ou módulo separado apenas para Banners e Faixa de Alerta.

==================================================
3. REMOVER “COMUNIDADES” DESTE MÓDULO
==================================================

Não criar o menu “Comunidades” dentro de Programação & Eventos.

Isso é intencional.

As comunidades são uma entidade institucional da paróquia e sua gestão deverá pertencer ao módulo “Dados da Paróquia”.

Na área de Programação & Eventos, a comunidade será utilizada como:

- filtro;
- relacionamento;
- informação contextual;
- agrupamento da programação.

Por exemplo:

Programação Recorrente

Matriz São José
  Domingo · 08:00 · Missa
  Domingo · 19:00 · Missa
  Quarta-feira · 19:30 · Terço

Santa Edwiges
  Sábado · 18:00 · Missa

Não criar uma página independente de comunidades dentro desse módulo.

==================================================
4. PÁGINA “INÍCIO” DE PROGRAMAÇÃO & EVENTOS
==================================================

Criar uma página inicial operacional para esse módulo.

Título:

“Programação & Eventos”

Descrição:

“Organize a programação pastoral e os eventos das comunidades da paróquia.”

A página deve funcionar como um resumo do que está acontecendo e do que acontecerá nos próximos dias.

Não transformar essa página em um dashboard corporativo cheio de gráficos.

Priorizar informação útil para a secretaria.

Estrutura sugerida:

-----------------------------------
PRÓXIMOS EVENTOS
-----------------------------------

Mostrar os próximos compromissos da programação agrupados por data.

Exemplo:

HOJE · QUINTA, 1 DE OUTUBRO

19:00
Missa
Matriz São José
[Recorrente]

AMANHÃ · SEXTA, 2 DE OUTUBRO

08:00
Missa
Santa Edwiges
[Recorrente]

19:30
Terço
Nossa Senhora do Rosário
[Recorrente]

SÁBADO, 3 DE OUTUBRO

16:00
Celebração da Palavra
Sagrada Família
[Evento]

Cada item deve permitir acessar os detalhes.

-----------------------------------
CALENDÁRIO
-----------------------------------

Mostrar uma visualização mensal compacta do calendário.

O calendário deve indicar os dias que possuem programação.

Permitir clicar em uma data para visualizar seus compromissos.

Adicionar navegação entre meses.

-----------------------------------
PROGRAMAÇÃO RECORRENTE
-----------------------------------

Mostrar um resumo das programações recorrentes cadastradas.

A comunidade deve aparecer como contexto.

Exemplo:

Programação Recorrente

[ Todas as comunidades ▾ ]

Matriz São José

Domingo
08:00 · Missa
19:00 · Missa

Quarta-feira
19:30 · Terço

Santa Edwiges

Sábado
18:00 · Missa

Adicionar botão:

“Ver programação recorrente →”

-----------------------------------

Não colocar Banners ou Faixa de Alerta como cards principais dessa Home.

Eles já possuem seus próprios menus na sidebar.

==================================================
5. PÁGINA “CALENDÁRIO PAROQUIAL”
==================================================

Esta página deve ser a visualização completa da programação por data.

Permitir:

- navegar entre meses;
- visualizar eventos;
- visualizar programações recorrentes;
- filtrar por comunidade;
- filtrar por tipo;
- selecionar uma data;
- criar novo evento;
- acessar detalhes.

A comunidade deve ser um filtro/contexto, não uma entidade de navegação independente.

==================================================
6. PÁGINA “PROGRAMAÇÃO RECORRENTE”
==================================================

Esta página será dedicada exclusivamente às atividades que se repetem.

Permitir:

- visualizar recorrências;
- criar nova recorrência;
- editar;
- desativar;
- filtrar por comunidade;
- filtrar por tipo/categoria.

Exemplo:

Programação Recorrente

[ Todas as comunidades ▾ ] [ Tipo ▾ ] [+ Nova programação]

Matriz São José

DOMINGO
08:00 · Missa
19:00 · Missa

QUARTA-FEIRA
19:30 · Terço

Santa Edwiges

SÁBADO
18:00 · Missa

A interface deve deixar muito claro que essas configurações representam a programação habitual das comunidades.

==================================================
7. PÁGINA “EVENTOS”
==================================================

Criar uma página específica para eventos pontuais.

Exemplos:

- Festa da Padroeira
- Festa da Comunidade
- Encontro
- Palestra
- Procissão
- Celebração especial

Permitir:

- listar eventos;
- filtrar por período;
- filtrar por comunidade;
- filtrar por categoria/tipo;
- criar;
- editar;
- cancelar/remover.

Diferenciar visualmente um “Evento” de uma programação “Recorrente”.

==================================================
8. BANNERS
==================================================

MANTER a página atual de Banners.

A página já possui:

- título “Banners em Destaque”;
- botão “Ver no site público”;
- botão “Novo Banner”;
- cards/lista de banners;
- ordenação;
- status ativo;
- edição;
- preview visual;
- possibilidade de adicionar banner.

Não substituir essa tela por uma nova solução.

Apenas garantir que ela fique acessível dentro de:

COMUNICAÇÃO & AVISOS
→ Banners

==================================================
9. FAIXA DE ALERTA
==================================================

MANTER a página atual de Faixa de Alerta.

Ela já possui:

- status da faixa;
- ativar/desativar;
- preview do site;
- configuração do letreiro;
- janela/modal de detalhes;
- botão de edição.

Não remover nem simplificar essa funcionalidade.

Ela deve permanecer em:

COMUNICAÇÃO & AVISOS
→ Faixa de Alerta

==================================================
10. MÓDULO: AGENDA PASTORAL
==================================================

Criar a estrutura para que, quando o usuário selecionar:

[ 📅 Agenda Pastoral ▾ ]

a sidebar passe a mostrar apenas as funcionalidades relacionadas aos atendimentos.

Sugestão:

AGENDA PASTORAL

- Início
- Agenda
- Solicitações
- Bloqueios
- Agentes Pastorais
- Categorias
- Relatórios

A Agenda Pastoral possui uma lógica completamente diferente da Programação & Eventos.

Ela trata de:

- atendimentos individuais;
- agentes pastorais;
- fiéis que solicitaram atendimento;
- tipos de atendimento;
- horários;
- bloqueios;
- solicitações;
- cancelamentos.

Não misturar esses menus com Programação & Eventos.

==================================================
11. MÓDULO: DADOS DA PARÓQUIA
==================================================

Criar a estrutura para futuramente trabalhar com:

[ 🏛 Dados da Paróquia ▾ ]

Sugestão:

DADOS INSTITUCIONAIS

- Início
- Comunidades
- Clérigos
- Banners institucionais, caso aplicável
- demais informações institucionais

A gestão das comunidades deve ficar aqui.

Isso é importante porque comunidades são dados institucionais e não uma funcionalidade específica da programação.

Essas informações tendem a ser alteradas com baixa frequência.

==================================================
12. MÓDULO FUTURO: COMUNICAÇÃO / PASCOM
==================================================

No futuro existirá um módulo próprio para gerenciamento do blog e conteúdo editorial.

Não implementar funcionalidades que ainda não existem.

A arquitetura apenas deve permitir futuramente algo como:

[ 📰 Comunicação / Pascom ▾ ]

BLOG

- Início
- Publicações
- Categorias
- etc.

Esse módulo será utilizado principalmente pela Pascom.

==================================================
13. SELETOR DE MÓDULO NO HEADER
==================================================

O seletor no header é uma parte importante dessa mudança.

Atualmente aparece algo como:

[ 📅 Programação & Eventos ▾ ]

Ao clicar, abrir um menu/dropdown com os módulos disponíveis.

Exemplo:

┌───────────────────────────────────┐
│ Módulo                            │
│                                   │
│ ✓  Programação & Eventos          │
│    Calendário e comunicação       │
│                                   │
│    Agenda Pastoral                │
│    Atendimentos e agentes         │
│                                   │
│    Dados da Paróquia              │
│    Informações institucionais     │
│                                   │
│    Comunicação / Pascom           │
│    Blog e publicações             │
└───────────────────────────────────┘

O módulo atual deve ficar claramente identificado.

O usuário não deve precisar voltar ao início para trocar de contexto.

==================================================
14. PRINCÍPIO DE UX
==================================================

A principal razão dessa mudança é separar tipos diferentes de trabalho.

A secretaria trabalha frequentemente com:

AGENDA PASTORAL
→ atendimentos, solicitações e bloqueios.

Já as informações institucionais são alteradas com menor frequência:

DADOS DA PARÓQUIA
→ comunidades, clérigos e informações institucionais.

A programação do site possui outro fluxo:

PROGRAMAÇÃO & EVENTOS
→ calendário, programação recorrente, eventos, banners e avisos.

E futuramente:

PASCOM
→ blog e conteúdo editorial.

A interface deve refletir essas diferenças.

Não quero simplesmente esconder menus em submenus.

Quero que o usuário perceba que está entrando em um CONTEXTO diferente de trabalho.

==================================================
15. IDENTIDADE VISUAL
==================================================

Preservar a identidade visual atual mostrada nas telas existentes.

Características importantes:

- sidebar verde escura institucional;
- logotipo da Paróquia São José;
- fundo claro;
- títulos e elementos tipográficos com aparência editorial/institucional;
- detalhes dourados;
- botões principais verdes;
- cards com bordas discretas;
- bastante espaço em branco;
- aparência elegante, pastoral e institucional;
- evitar estética excessivamente corporativa;
- evitar excesso de cores;
- não adicionar gráficos apenas para preencher espaço.

As páginas existentes de Banners e Faixa de Alerta devem continuar visualmente consistentes.

==================================================
16. O QUE NÃO FAZER
==================================================

Não:

- criar “Comunidades” dentro de Programação & Eventos;
- remover Banners;
- remover Faixa de Alerta;
- criar uma nova área separada para Banners;
- transformar a Home em um dashboard cheio de métricas;
- duplicar a gestão de comunidades;
- misturar Agenda Pastoral com Programação & Eventos;
- misturar dados institucionais com programação;
- criar funcionalidades de Blog que ainda não existem;
- alterar desnecessariamente componentes visuais já existentes.

==================================================
OBJETIVO FINAL
==================================================

A nova arquitetura deve resultar em algo conceitualmente simples:

MÓDULO: PROGRAMAÇÃO & EVENTOS

Programação & Eventos
├── Início
├── Calendário Paroquial
├── Programação Recorrente
├── Eventos
│
└── COMUNICAÇÃO & AVISOS
    ├── Banners
    └── Faixa de Alerta


MÓDULO: AGENDA PASTORAL

Agenda Pastoral
├── Início
├── Agenda
├── Solicitações
├── Bloqueios
├── Agentes Pastorais
├── Categorias
└── Relatórios


MÓDULO: DADOS DA PARÓQUIA

Dados da Paróquia
├── Início
├── Comunidades
├── Clérigos
└── demais informações institucionais


MÓDULO FUTURO: PASCOM

Comunicação / Pascom
├── Blog
├── Publicações
├── Categorias
└── etc.

A regra principal é:

PROGRAMACÃO & EVENTOS
“Quando e o que acontece na paróquia?”

AGENDA PASTORAL
“Quem atende quem e quando?”

DADOS DA PARÓQUIA
“Quais são as informações permanentes da paróquia?”

PASCOM
“Qual conteúdo será publicado?”

Faça a implementação respeitando a arquitetura existente e reutilizando os componentes atuais sempre que possível.