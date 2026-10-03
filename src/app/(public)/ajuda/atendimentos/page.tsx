'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Printer,
  Clock,
  Home,
  CheckSquare,
  Users,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Calendar,
  Sparkles,
  Phone,
  Lock,
  Tag,
  Share2,
  ChevronRight,
  BookOpen,
  Smartphone,
  ShieldCheck,
  FileText,
  UserCheck,
  Sliders,
  CalendarOff,
  History,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export default function AppointmentsHelpPage() {
  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col scroll-smooth">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-xs -ml-2 text-zinc-600 hover:text-zinc-900">
              <Link href={ROUTES.HELP.HOME}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Voltar à Central de Ajuda
              </Link>
            </Button>
            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
              Manual do Agente Pastoral & Atendimentos
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href={ROUTES.MY_AGENDA.HOME}>
                <Smartphone className="w-3.5 h-3.5 mr-1.5 text-brand-700" />
                Minha Agenda
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href={ROUTES.APPOINTMENTS.HOME}>
                Agenda Pastoral
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-brand-gradient text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold border border-white/15">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Manual Oficial do Agente Pastoral & Secretaria</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Manual de Atendimentos & Agenda Pastoral
          </h1>

          <p className="text-sm sm:text-base text-brand-100 max-w-2xl leading-relaxed">
            Guia completo para sacerdotes, diáconos, agentes pastorais e equipe da secretaria paroquial. Aprenda a gerenciar sua agenda pelo celular, emitir pautas impressas em PDF e cadastrar atendimentos pastorais.
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
                1. Visão Geral da Arquitetura
              </a>
              <a href="#minha-agenda-mobile" className="block p-1.5 rounded-lg text-brand-800 bg-brand-50/60 hover:bg-brand-50 font-bold transition">
                2. App Minha Agenda (Celular)
              </a>
              <a href="#como-agendar" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                3. Cadastro de Atendimentos
              </a>
              <a href="#visitas-domiciliares" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                4. Visitas a Enfermos e Unção
              </a>
              <a href="#relatorio-pdf" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                5. Pauta em PDF e Checklist do Padre
              </a>
              <a href="#whatsapp" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                6. Envio da Agenda por WhatsApp
              </a>
              <a href="#grade-e-bloqueios" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                7. Grade de Horários e Bloqueios
              </a>
              <a href="#pausar-agendamento" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                8. Pausar Atendimento Online
              </a>
            </nav>

            <div className="pt-3 border-t border-zinc-100 space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-center text-xs">
                <Link href={ROUTES.MY_AGENDA.SCHEDULE}>
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-700" />
                  Abrir Minha Agenda
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full justify-center text-xs text-zinc-600 hover:text-zinc-900">
                <Link href={ROUTES.APPOINTMENTS.REPORT}>
                  <Printer className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                  Gerar Pauta em PDF
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
                Visão Geral da Arquitetura de Atendimentos
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O sistema de agendamentos e atendimento pastoral da Paróquia São José é dividido em três camadas integradas:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block">1. Site Público (Fiéis)</span>
                <p className="text-zinc-500">
                  O fiel escolhe o serviço, sacerdote, comunidade, data e horário disponível. Recebe link com token seguro para acompanhar ou cancelar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block">2. Secretaria Paroquial</span>
                <p className="text-zinc-500">
                  Cadastra pedidos feitos por telefone ou balcão, gerencia categorias, emite relatórios impressos em PDF e exporta pautas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs text-emerald-950">
                <span className="font-bold text-emerald-900 block">3. Padres e Agentes Pastorais</span>
                <p className="text-emerald-800">
                  Acessam o aplicativo mobile <strong>Minha Agenda</strong>, visualizam atendimentos em tempo real, aprovam solicitações e ajustam sua própria disponibilidade.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Mobile Agent App */}
          <section id="minha-agenda-mobile" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Manual do Agente Pastoral (Aplicativo Minha Agenda)
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O módulo <strong>Minha Agenda</strong> (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/minha-agenda</code>) foi desenhado especificamente para celular e telas sensíveis ao toque, permitindo que clérigos e agentes pastorais controlem sua rotina pastoral na palma da mão:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Feature 1 */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <Calendar className="w-4 h-4 text-brand-700" />
                  <span>Esteira Contínua de Dias (/minha-agenda/agenda)</span>
                </div>
                <p className="text-zinc-600">
                  Deslize o dedo da direita para a esquerda para navegar pelos dias. O dia selecionado fica no centro em destaque verde, atualizando instantaneamente os atendimentos confirmados logo abaixo. Você também pode usar as setas laterais para rolar dia a dia.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Solicitações Pendentes (/minha-agenda/solicitacoes)</span>
                </div>
                <p className="text-zinc-600">
                  Novos pedidos de atendimento enviados pelos fiéis através do site público chegam nesta aba. Você pode conferir os detalhes e com um toque <strong>Aprovar</strong> ou <strong>Recusar</strong> com justificativa.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <Sliders className="w-4 h-4 text-amber-700" />
                  <span>Disponibilidade Semanal (/minha-agenda/configuracoes/disponibilidade)</span>
                </div>
                <p className="text-zinc-600">
                  Configure quais dias da semana você atende, horário de início, término, duração média de cada atendimento e em qual comunidade/capela você estará disponível.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <CalendarOff className="w-4 h-4 text-rose-700" />
                  <span>Bloqueios de Datas (/minha-agenda/configuracoes/bloqueios)</span>
                </div>
                <p className="text-zinc-600">
                  Precisa se ausentar para um retiro diocesano, reunião pastoral ou férias? Adicione um bloqueio de período para impedir novos agendamentos nessas datas automaticamente.
                </p>
              </div>
            </div>

            <div className="p-4 bg-brand-50 border border-brand-200/80 rounded-xl space-y-2 text-xs text-brand-950">
              <div className="font-bold flex items-center gap-1.5 text-sm text-brand-900">
                <Smartphone className="w-4 h-4 text-brand-700" />
                <span>Instalando o Painel como Aplicativo (PWA) no Celular</span>
              </div>
              <p className="text-brand-900/90 leading-relaxed">
                Você pode instalar o painel diretamente na tela inicial do seu celular (iOS ou Android). No Safari do iPhone, clique em <strong>Compartilhar</strong> e depois em <strong>"Adicionar à Tela de Início"</strong>. No Android (Chrome), toque no menu de 3 pontinhos e selecione <strong>"Instalar aplicativo"</strong>.
              </p>
            </div>
          </section>

          {/* Section 3: How to Register an Appointment */}
          <section id="como-agendar" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Como Registrar um Atendimento pelo Painel
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Sempre que um paroquiano ligar ou for à secretaria paroquial para marcar confissão, direção espiritual, bênção ou visita aos enfermos, utilize o assistente em <strong>Novo Atendimento</strong> (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/agenda-pastoral/adicionar</code> ou <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/minha-agenda/novo</code>).
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">A</span>
                  <span>Seleção do Padre ou Agente Pastoral</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Se você estiver logado como <strong>Secretária</strong> ou <strong>Administrador</strong>, selecione o sacerdote desejado na lista suspensa. Se o próprio sacerdote estiver logado em sua conta, o sistema já seleciona automaticamente o seu próprio perfil.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">B</span>
                  <span>Escolha do Serviço e Comunidade</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  O painel filtra apenas os serviços que aquele sacerdote realiza (ex: confissão, bênção, visita aos enfermos). Escolha a comunidade onde será o atendimento (ex: Secretaria Paroquial, Matriz ou Capela).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">C</span>
                  <span>Seleção da Data e Horários Dinâmicos</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Ao escolher o dia no calendário, o sistema calcula em tempo real os horários disponíveis com base na grade semanal do sacerdote, excluindo automaticamente horários já ocupados ou datas bloqueadas. Basta clicar no botão do horário desejado.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">D</span>
                  <span>Dados do Fiel e Status Inicial</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Preencha o nome do fiel e telefone com DDD (WhatsApp). Como o atendimento foi acordado diretamente pela secretaria, o status inicial vem pré-selecionado como <strong>Confirmado</strong>. Há também um campo de <strong>Anotações Pastorais Confidenciais</strong>, que fica visível apenas para a secretaria e para o sacerdote.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">E</span>
                  <span>Revisão e Confirmação</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Clique em "Avançar para Revisão". Uma ficha completa com todos os dados é exibida. Clique em "Confirmar e Agendar" para concluir.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Home Visits */}
          <section id="visitas-domiciliares" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Visitas a Enfermos e Unção dos Enfermos
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Quando a categoria do serviço for uma <strong>Visita Domiciliar</strong> (ou exigir endereço), o painel exibe automaticamente uma seção especializada para coleta de dados de saúde:
            </p>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3 text-xs text-amber-950">
              <div className="font-bold flex items-center gap-2 text-sm text-amber-900">
                <Home className="w-4 h-4 text-amber-700" />
                <span>Campos Específicos para Visita:</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-5">
                <li><strong>Nome do Paciente / Enfermo:</strong> caso quem esteja ligando seja um filho, cônjuge ou vizinho.</li>
                <li><strong>Grau de Parentesco:</strong> identificação de quem acompanha a pessoa.</li>
                <li><strong>Endereço Completo com Referência:</strong> rua, número, bairro e orientações de portão/acesso.</li>
                <li><strong>Condição Clínica (Checkboxes):</strong> assinale se o enfermo está <em>Acamado</em>, se <em>Deglute a Santa Hóstia</em> (fundamental para o rito da Eucaristia) e se está <em>Lúcido</em>.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: PDF Report and Priest Checklist */}
          <section id="relatorio-pdf" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Gerando a Pauta em PDF e Checklist para o Padre
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Se o sacerdote preferir não acessar o sistema pelo celular, a secretaria pode gerar em poucos segundos a folha de pauta em PDF pronta para impressão:
            </p>

            <div className="space-y-3 text-xs text-zinc-700">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <strong>1. Acesse o menu:</strong> Clique em <em>Relatório & Pauta (PDF)</em> na sidebar ou pelo botão no topo de <em>Agenda Pastoral</em> (<code className="bg-white px-1 py-0.5 rounded border">/agenda-pastoral/relatorio</code>).
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <strong>2. Escolha o período:</strong> Use os botões rápidos como <em>"Hoje"</em>, <em>"Amanhã"</em>, <em>"Esta Semana"</em> ou selecione datas personalizadas.
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <strong>3. Selecione o Padre:</strong> Filtre especificamente pelo nome do pároco, vigário ou diácono para o qual a pauta será entregue.
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <strong>4. Clique em "Imprimir / Salvar em PDF":</strong> O navegador abrirá a tela de impressão já formatada em folha timbrada oficial da Paróquia São José. Basta selecionar <em>"Salvar como PDF"</em> para gerar o arquivo ou enviar para a impressora.
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-900">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span>O Checklist de Presença na Folha Impressa</span>
              </div>
              <p>
                Cada atendimento impresso na folha vem com caixinhas para o sacerdote marcar com caneta:
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 font-semibold text-zinc-900 bg-white p-2.5 rounded-lg border border-emerald-200/80">
                <span>[ ] Compareceu</span>
                <span>[ ] Desmarcou</span>
                <span>[ ] Reagendou</span>
                <span>[ ] Faltou</span>
              </div>
              <p className="pt-1">
                Abaixo de cada atendimento há ainda linhas pautadas para anotações pastorais manuais do sacerdote.
              </p>
            </div>
          </section>

          {/* Section 6: WhatsApp Export */}
          <section id="whatsapp" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Envio da Agenda Diária por WhatsApp
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Na tela de relatório (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/agenda-pastoral/relatorio</code>), há um botão inteligente chamado <strong>"Copiar p/ WhatsApp"</strong>:
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-xs">
              <p className="text-zinc-600">
                Ao clicar nesse botão, o sistema compila todos os atendimentos do dia ou da semana com formatação de negrito e emojis do WhatsApp, incluindo horários, nomes dos fiéis, telefones, tipo de atendimento e quem é o sacerdote responsável.
              </p>
              <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                📋 *PAUTA DE ATENDIMENTOS PASTORAIS*<br />
                *Paróquia São José de Caraguatatuba*<br />
                📅 Período: 01/10/2026<br />
                👤 Atendente: Pe. Carlos — Pároco<br /><br />
                1. 🕒 *14:00 - 14:30*<br />
                &nbsp;&nbsp;&nbsp;👤 *Fiel:* João da Silva<br />
                &nbsp;&nbsp;&nbsp;📞 *Telefone:* (12) 99123-4567<br />
                &nbsp;&nbsp;&nbsp;✝️ *Atendimento:* Direção Espiritual<br />
                &nbsp;&nbsp;&nbsp;🙏 *Agente Pastoral:* Pe. Carlos (Pároco)
              </div>
            </div>
          </section>

          {/* Section 7: Schedule and Blocks */}
          <section id="grade-e-bloqueios" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Grade de Horários e Bloqueios de Data
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Cada sacerdote ou ministro possui sua própria agenda semanal configurável:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Grade Semanal</span>
                </div>
                <p className="text-zinc-500">
                  Define em quais dias da semana o sacerdote atende (ex: terças e quintas), o horário de início (ex: 14:00), término (ex: 17:00) e a duração de cada slot (ex: 30 minutos).
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>Bloqueios Pontuais</span>
                </div>
                <p className="text-zinc-500">
                  Permite travar dias específicos por motivo de férias do clero, retiros espirituais diocesanos ou imprevistos, impedindo qualquer agendamento naquela data.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Pause Global Scheduling */}
          <section id="pausar-agendamento" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Pausar ou Ativar o Atendimento Online
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Em períodos de recesso de fim de ano, mutirão de confissões ou reformas na secretaria, a secretaria ou o administrador pode suspender temporariamente novos agendamentos públicos:
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-2">
              <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                <li>Acesse a tela de <strong>Gerenciar Atendimentos</strong> (<code className="bg-white px-1 py-0.5 rounded border">/agenda-pastoral/gerenciar</code>).</li>
                <li>Alterne o interruptor do banner para <strong>"Desativado"</strong>.</li>
                <li>Você pode personalizar o título do aviso e o recado explicativo que os fiéis verão ao acessar a página de agendamentos no site público.</li>
                <li>A equipe da secretaria e os sacerdotes continuam com acesso para registrar atendimentos manuais quando necessário.</li>
              </ul>
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
