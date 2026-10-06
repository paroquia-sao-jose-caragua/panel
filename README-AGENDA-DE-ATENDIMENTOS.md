Quero atualizar a tela "Agenda de Atendimentos" do painel administrativo da secretaria da paróquia.

IMPORTANTE:
- Não altere a estrutura geral do painel, sidebar, header, identidade visual ou outras páginas.
- Não altere regras de negócio, APIs, modelos, dados ou permissões.
- Esta alteração é principalmente de UX/UI e organização da tela da Agenda.
- Preserve os componentes e padrões visuais já existentes no projeto sempre que possível.
- A referência visual da nova interação é a tela "Minha Agenda" do aplicativo do padre: o dia selecionado fica claramente destacado e os atendimentos daquele dia são exibidos abaixo.

OBJETIVO

A Agenda da secretaria deve ser orientada por "dia selecionado", e não mais por uma listagem contínua de todos os dias do mês.

O fluxo deve ser:

1. Usuária escolhe/visualiza uma data.
2. A interface destaca claramente essa data.
3. Abaixo são exibidos SOMENTE os atendimentos daquele dia.
4. A usuária pode navegar rapidamente para o dia anterior/próximo, voltar para Hoje ou escolher uma data específica.
5. O mês deixa de ser a unidade principal da interface e passa a ser apenas uma forma de navegação/seleção de datas.

Isso é importante porque a secretaria trabalha principalmente no gerenciamento diário da agenda.

--------------------------------------------------
1. CABEÇALHO DA PÁGINA
--------------------------------------------------

Manter:

Título:
"Agenda de Atendimentos"

Subtítulo:
"Visualização cronológica dos atendimentos confirmados distribuídos por dia e horário."

Na mesma linha do título, alinhado à direita, deve existir APENAS:

[ + Novo atendimento ]

--------------------------------------------------
2. FAIXA HORIZONTAL DE DIAS
--------------------------------------------------

Abaixo do título/subtítulo, criar uma área centralizada de navegação de datas, inspirada diretamente na experiência mobile da "Minha Agenda" do padre.

Exemplo:

30       01       02       [03]       04       05       06
Qua      Qui      Sex       Sáb       Dom      Seg      Ter

A data selecionada deve possuir destaque visual forte usando a identidade visual verde da paróquia, inspirada diretamente na experiência mobile da "Minha Agenda" do padre.

O dia selecionado deve mostrar:

Sáb
03
●

Os demais dias ficam visualmente neutros.

A faixa deve permitir navegar para dias anteriores/posteriores através de setas nas extremidades, clique direto ou scroll, inspirado na experiência mobile da "Minha Agenda" do padre.

O objetivo é permitir que a secretaria alterne rapidamente entre dias sem precisar abrir o calendário.

Se possível, mostrar um pequeno indicador nos dias que possuem atendimentos.

Exemplo:

01    02    [03]    04    05    06
      •       •             •

Não utilizar indicadores exagerados.

--------------------------------------------------
3. REMOVER A LISTAGEM CONTÍNUA DO MÊS
--------------------------------------------------

A versão atual apresenta algo como:

Quinta-feira, 1 de outubro
Nenhum atendimento...

Sexta-feira, 2 de outubro
Nenhum atendimento...

Sábado, 3 de outubro
3 atendimentos...

Domingo, 4 de outubro
Nenhum atendimento...

Essa estrutura deve ser removida.

NÃO exibir vários dias simultaneamente.

A interface deve exibir somente o dia selecionado.

Isso é fundamental.

O seletor de datas é que permite navegar entre os dias.

--------------------------------------------------
5. CONTEÚDO DO DIA
--------------------------------------------------

Abaixo da navegação:

Sábado, 3 de outubro

3 atendimentos confirmados

À direita:

[ + Adicionar atendimento ]

O dia deve ficar FORA dos cards de atendimento.

Não criar um card envolvendo o título "Sábado, 3 de outubro".

A estrutura deve ser:

Sábado, 3 de outubro
3 atendimentos confirmados                         + Adicionar atendimento

[ card do atendimento ]

[ card do atendimento ]

[ card do atendimento ]

--------------------------------------------------
6. CARDS DOS ATENDIMENTOS
--------------------------------------------------

Os cards devem se inspirar visualmente na tela mobile do padre, mas adaptados para desktop.

Exemplo:

09:30

●  Confissão
   Sacramento da Penitência

   👤 Silvério Rodrigues
   📍 Matriz / Paróquia

                                          ⋯

Outro:

10:00

●  Confissão
   Sacramento da Penitência

   👤 Maria das Dores
   📍 Matriz / Paróquia

                                          ⋯

Outro:

10:30

●  Aconselhamento e Outros
   Aconselhamento pastoral

   👤 Julia Almeida
   📍 Matriz / Paróquia

                                          ⋯

O desktop pode utilizar o espaço horizontal para organizar melhor as informações.

Manter:
- horário
- categoria/título
- descrição
- solicitante
- comunidade/local
- agente pastoral responsável
- menu de ações

Os cards devem ser compactos o suficiente para permitir visualizar vários atendimentos na mesma tela.

--------------------------------------------------
7. DIA SEM ATENDIMENTOS
--------------------------------------------------

Quando o dia selecionado não possuir atendimentos, NÃO mostrar outros dias.

Mostrar:

Domingo, 4 de outubro
0 atendimentos confirmados                    + Adicionar atendimento


------------------------------------------------

               Nenhum atendimento confirmado nesta data
Os horários livres continuam disponíveis conforme sua grade semanal.

               [ + Adicionar atendimento ]

------------------------------------------------

O estado vazio deve continuar permitindo criar diretamente um atendimento para a data selecionada.

IMPORTANTE:
Ao clicar em "Adicionar atendimento", a data atual/selecionada deve ser preenchida automaticamente no formulário.

--------------------------------------------------
8. FILTROS
--------------------------------------------------

O conceito de filtro deve ser revisto.

Como a tela agora é explicitamente orientada por uma data selecionada, não utilizar "filtro por dia" como um filtro separado.

A data selecionada JÁ É o contexto da agenda.

Se existirem filtros adicionais, como:
- agente pastoral
- categoria

eles podem continuar disponíveis em um botão "Filtros", mas não devem competir visualmente com o seletor de data.

Se os filtros existentes atualmente não forem necessários para esta alteração, preserve a funcionalidade, mas mantenha-os visualmente secundários.

--------------------------------------------------
9. RESPONSIVIDADE
--------------------------------------------------

Desktop:
- aproveitar o espaço horizontal;
- cards mais densos que no mobile;
- manter leitura rápida;
- permitir visualizar vários atendimentos simultaneamente.

Mobile:
- preservar/adaptar a experiência já existente da Agenda pessoal do padre;
- ver como o atual calendário se comporta em dispositivos móveis na agenda pessoal dos agentes.
- não quebrar o layout atual;
- o novo componente de seleção de datas deve continuar funcionando bem em telas menores.

┌────────────────────────────────────────────────────────────────────┐
│ 🕐 Aguardando confirmação                    🗓️ Ter, 06 out • 14:30 – 15:00         │
│                                                                    │
│ Confissão                                                          │
│ Terça-feira, 06 de outubro                                        │
│                                                                    │
│ ───────────────────────────────────────────────────────────────── │
│                                                                    │
│ SOLICITANTE                         AGENTE RESPONSÁVEL              │
│ Giselle Hoekveld                    Pe. Padre Altair Santos        │
│ O próprio fiel                      Pároco                         │
│ ☎ (12) 98272-9649                                                  │
│                                                                    │
│ LOCAL DE ATENDIMENTO                                               │
│ 📍 Comunidade Matriz                                               │
│                                                                    │
│ ───────────────────────────────────────────────────────────────── │
│ [ ✕ Recusar ]       [ ✓ Confirmar atendimento ]             •••    │
└────────────────────────────────────────────────────────────────────┘