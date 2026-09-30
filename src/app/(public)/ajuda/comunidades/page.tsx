'use client';

import React from 'react';
import Link from 'next/link';
import {
  Church,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Flame,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Heart,
  PlusCircle,
  Edit,
  HelpCircle,
  CheckSquare,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export default function CommunitiesHelpPage() {
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
              Manual de Comunidades, Capelas & Missas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href="/adicionar-comunidade">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-zinc-600" />
                Nova Comunidade
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/">
                Ver Comunidades
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-brand-gradient text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold border border-white/15">
            <Church className="w-3.5 h-3.5 text-brand-400" />
            <span>Guia Pastoral & Litúrgico</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Manual: Cadastro de Comunidades, Capelas & Horários de Missa
          </h1>

          <p className="text-sm sm:text-base text-brand-100 max-w-2xl leading-relaxed">
            Aprenda a cadastrar e gerenciar a Matriz e todas as Capelas da Paróquia São José de Caraguatatuba, organizando as celebrações eucarísticas em três modalidades: Missas Regulares Semanais, Missas Devocionais e Solenidades Anuais.
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
                1. Visão Geral da Rede Paroquial
              </a>
              <a href="#cadastro-comunidade" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                2. Cadastro de Nova Comunidade
              </a>
              <a href="#missas-regulares" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                3. Missas Regulares (Semanais)
              </a>
              <a href="#missas-devocionais" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                4. Missas Devocionais & Novenas
              </a>
              <a href="#missas-anuais" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                5. Missas Anuais & Solenidades
              </a>
              <a href="#padroeiro-galeria" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                6. Padroeiro, História e Galeria
              </a>
              <a href="#boas-praticas" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                7. Boas Práticas & Exibição no Site
              </a>
              <a href="#faq-comunidades" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                8. Perguntas Frequentes
              </a>
            </nav>

            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-center text-xs">
                <Link href="/adicionar-comunidade">
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                  Cadastrar Capela
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full justify-center bg-brand-700 hover:bg-brand-800 text-white text-xs">
                <Link href="/">
                  <Church className="w-3.5 h-3.5 mr-1.5" />
                  Gerenciar Comunidades
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
                Visão Geral da Rede de Comunidades & Missas
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              A Paróquia São José é composta pela <strong>Igreja Matriz</strong> e diversas <strong>Capelas</strong> distribuídas pelos bairros de Caraguatatuba. O módulo de Comunidades do painel (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/</code>) permite que a secretaria organize toda essa estrutura paroquial com precisão litúrgica:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Church className="w-3.5 h-3.5 text-brand-700" />
                  Identidade da Capela
                </span>
                <p className="text-zinc-500">
                  Nome oficial, história, padroeiro, fotos e endereço completo com localização para acolher fiéis e turistas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-700" />
                  Grade de Missas
                </span>
                <p className="text-zinc-500">
                  Separação clara entre celebrações regulares semanais, novenas devocionais e grandes festividades anuais.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-700" />
                  Sincronização no Site
                </span>
                <p className="text-zinc-500">
                  Alimenta a lista inteligente de <em>Próximas Missas</em> na Home do site e o catálogo da página <code>/comunidades</code>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Adding a Community */}
          <section id="cadastro-comunidade" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Como Cadastrar e Editar uma Comunidade
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para cadastrar uma nova comunidade, clique em <strong>"+ Adicionar Comunidade"</strong> na tela inicial do painel ou acesse <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/adicionar-comunidade</code>. O formulário é intuitivo e seguro:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">A</span>
                  <span>Nome da Comunidade e Identificador (Slug)</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Preencha o nome solene da capela (ex: <code>Capela Santo Antônio</code> ou <code>Comunidade Nossa Senhora de Fátima</code>). O sistema gera automaticamente um slug limpo para a URL amigável do site (ex: <code>/santo-antonio</code>).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">B</span>
                  <span>Endereço, Bairro e Telefone Local</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Informe o logradouro, número, bairro e orientações de referência. Caso a comunidade tenha um telefone ou WhatsApp exclusivo dos coordenadores pastorais locais, informe para facilitar a comunicação direta.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">C</span>
                  <span>Foto de Capa e Lema Pastoral</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Faça o upload de uma imagem nítida da fachada externa ou do altar da capela (formato horizontal recomendado, 16:9). Adicione também uma frase de acolhida ou lema pastoral que será exibido no topo da página da comunidade no site.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Regular Masses */}
          <section id="missas-regulares" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Missas Regulares: Celebrações Dominicais e Semanais
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              As <strong>Missas Regulares</strong> (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/[slug]/adicionar-missa-regular</code>) constituem a espinha dorsal litúrgica da comunidade. São as celebrações que se repetem toda semana no mesmo dia e horário:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>Campos ao Cadastrar Missa Regular:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                  <li><strong>Dia da Semana:</strong> Selecione de Domingo a Sábado (ex: <em>Domingo</em>).</li>
                  <li><strong>Horário:</strong> Informe o horário de início (ex: <code>08:00</code>, <code>10:00</code> ou <code>19:30</code>).</li>
                  <li><strong>Celebrante Habitual:</strong> Nome do padre, pároco, vigário ou ministro que habitualmente celebra aquele horário (opcional).</li>
                  <li><strong>Observações / Caráter Litúrgico:</strong> Informações adicionais de utilidade aos fiéis (ex: <em>"Missa com Catequese"</em>, <em>"Transmissão ao vivo pelo YouTube"</em>, <em>"Bênção dos Alimentos e da Saúde"</em>).</li>
                </ul>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Como o site organiza as missas:</strong> No site público, o sistema calcula automaticamente qual é a próxima missa mais próxima no tempo presente e a exibe com destaque na página inicial, permitindo que o fiel encontre onde ir à missa hoje em segundos.
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Devotional Masses */}
          <section id="missas-devocionais" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Missas Devocionais, Novenas e Bênçãos
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              As <strong>Missas Devocionais</strong> (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/[slug]/adicionar-missa-devocional</code>) são celebrações que ocorrem em ciclos devocionais específicos, com forte piedade popular dos paroquianos:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Exemplos Típicos:</span>
                </div>
                <ul className="space-y-1 list-disc pl-5 text-zinc-600">
                  <li><strong>1ª Sexta-feira do Mês:</strong> Missa do Sagrado Coração de Jesus às 19h30.</li>
                  <li><strong>Dia 19 de cada mês:</strong> Missa Votiva e Oração a São José.</li>
                  <li><strong>Quintas-feiras:</strong> Missa com Adoração e Bênção Solene do Santíssimo Sacramento.</li>
                  <li><strong>Novenas Perpétuas:</strong> Novena de Nossa Senhora Desatadora dos Nós ou Perpétuo Socorro.</li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Periodicidade & Detalhes:</span>
                </div>
                <p className="text-zinc-600">
                  Informe o título devocional da missa, a regra de periodicidade (ex: mensal, semanal) e a descrição de como a comunidade se prepara (ex: atendimento de confissões meia hora antes da celebração).
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Annual Masses and Patron Festivities */}
          <section id="missas-anuais" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Missas Anuais, Festas de Padroeiros & Solenidades
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              As <strong>Missas Anuais</strong> (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/[slug]/adicionar-missa-anual</code>) correspondem às celebrações solenes que ocorrem em datas específicas do calendário litúrgico ou civil:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-zinc-900 block text-sm">Celebrações Solenes Recomendadas para Cadastro:</span>
                <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                  <li><strong>Festa do Padroeiro da Capela:</strong> Missa Solene do dia da padroeira ou padroeiro (ex: 13 de Junho em Santo Antônio; 04 de Outubro em São Francisco).</li>
                  <li><strong>Solenidade de São José (19 de Março):</strong> Festa do padroeiro paroquial e da cidade com procissão.</li>
                  <li><strong>Natal & Ano Novo:</strong> Missa da Noite de Natal (24 de Dezembro às 20h) e Missa da Sagrada Família.</li>
                  <li><strong>Semana Santa e Páscoa:</strong> Domingo de Ramos, Ceia do Senhor (Lava-pés), Paixão de Cristo e Vigília Pascal.</li>
                  <li><strong>Solenidade de Corpus Christi:</strong> Celebração eucarística solene seguida de procissão sobre os tapetes artísticos.</li>
                </ul>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200/80 rounded-xl text-xs text-brand-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Dica de Organização:</strong> No início de cada ano pastoral, a secretaria pode cadastrar todas as missas anuais previstas no calendário diocesano. Assim, os fiéis encontram os horários especiais com bastante antecedência.
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Patron, History and Gallery */}
          <section id="padroeiro-galeria" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Padroeiro da Capela, História e Galeria de Fotos
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Cada capela possui sua identidade espiritual e comunitária própria, que pode ser enriquecida pelas subpáginas acessíveis na tela da comunidade:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>O Santo Padroeiro</span>
                </div>
                <p className="text-zinc-600">
                  Em <code>/[slug]/padroeiro</code>, cadastre a imagem do santo, a data da memória litúrgica e um resumo de sua vida para catequizar e inspirar os fiéis.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  <span>Sobre e História</span>
                </div>
                <p className="text-zinc-600">
                  Em <code>/[slug]/sobre</code>, registre o ano em que a capela foi construída, os fundadores, as pastorais ativas e o impacto evangelizador no bairro.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Galeria de Fotos</span>
                </div>
                <p className="text-zinc-600">
                  Em <code>/[slug]/galeria</code>, publique fotos dos momentos oracionais, quermesses, batizados e procissões daquela comunidade.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Best Practices */}
          <section id="boas-praticas" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Boas Práticas de Manutenção Litúrgica
              </h2>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs">
              <ul className="space-y-2 list-disc pl-5 text-zinc-600">
                <li><strong>Revisão de Horários no Horário de Verão / Inverno:</strong> Se houver mudança costumeira nas missas da noite (ex: de 19h30 para 19h00), atualize os horários com pelo menos 1 semana de antecedência.</li>
                <li><strong>Mudanças Temporárias de Celebrante:</strong> Não é obrigatório cadastrar o nome do padre caso haja revezamento frequente entre pároco e vigários; você pode deixar o campo em branco ou preencher <em>"Clero Paroquial"</em>.</li>
                <li><strong>Avisos de Cancelamento ou Reformas:</strong> Se uma capela estiver em obras ou a missa dominical de um fim de semana específico foi transferida para a Matriz, crie um <strong>Aviso no Painel</strong> (<code className="bg-white px-1 py-0.5 rounded border">/avisos</code>) com destaque na capa. Consulte o passo a passo completo no <Link href="/ajuda/avisos" className="text-brand-700 hover:text-brand-800 underline font-semibold inline-flex items-center gap-1">Manual de Banners &amp; Avisos <ExternalLink className="w-3 h-3 inline" /></Link>.</li>
              </ul>
            </div>
          </section>

          {/* Section 8: FAQ */}
          <section id="faq-comunidades" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Perguntas Frequentes sobre Comunidades & Missas
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Como alterar o horário de uma missa já existente?
                </span>
                <p className="text-zinc-600">
                  Acesse a tela da comunidade desejada, localize a celebração no bloco de Missas Regulares, clique no ícone de lápis / editar, ajuste a hora/minuto e clique em salvar. A alteração surtirá efeito imediato em todo o site público.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Uma comunidade pode ter mais de uma missa no mesmo dia?
                </span>
                <p className="text-zinc-600">
                  Sim! Por exemplo, a Igreja Matriz pode ter missas no Domingo às 08:00, às 10:00 e às 19:30. Basta cadastrar cada celebração separadamente como uma Missa Regular dominical.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Como excluir uma capela desativada ou uma missa extinta?
                </span>
                <p className="text-zinc-600">
                  Na tela de edição da missa ou comunidade, utilize o botão de exclusão com confirmação. O sistema remove o vínculo e atualiza as listagens públicas instantaneamente.
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
