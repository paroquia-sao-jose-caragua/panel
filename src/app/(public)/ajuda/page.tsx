'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  BookOpen,
  CalendarCheck,
  Printer,
  Clock,
  Home,
  Users,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  HelpCircle,
  FileText,
  Phone,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Lock,
  Compass,
  AlertTriangle,
  Megaphone,
  CheckSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

interface HelpTopic {
  id: string;
  category: 'appointments' | 'general' | 'secretariat' | 'system';
  title: string;
  description: string;
  badge: string;
  role: 'Todos' | 'Secretaria' | 'Padres & Agentes' | 'Administradores';
  readTime: string;
  href?: string;
  highlights: string[];
}

const TOPICS: HelpTopic[] = [
  {
    id: 'novo-agendamento',
    category: 'appointments',
    title: 'Como registrar um Novo Agendamento pelo Painel',
    description:
      'Guia para secretárias e agentes registrarem atendimentos presenciais ou por telefone com validação de horários.',
    badge: 'Agendamentos',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/agendamentos#como-agendar',
    highlights: [
      'Seleção automática do sacerdote ou escolha de agente',
      'Carga dinâmica de horários livres no calendário',
      'Dados de visitas domiciliares aos enfermos',
      'Definição de status e anotações pastorais internas',
    ],
  },
  {
    id: 'relatorio-pauta-pdf',
    category: 'appointments',
    title: 'Gerando a Pauta em PDF e Checklist para o Padre',
    description:
      'Como filtrar por período, gerar a folha timbrada para impressão e enviar a pauta formatada por WhatsApp.',
    badge: 'Relatórios & PDF',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/agendamentos#relatorio-pdf',
    highlights: [
      'Filtro por período: Hoje, Amanhã, Esta Semana ou Personalizado',
      'Checklist impresso: Compareceu, Desmarcou, Reagendou ou Faltou',
      'Linhas pautadas para anotações do sacerdote a caneta',
      'Botão de 1 clique para copiar o resumo para o WhatsApp',
    ],
  },
  {
    id: 'grade-horarios-bloqueios',
    category: 'appointments',
    title: 'Grade de Horários Semanais e Bloqueios de Data',
    description:
      'Como o sacerdote ou ministro configura sua disponibilidade semanal e bloqueia datas para retiros ou férias.',
    badge: 'Disponibilidade',
    role: 'Padres & Agentes',
    readTime: '4 min',
    href: '/ajuda/agendamentos#grade-e-bloqueios',
    highlights: [
      'Ativação dos dias da semana com horário de início e término',
      'Configuração da duração do atendimento (ex: 30 ou 45 min)',
      'Bloqueio pontual com motivo (férias, viagem, retiro)',
      'Prevenção automática de conflitos na agenda',
    ],
  },
  {
    id: 'visitas-enfermos',
    category: 'appointments',
    title: 'Atendimento Domiciliar e Unção dos Enfermos',
    description:
      'Requisitos especiais e preenchimento de endereço e condições de saúde dos enfermos para visitas pastorais.',
    badge: 'Visitas Domiciliares',
    role: 'Todos',
    readTime: '3 min',
    href: '/ajuda/agendamentos#visitas-domiciliares',
    highlights: [
      'Endereço completo com ponto de referência',
      'Condições do paciente: acamado, lúcido, deglute hóstia',
      'Instruções de acesso e cuidados da família',
    ],
  },
  {
    id: 'pausa-agendamento-online',
    category: 'appointments',
    title: 'Pausar ou Ativar o Agendamento Online no Site',
    description:
      'Como suspender temporariamente novos agendamentos públicos com aviso personalizado aos fiéis.',
    badge: 'Configurações',
    role: 'Secretaria',
    readTime: '2 min',
    href: '/ajuda/agendamentos#pausar-agendamento',
    highlights: [
      'Interrupção imediata de novas solicitações pelo site',
      'Mensagem e título personalizados na página pública',
      'A secretaria e os padres continuam podendo agendar internamente',
    ],
  },
  {
    id: 'secretaria-pix',
    category: 'secretariat',
    title: 'Gerenciando Dados da Secretaria e Chaves PIX',
    description:
      'Atualização dos contatos paroquiais, horário de atendimento e chaves de dízimo e doações.',
    badge: 'Secretaria',
    role: 'Secretaria',
    readTime: '3 min',
    highlights: [
      'Configuração de telefone, WhatsApp e e-mail da secretaria',
      'Horários de atendimento ao público na matriz',
      'Chave PIX e gerador automático de QR Code Copia e Cola',
    ],
  },
  {
    id: 'comunidades-missas',
    category: 'general',
    title: 'Cadastro de Comunidades, Capelas e Horários de Missa',
    description:
      'Como manter atualizada a lista de comunidades paroquiais e suas celebrações eucarísticas.',
    badge: 'Comunidades',
    role: 'Secretaria',
    readTime: '5 min',
    highlights: [
      'Missas regulares semanais e dominicais',
      'Missas devocionais e novenas',
      'Festas anuais dos padroeiros de cada capela',
    ],
  },
  {
    id: 'usuarios-permissoes',
    category: 'system',
    title: 'Papéis de Usuários e Permissões de Acesso',
    description:
      'Entenda as diferenças entre Administrador, Secretária e Agente Pastoral no painel.',
    badge: 'Segurança',
    role: 'Administradores',
    readTime: '3 min',
    highlights: [
      'Administrador: controle total do sistema e paróquia',
      'Secretária: gestão de agendamentos, avisos, secretaria e missas',
      'Agente Pastoral: visualização restrita à própria pauta e horários',
    ],
  },
];

const FAQS = [
  {
    question: 'A secretária pode criar agendamentos mesmo com o agendamento online pausado?',
    answer:
      'Sim! Quando o agendamento online é desativado nas configurações, apenas o site público impede que os fiéis solicitem novos horários pela internet. A equipe da secretaria e os sacerdotes continuam com permissão total para registrar agendamentos recebidos por telefone ou presencialmente.',
  },
  {
    question: 'Como o Padre acessa seus atendimentos no painel?',
    answer:
      'Ao fazer login com seu e-mail e senha de "Agente Pastoral", o sacerdote é direcionado diretamente para o seu hub de atendimentos. Ele só visualiza os agendamentos atribuídos ao seu nome, podendo consultar dados do fiel, confirmar ou remarcar, além de definir sua grade semanal de horários e bloqueios pontuais de férias.',
  },
  {
    question: 'Se o Padre não quiser usar o computador ou celular, como a secretaria procede?',
    answer:
      'A secretaria pode acessar a tela de "Relatório & Pauta (PDF)", escolher o período (ex: "Hoje" ou "Esta Semana"), selecionar o Padre e clicar em "Imprimir / Salvar em PDF". A folha já sai timbrada com o checklist de comparecimento para o padre assinalar a caneta e linhas para anotações. Além disso, a secretária pode clicar em "Copiar p/ WhatsApp" para enviar a lista do dia diretamente no chat do sacerdote.',
  },
  {
    question: 'O fiel pode cancelar um agendamento sozinho?',
    answer:
      'Sim. Quando o fiel faz um agendamento pelo site, ele recebe um link com token de acesso exclusivo (ex: /agendamentos/track/CODIGO). Por essa página, ele pode verificar o status do pedido e cancelar o atendimento com justificativa, liberando automaticamente a vaga na agenda do padre.',
  },
  {
    question: 'O que acontece quando o sacerdote bloqueia uma data?',
    answer:
      'O sistema bloqueia imediatamente todos os horários daquele sacerdote no dia ou período especificado, tanto no site público quanto no painel da secretaria. Caso já houvesse agendamentos anteriores para aquela data, eles são sinalizados para que a secretaria entre em contato com os fiéis e faça o reagendamento.',
  },
];

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filtered topics based on search and category
  const filteredTopics = useMemo(() => {
    return TOPICS.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'all' || topic.category === selectedCategory;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        topic.title.toLowerCase().includes(term) ||
        topic.description.toLowerCase().includes(term) ||
        topic.badge.toLowerCase().includes(term) ||
        topic.highlights.some((h) => h.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col">
      {/* Top Navbar (Light Background with logo-light.png) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo-light.png"
                alt="Paróquia São José"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="h-5 w-px bg-zinc-200 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Central de Ajuda & Manuais</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex text-xs border-zinc-200 text-zinc-700 hover:text-brand-700 hover:bg-zinc-50">
              <Link href="/ajuda/agendamentos">
                <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                Manual de Agendamentos
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/">
                <span>Acessar Painel</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Parish Background and Generous Padding */}
      <section className="relative bg-brand-gradient text-white py-20 sm:py-28 lg:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d6a64a_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-200 text-xs font-medium border border-white/15 backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>Documentação Oficial do Painel Paroquial</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-white">
            Como podemos ajudar você hoje?
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
            Consulte instruções passo a passo, boas práticas pastorais e tutoriais completos para a Secretaria, Padres e Agentes da Paróquia São José de Caraguatatuba.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Busque por 'agendamento', 'visita domiciliar', 'relatório PDF', 'horários'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-13 pl-12 pr-4 bg-white text-zinc-900 placeholder:text-zinc-400 rounded-2xl shadow-xl text-sm border-0 focus:outline-none focus:ring-3 focus:ring-brand-400/80 transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-medium px-2 py-1 bg-zinc-100 rounded-md"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-brand-200">
              <span className="font-semibold text-white/80">Buscas rápidas:</span>
              {[
                'Agendamento',
                'Pauta em PDF',
                'Visita Domiciliar',
                'Grade de Horários',
                'Bloqueios',
                'WhatsApp',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchTerm(tag)}
                  className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-brand-100 transition cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-12">
        {/* SPECIAL HIGHLIGHT CARD: Agendamentos Pastorais (User's main focus) */}
        <section className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold border border-brand-200">
                <CalendarCheck className="w-3.5 h-3.5 text-brand-700" />
                <span>Módulo em Destaque</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-serif">
                  Guia Completo: Atendimentos & Agendamentos Pastorais
                </h2>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                  Aprenda como a Secretaria e os Padres trabalham em harmonia: desde o agendamento presencial até a geração da pauta impressa em PDF com checklist de presença e envio para o WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                  <div className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Secretaria</span>
                  </div>
                  <p className="text-zinc-500">Agende para fiéis por telefone, aprove solicitações e gere pautas em PDF.</p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                  <div className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Padres & Diáconos</span>
                  </div>
                  <p className="text-zinc-500">Configure horários semanais, bloqueie datas e consulte sua pauta pessoal.</p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                  <div className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Visitas & Saúde</span>
                  </div>
                  <p className="text-zinc-500">Controle completo de visitas a enfermos, acamados e unção dos enfermos.</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button asChild size="lg" className="bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-md">
                <Link href="/ajuda/agendamentos">
                  <FileText className="w-4 h-4 mr-2" />
                  Abrir Manual de Agendamentos
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="cursor-pointer border-zinc-300">
                <Link href="/agendamentos/relatorio">
                  <Printer className="w-4 h-4 mr-2 text-zinc-600" />
                  Ver Tela de Relatório & PDF
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 font-serif">
                Tópicos e Artigos de Ajuda
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Navegue pelas áreas do painel ou use o campo de busca acima.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Todos os Tópicos' },
                { id: 'appointments', label: 'Agendamentos' },
                { id: 'secretariat', label: 'Secretaria & PIX' },
                { id: 'general', label: 'Comunidades & Missas' },
                { id: 'system', label: 'Usuários & Segurança' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-brand-700 text-white shadow-2xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          {filteredTopics.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-zinc-200 space-y-3">
              <Search className="w-8 h-8 text-zinc-300 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-700">
                Nenhum tópico encontrado para "{searchTerm}"
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Tente buscar por termos mais genéricos como "agenda", "padre", "pdf" ou "visita".
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-xs mt-2"
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-full">
                        {topic.badge}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <span>Perfil: <strong className="text-zinc-600">{topic.role}</strong></span>
                        <span>•</span>
                        <span>{topic.readTime}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-zinc-900 group-hover:text-brand-700 transition">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-1">
                      {topic.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {topic.href ? (
                    <Button asChild variant="outline" size="sm" className="w-full justify-between border-zinc-200 group-hover:border-brand-300 group-hover:bg-brand-50/50 cursor-pointer text-xs">
                      <Link href={topic.href}>
                        <span>Ler Manual Completo</span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-brand-700 transition" />
                      </Link>
                    </Button>
                  ) : (
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                      <span>Artigo integrado no painel</span>
                      <CheckSquare className="w-4 h-4 text-zinc-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700 border border-amber-200/80">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 font-serif">
                Perguntas Frequentes (FAQ)
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Dúvidas comuns da rotina paroquial e operacional do painel.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className="border border-zinc-200 rounded-xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-zinc-50/50 hover:bg-zinc-50 transition cursor-pointer"
                  >
                    <span className="font-semibold text-sm text-zinc-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-brand-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 py-4 text-xs sm:text-sm text-zinc-600 bg-white border-t border-zinc-100 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Assistance / Support Footer Banner */}
        <section className="bg-brand-50 border border-brand-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-950 font-serif">
              Ainda tem dúvidas sobre o funcionamento do painel?
            </h3>
            <p className="text-xs text-brand-800 max-w-xl">
              Entre em contato com a equipe pastoral ou com o suporte técnico paroquial para orientações personalizadas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/ajuda/agendamentos">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Manual Passo a Passo
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-300 text-brand-900 bg-white hover:bg-brand-100 text-xs">
              <Link href="/">
                Ir para o Painel
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-900 border-t border-brand-800 py-10 px-4 text-center text-xs text-brand-200">
        <p className="font-semibold text-white">
          Paróquia São José de Caraguatatuba • Diocese de Caraguatatuba
        </p>
        <p className="text-[11px] text-brand-300/80 mt-1">
          Central de Ajuda e Documentação Operacional • Desenvolvido para uso paroquial
        </p>
      </footer>
    </div>
  );
}
