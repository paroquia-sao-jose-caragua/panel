'use client';

import React from 'react';
import Link from 'next/link';
import {
  Megaphone,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  PlusCircle,
  Pencil,
  Image as ImageIcon,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Flame,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ShieldCheck,
  Building2,
  Church,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export default function AnnouncementsHelpPage() {
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
              Manual: Banners, Avisos & Alertas Urgentes
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href="/avisos/alerta/editar">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Editar Alerta no Topo
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/avisos">
                Ver Todos os Avisos
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-brand-gradient text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold border border-white/15">
            <Megaphone className="w-3.5 h-3.5 text-brand-400" />
            <span>Guia de Comunicação & Divulgação Pastoral</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Manual: Banners, Avisos Paroquiais & Alertas Urgentes
          </h1>

          <p className="text-sm sm:text-base text-brand-100 max-w-2xl leading-relaxed">
            Aprenda a publicar comunicados essenciais na capa do site público da Paróquia São José de Caraguatatuba, configurar a faixa de alerta urgente no topo de todas as páginas e organizar o carrossel de banners com datas de validade automática.
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
                1. Visão Geral da Comunicação
              </a>
              <a href="#alerta-urgente" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                2. A Barra de Alerta no Topo
              </a>
              <a href="#variantes-alerta" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                3. Variantes Litúrgicas e Cores
              </a>
              <a href="#cadastrar-banner" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                4. Como Cadastrar um Banner
              </a>
              <a href="#reordenar-banners" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                5. Reordenação e Prioridade
              </a>
              <a href="#validade-expiracao" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                6. Validade e Expiração
              </a>
              <a href="#casos-pastorais" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                7. Casos Pastorais (Reformas & Festas)
              </a>
              <a href="#faq-avisos" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                8. Perguntas Frequentes
              </a>
            </nav>

            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-center text-xs">
                <Link href="/avisos/adicionar">
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                  Novo Banner
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full justify-center bg-brand-700 hover:bg-brand-800 text-white text-xs">
                <Link href="/avisos">
                  <Megaphone className="w-3.5 h-3.5 mr-1.5" />
                  Gerenciar Banners
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
                Visão Geral da Comunicação & Banners Paroquiais
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O módulo <strong>Banners & Avisos</strong> (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/avisos</code>) é a ferramenta de comunicação em tempo real da Paróquia São José. Ele permite que a secretaria transmita orientações urgentes, divulgue eventos da comunidade e mantenha o fiel sempre bem informado:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Faixa de Alerta Superior Fixa
                </span>
                <p className="text-zinc-500">
                  Uma barra de destaque fixada no topo de todas as páginas do site, ideal para comunicados urgentes, mudanças pontuais de horários ou grandes solenidades litúrgicas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5 text-sm">
                  <Layers className="w-4 h-4 text-brand-700" />
                  Carrossel de Banners da Capa
                </span>
                <p className="text-zinc-500">
                  Cards e banners ilustrados exibidos na página inicial do site para divulgar quermesses, encontros de pastorais, cursos de noivos, batizados e campanhas da paróquia.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Top Alert Bar */}
          <section id="alerta-urgente" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                A Barra de Alerta Urgente no Topo do Site
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para ativar ou editar o alerta que aparece no topo do site público, acesse <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/avisos/alerta/editar</code> ou clique no card <strong>"Editar Alerta no Topo"</strong>:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Campos do Alerta Superior:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                  <li><strong>Status Ativo / Inativo:</strong> Permite ativar ou desativar a barra instantaneamente com um clique.</li>
                  <li><strong>Título Principal:</strong> Frase curta de impacto (ex: <em>"Atenção: Missa de Domingo Transferida"</em> ou <em>"Inscrições Abertas da Catequese 2026"</em>).</li>
                  <li><strong>Mensagem / Detalhes:</strong> Explicação concisa com orientações aos fiéis.</li>
                  <li><strong>Botão de Ação Opcional:</strong> Texto do botão (ex: <em>"Ver Detalhes"</em>, <em>"Fazer Inscrição"</em>) e link de direcionamento.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Liturgical Variants & Colors */}
          <section id="variantes-alerta" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Variantes Litúrgicas e Esquemas de Cores
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O sistema oferece três estilos visuais pré-configurados que se adaptam perfeitamente à gravidade ou solenidade do aviso:
            </p>

            <div className="space-y-3 text-xs">
              {/* Variant 1: Alert */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-red-950 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>1. Alerta Urgente (Rubro / Vermelho Escuro)</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-red-100 text-red-800 border-red-300">
                    variant: alert
                  </Badge>
                </div>
                <p className="text-zinc-600">
                  <strong>Indicação:</strong> Cancelamento inesperado de celebração, reformas emergenciais, enchentes, quedas de energia elétrica ou avisos graves que exigem atenção imediata.
                </p>
              </div>

              {/* Variant 2: Info */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                    <Info className="w-4 h-4 text-emerald-700" />
                    <span>2. Comunicado Paroquial (Verde Paroquial Institucional)</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300">
                    variant: info
                  </Badge>
                </div>
                <p className="text-zinc-600">
                  <strong>Indicação:</strong> Notícias gerais da secretaria, início das inscrições de catequese/crisma, plantões especiais de confissões ou reuniões pastorais.
                </p>
              </div>

              {/* Variant 3: Solemnity */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>3. Solenidade / Festa Litúrgica (Dourado Nobre)</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-900 border-amber-300">
                    variant: solemnity
                  </Badge>
                </div>
                <p className="text-zinc-600">
                  <strong>Indicação:</strong> Festa do Padroeiro São José (19 de Março), Semana Santa, Domingo de Páscoa, Natal do Senhor, Corpus Christi e aniversários paroquiais.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Adding Banners */}
          <section id="cadastrar-banner" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Como Cadastrar e Publicar um Banner
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para cadastrar um banner no carrossel, acesse <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/avisos/adicionar</code>:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">1</span>
                  <span>Título e Descrição do Evento</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Informe um título chamativo e um resumo explicativo sobre o evento ou comunicado pastoral.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">2</span>
                  <span>Imagem de Alta Qualidade (Arte ou Foto)</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Faça o upload da arte ou foto. Recomenda-se imagem no formato paisagem (16:9) em alta resolução, com textos legíveis para dispositivos móveis.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">3</span>
                  <span>Link de Direcionamento (Call to Action)</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Ao clicar no banner, para onde o fiel será levado? Você pode colocar um link para formulário de inscrição externa, link do WhatsApp da secretaria ou página do site.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Reordering Banners */}
          <section id="reordenar-banners" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Reordenação e Prioridade de Banners
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Na listagem de banners (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/avisos</code>), cada card possui setas interativas para subir ou descer a posição na fila:
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="p-1 rounded bg-white border border-zinc-300 text-zinc-700"><ArrowUp className="w-3.5 h-3.5" /></span>
                  <span className="p-1 rounded bg-white border border-zinc-300 text-zinc-700"><ArrowDown className="w-3.5 h-3.5" /></span>
                </div>
                <span className="font-semibold text-zinc-900 text-sm">Controle de Posição Imediato</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                <li>O primeiro banner da lista é o primeiro exibido para o visitante que abre a Home do site.</li>
                <li>Ao clicar na seta para cima ou para baixo, o sistema salva a nova ordenação imediatamente sem necessidade de recarregar a página.</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Expiration */}
          <section id="validade-expiracao" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Validade e Expiração Automática de Eventos
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para evitar que banners de eventos antigos continuem sendo exibidos após sua realização (como uma quermesse do último sábado ou um retiro que já passou), o painel possui <strong>controle de validade</strong>:
            </p>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-2 text-sm text-emerald-900">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Expiração Inteligente</span>
              </div>
              <p>
                Ao preencher a data de expiração, assim que o prazo for atingido, o banner é desativado automaticamente pelo sistema, mantendo o site da paróquia sempre atualizado e moderno sem exigir remoção manual da secretaria.
              </p>
            </div>
          </section>

          {/* Section 7: Pastoral Cases (Renovations, Cancellations) */}
          <section id="casos-pastorais" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Casos Pastorais: Reformas, Quermesses & Cancelamentos
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Church className="w-4 h-4 text-brand-600" />
                  <span>Capelas em Obras ou Missas Transferidas</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Conforme citado no <Link href="/ajuda/comunidades#boas-praticas" className="text-brand-700 underline font-semibold">Manual de Comunidades</Link>, quando uma capela entra em reforma ou a missa dominical precisa ser temporariamente transferida para a Igreja Matriz:
                </p>
                <ol className="space-y-1 list-decimal pl-5 text-zinc-600">
                  <li>Ative o <strong>Alerta Superior</strong> com variante <em>info</em> ou <em>alert</em> explicando a transferência e o período previsto.</li>
                  <li>Publique um <strong>Banner Ilustrado</strong> na capa com orientações sobre o local das celebrações e o andamento das melhorias.</li>
                </ol>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Recessos da Secretaria & Plantões Festivos</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Em recessos de fim de ano, feriados santos ou reformas no prédio da secretaria paroquial, ative a faixa de alerta para comunicar aos fiéis o retorno do atendimento presencial.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: FAQ */}
          <section id="faq-avisos" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Perguntas Frequentes sobre Banners & Avisos
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Quantos banners posso deixar ativos simultaneamente?
                </span>
                <p className="text-zinc-600">
                  Recomendamos manter entre 3 e 5 banners ativos ao mesmo tempo. Muitos banners fazem com que o visitante não veja todas as artes; priorize os eventos mais próximos e desative os que já ocorreram.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Posso usar o alerta superior sem botão de link?
                </span>
                <p className="text-zinc-600">
                  Sim. Se o comunicado for apenas uma mensagem informativa sem necessidade de direcionamento externo, basta deixar os campos de texto do botão e URL em branco. A barra será exibida com a mensagem limpa.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Quem pode publicar banners e editar a faixa de alerta?
                </span>
                <p className="text-zinc-600">
                  Usuários com papel de <strong>Secretária</strong> e <strong>Administrador</strong> têm permissão total para criar, editar, reordenar e excluir banners, bem como ligar ou desligar a barra de alerta urgente.
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
