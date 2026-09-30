'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  PlusCircle,
  Pencil,
  Image as ImageIcon,
  Heart,
  Calendar,
  Award,
  Crown,
  Church,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export default function ClergyHelpPage() {
  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col scroll-smooth">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-xs -ml-2 text-zinc-600 hover:text-zinc-900">
              <Link href="/ajuda">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Voltar à Central de Ajuda
              </Link>
            </Button>
            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
              Manual: Gestão de Clérigos & Padres
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href="/clerigos/adicionar">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-zinc-600" />
                Novo Clérigo
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/clerigos">
                Ver Clérigos
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-brand-gradient text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold border border-white/15">
            <Users className="w-3.5 h-3.5 text-brand-400" />
            <span>Guia Pastoral & Institucional</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Manual: Gestão de Clérigos & Quem nos conduz na fé
          </h1>

          <p className="text-sm sm:text-base text-brand-100 max-w-2xl leading-relaxed">
            Aprenda a gerenciar os sacerdotes, diáconos permanentes e autoridades religiosas da Paróquia São José de Caraguatatuba e da Diocese, configurando fotos oficiais, lemas vocacionais e o destaque do Pároco no site público.
          </p>
        </div>
      </div>

      {/* Main Content Layout with Sticky Table of Contents */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-8">
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-700" />
              <span>Neste Manual</span>
            </h3>

            <nav className="space-y-1 text-xs">
              <a href="#visao-geral" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                1. Visão Geral do Módulo
              </a>
              <a href="#cargos-eclesiasticos" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                2. Hierarquia e Cargos Suportados
              </a>
              <a href="#cadastrar-clerigo" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                3. Como Cadastrar um Clérigo
              </a>
              <a href="#clerigo-principal" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                4. O Clérigo Principal (Pároco)
              </a>
              <a href="#foto-biografia" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                5. Foto, Biografia e Lema
              </a>
              <a href="#edicao-site" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                6. Edição e Exibição no Site
              </a>
              <a href="#faq-clerigos" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                7. Perguntas Frequentes
              </a>
            </nav>

            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-center text-xs">
                <Link href="/clerigos/adicionar">
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                  Cadastrar Clérigo
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full justify-center bg-brand-700 hover:bg-brand-800 text-white text-xs">
                <Link href="/clerigos">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  Gerenciar Clérigos
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Documentation Sections */}
        <main className="space-y-12 leading-relaxed text-zinc-800">
          {/* Section 1: Overview */}
          <section id="visao-geral" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Visão Geral do Módulo de Clérigos
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O módulo <strong>Clérigos</strong> (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/clerigos</code>) é o espaço onde a secretaria registra as autoridades eclesiásticas que pastoreiam e conduzem a Paróquia São José de Caraguatatuba. Todos os dados cadastrados aqui alimentam com riqueza e beleza a seção pública <em>"Quem nos conduz na fé"</em> no site institucional:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  Pároco em Destaque
                </span>
                <p className="text-zinc-500">
                  Card solene principal destacando o pastor da paróquia com foto oficial, lema e biografia.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-700" />
                  Corpo do Clero
                </span>
                <p className="text-zinc-500">
                  Vigários paroquiais, diáconos permanentes e clérigos auxiliares que celebram na comunidade.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Church className="w-3.5 h-3.5 text-blue-600" />
                  Autoridades Diocesanas
                </span>
                <p className="text-zinc-500">
                  Possibilidade de homenagear o Bispo Diocesano e a comunhão com o Santo Padre.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Hierarchy & Roles */}
          <section id="cargos-eclesiasticos" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Hierarquia e Cargos Suportados no Sistema
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O sistema possui categorias padronizadas de acordo com o direito canônico e a organização paroquial:
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                  <span className="font-bold text-zinc-900 block">Pároco (Parish Priest)</span>
                  <p className="text-zinc-500">O sacerdote responsável principal pela cura de almas da Paróquia São José.</p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                  <span className="font-bold text-zinc-900 block">Vigário Paroquial (Parochial Vicar)</span>
                  <p className="text-zinc-500">Sacerdotes cooperadores que auxiliam nas missas, confissões e sacramentos.</p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                  <span className="font-bold text-zinc-900 block">Diácono Permanente (Permanent Deacon)</span>
                  <p className="text-zinc-500">Diáconos que presidem batizados, matrimônios e celebrações da Palavra.</p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                  <span className="font-bold text-zinc-900 block">Bispo Diocesano (Diocesan Bishop)</span>
                  <p className="text-zinc-500">O pastor titular da Diocese de Caraguatatuba.</p>
                </div>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-brand-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Título Personalizado (roleName):</strong> Além da categoria canônica, você pode digitar livremente o título que será exibido no site, como <em>"Pároco & Reitor"</em>, <em>"Vigário Cooperador"</em> ou <em>"Diácono Assistente"</em>.
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Adding Clergy */}
          <section id="cadastrar-clerigo" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Como Cadastrar um Novo Clérigo Passo a Passo
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para cadastrar um novo sacerdote ou autoridade, acesse <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/clerigos/adicionar</code> pelo botão <strong>"+ Novo Clérigo"</strong>:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">1</span>
                  <span>Nome Completo com Título Religioso</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Preencha o nome acompanhado do título eclesiástico usual (ex: <code>Pe. André Luiz</code>, <code>Diác. Fernando</code>, <code>Dom José Carlos</code>).
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">2</span>
                  <span>Posição Eclesiástica e Título Público</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Selecione se ele é Pároco, Vigário, Diácono ou Bispo e informe a denominação formal que os fiéis verão no cartão.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">3</span>
                  <span>Ordem de Exibição (Numérica)</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Defina um número para ordenar os cards no site (ex: <code>1</code> para o Pároco, <code>2</code> para o Vigário, <code>3</code> em diante para os Diáconos). Números menores aparecem primeiro.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Main Clergy Member */}
          <section id="clerigo-principal" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                O Clérigo Principal (Destaque do Pároco)
              </h2>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs text-amber-950">
              <div className="font-bold flex items-center gap-2 text-sm text-amber-900">
                <Crown className="w-4 h-4 text-amber-700" />
                <span>O que é a marcação "Clérigo Principal"?</span>
              </div>
              <p>
                Ao marcar a opção <strong>"Clérigo Principal"</strong> (campo <code>isMain</code>), aquele membro passa a ser apresentado no painel e no site em um <strong>card de destaque hero</strong> com foto maior, moldura litúrgica dourada e biografia em primeiro plano.
              </p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Geralmente é atribuído ao <strong>Pároco</strong> da Igreja Matriz.</li>
                <li>Caso nenhum membro tenha sido marcado explicitamente como principal, o sistema elege automaticamente o clérigo cadastrado com o cargo de <em>Pároco</em>.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Photo, Biography & Motto */}
          <section id="foto-biografia" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Foto Oficial, Biografia e Lema Vocacional
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para que a apresentação da equipe pastoral seja acolhedora e inspiradora para os fiéis e paroquianos:
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <ImageIcon className="w-4 h-4 text-brand-600" />
                  <span>Foto Oficial e Fallbacks Inteligentes</span>
                </div>
                <p className="text-zinc-600">
                  Faça o upload de uma foto nítida e bem iluminada do sacerdote ou diácono em traje clerical (clergyman ou túnica/estola). Caso ainda não tenha a foto, o sistema exibe automaticamente uma bela ilustração eclesiástica correspondente ao cargo (ex: <code>/clergies/paroco.png</code> ou <code>/clergies/diacono.png</code>).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>Lema de Ordenação</span>
                  </div>
                  <p className="text-zinc-600">
                    Cadastre a frase bíblica escolhida pelo clérigo para sua vida sacerdotal (ex: <em>"O Bom Pastor dá a vida por suas ovelhas"</em> ou <em>"Eis-me aqui, envia-me a mim"</em>).
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Data de Ordenação</span>
                  </div>
                  <p className="text-zinc-600">
                    Registre a data em que o clérigo recebeu o sacramento da Ordem. O site poderá calcular os anos de ministério e exibir datas comemorativas de jubileu.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Editing & Site Sync */}
          <section id="edicao-site" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Edição, Reordenação e Sincronização Imediata
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para atualizar informações de qualquer clérigo cadastrado:
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs">
              <ol className="space-y-2 list-decimal pl-5 text-zinc-600">
                <li>Acesse o menu <strong>Clérigos</strong> (<code className="bg-white px-1 py-0.5 rounded border">/clerigos</code>).</li>
                <li>Clique no botão <strong>"Editar Informações"</strong> no card do membro desejado.</li>
                <li>Atualize os campos (foto, biografia, lema, ordem ou telefone) e clique em salvar.</li>
                <li>A alteração é refletida em tempo real em todas as páginas públicas do site.</li>
              </ol>
            </div>
          </section>

          {/* Section 7: FAQ */}
          <section id="faq-clerigos" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Perguntas Frequentes sobre Clérigos
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Qual a diferença entre cadastrar um Clérigo e criar um Usuário do Painel?
                </span>
                <p className="text-zinc-600">
                  O cadastro de <strong>Clérigo</strong> alimenta a apresentação pública institucional (foto, história e lema no site). Já a criação de um <strong>Usuário do Painel</strong> (com papel de Agente Pastoral) serve para que o padre acerte o login no sistema para consultar sua pauta de agendamentos e configurar seus horários de atendimento.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  O que fazer quando um padre ou vigário é transferido da paróquia?
                </span>
                <p className="text-zinc-600">
                  A secretaria pode editar o clérigo para atualizar o período de provisão ou removê-lo da listagem pública ativa através do botão de exclusão. Se ele tiver um usuário de login no painel, o administrador pode desativar seu acesso em <em>Configurações → Usuários</em>.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Posso cadastrar mais de um Pároco?
                </span>
                <p className="text-zinc-600">
                  Normalmente uma paróquia possui um único Pároco (ou Administrador Paroquial). Os outros sacerdotes cooperadores devem ser cadastrados com o cargo de <strong>Vigário Paroquial</strong> para manter a conformidade canônica.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-brand-900 border-t border-brand-800 py-10 px-4 text-center text-xs text-brand-200 mt-auto">
        <p className="font-semibold text-white">
          Paróquia São José de Caraguatatuba • Diocese de Caraguatatuba
        </p>
        <p className="text-[11px] text-brand-300/80 mt-1">
          Documentação de Apoio à Gestão Paroquial
        </p>
      </footer>
    </div>
  );
}
