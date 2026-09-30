'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Heart,
  Phone,
  Clock,
  MapPin,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  QrCode,
  FileText,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CreditCard,
  Send,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export default function SecretariatHelpPage() {
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
              Manual da Secretaria Paroquial & PIX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href="/secretaria/doacoes">
                <QrCode className="w-3.5 h-3.5 mr-1.5 text-zinc-600" />
                Configurar PIX
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/secretaria">
                Ir p/ Secretaria
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-brand-gradient text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold border border-white/15">
            <Building2 className="w-3.5 h-3.5 text-brand-400" />
            <span>Guia Operacional Passo a Passo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Manual: Dados da Secretaria, Atendimento & Chaves PIX
          </h1>

          <p className="text-sm sm:text-base text-brand-100 max-w-2xl leading-relaxed">
            Aprenda a gerenciar os dados de contato institucional da Paróquia São José, horários de atendimento ao público, redes sociais e configuração completa de chaves PIX com QR Code dinâmico e dados bancários para o Dízimo.
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
                1. Visão Geral da Secretaria
              </a>
              <a href="#dados-contato" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                2. Contatos e Localização
              </a>
              <a href="#horario-atendimento" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                3. Horários de Atendimento
              </a>
              <a href="#redes-sociais" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                4. Redes Sociais Oficiais
              </a>
              <a href="#configuracao-pix" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                5. Chave PIX & QR Code
              </a>
              <a href="#dados-bancarios" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                6. Dados Bancários Tradicionais
              </a>
              <a href="#comprovantes-campanhas" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                7. Comprovantes & Campanhas
              </a>
              <a href="#faq-secretaria" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                8. Perguntas Frequentes
              </a>
            </nav>

            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-center text-xs">
                <Link href="/secretaria/editar">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                  Editar Contatos
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full justify-center bg-brand-700 hover:bg-brand-800 text-white text-xs">
                <Link href="/secretaria/doacoes">
                  <QrCode className="w-3.5 h-3.5 mr-1.5" />
                  Gerenciar PIX
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
                Visão Geral do Módulo de Secretaria & Doações
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O módulo <strong>Secretaria</strong> do painel administrativo (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/secretaria</code>) é o centro de controle institucional da Paróquia São José de Caraguatatuba. Todas as informações configuradas aqui são sincronizadas instantaneamente com o site público paroquial:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-700" />
                  Atendimento & Balcão
                </span>
                <p className="text-zinc-500">
                  Telefone fixo, WhatsApp institucional, e-mail de acolhida e horários de funcionamento da secretaria na Matriz.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-brand-700" />
                  PIX & Arrecadação
                </span>
                <p className="text-zinc-500">
                  Chave PIX paroquial, gerador automático do padrão Copia e Cola (EMV Banco Central) e QR Code para dízimo e ofertas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-brand-700" />
                  Comunicação Digital
                </span>
                <p className="text-zinc-500">
                  Links das redes sociais oficiais (Instagram, canal do YouTube para transmissões e página do Facebook).
                </p>
              </div>
            </div>

            <div className="p-3 bg-brand-50 border border-brand-200/80 rounded-xl text-xs text-brand-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <div>
                <strong>Sincronização em Tempo Real:</strong> Quando a secretaria altera o número de telefone, o horário de atendimento ou a chave PIX, o site público atualiza imediatamente no rodapé, na página de <em>Contato</em> (<code className="bg-white px-1 py-0.5 rounded border">/contato</code>) e na página de <em>Quero Contribuir</em> (<code className="bg-white px-1 py-0.5 rounded border">/quero-contribuir</code>).
              </div>
            </div>
          </section>

          {/* Section 2: Contact and Location */}
          <section id="dados-contato" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Atualizando Telefones, WhatsApp e Endereço
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para atualizar os canais de contato da paróquia, clique no botão <strong>"Editar Dados de Contato"</strong> ou navegue até <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/secretaria/editar</code>. O formulário é dividido em um assistente de 2 etapas seguras:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">A</span>
                  <span>Telefone Fixo e WhatsApp da Secretaria</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Informe o telefone fixo para atendimento por voz (ex: <code className="bg-white px-1 py-0.5 rounded border">(12) 3882-0000</code>) e o número de WhatsApp com DDD. Você também pode cadastrar o link direto de atendimento (<code className="bg-white px-1 py-0.5 rounded border">https://wa.me/5512999999999</code>) para que os fiéis iniciem conversas com um clique pelo celular.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">B</span>
                  <span>E-mail Institucional</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  O endereço eletrônico oficial da paróquia (ex: <code className="bg-white px-1 py-0.5 rounded border">contato@paroquiasaojosecaragua.com.br</code>). É este e-mail que receberá mensagens de pedidos de intenções, dúvidas de sacramentos e solicitações gerais.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">C</span>
                  <span>Endereço Completo da Matriz</span>
                </div>
                <p className="text-xs text-zinc-600 pl-7">
                  Preencha o logradouro, número, bairro e CEP da Igreja Matriz de São José (ex: Rua Benedito Zacarias Arouca, Centro, Caraguatatuba - SP). O site utiliza este endereço para exibir a localização e traçar rotas via Google Maps para os fiéis e turistas.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Office Hours */}
          <section id="horario-atendimento" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Configuração dos Horários de Atendimento ao Público
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O campo <strong>Horário de Atendimento</strong> é essencial para informar com clareza quando o balcão da secretaria paroquial está aberto para atendimento presencial e por telefone:
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Formatação Recomendada:</span>
              </div>
              <div className="bg-white p-3 rounded-lg border font-mono text-zinc-700 leading-relaxed">
                Segunda a Sexta: 08h às 12h e 13h30 às 17h<br />
                Sábado: 08h às 12h<br />
                Domingo e Feriados: Fechado
              </div>
              <ul className="space-y-1 list-disc pl-5 text-zinc-500">
                <li>Se houver pausa para almoço da equipe da secretaria, mencione os dois períodos explicitamente.</li>
                <li>Em recessos paroquiais (fim de ano, semana santa ou reformas), lembre-se de atualizar este campo com o aviso temporário.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Social Networks */}
          <section id="redes-sociais" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Canais de Comunicação & Redes Sociais Oficiais
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Na aba de edição da secretaria, você pode configurar os endereços das redes sociais da paróquia:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </div>
                <p className="text-zinc-500">Link completo do perfil (ex: <code className="bg-white px-1 py-0.5 rounded border">https://instagram.com/paroquiasaojosecaragua</code>).</p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube</span>
                </div>
                <p className="text-zinc-500">Canal onde ocorrem as transmissões das Santas Missas dominicais e novenas.</p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </div>
                <p className="text-zinc-500">Página oficial da comunidade paroquial no Facebook para eventos e fotos.</p>
              </div>
            </div>
          </section>

          {/* Section 5: PIX & QR Code */}
          <section id="configuracao-pix" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Configuração da Chave PIX e Gerador de QR Code
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O painel paroquial conta com um sistema próprio e independente para processar contribuições de Dízimo e Doações através do PIX (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/secretaria/doacoes</code>). Não há intermediação nem cobrança de taxas de plataformas terceiras:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Seleção do Tipo de Chave</span>
                </div>
                <p className="text-xs text-zinc-600">
                  O painel suporta os quatro tipos oficiais regulamentados pelo Banco Central do Brasil:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="p-2 bg-white rounded-lg border text-center font-medium">Telefone / Celular</div>
                  <div className="p-2 bg-white rounded-lg border text-center font-medium">CNPJ da Paróquia</div>
                  <div className="p-2 bg-white rounded-lg border text-center font-medium">E-mail Institucional</div>
                  <div className="p-2 bg-white rounded-lg border text-center font-medium">Chave Aleatória (EVP)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2. Dados do Recebedor (Titular da Conta)</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Preencha exatamente como consta na conta bancária paroquial:
                </p>
                <ul className="space-y-1 list-disc pl-5 text-xs text-zinc-600">
                  <li><strong>Nome do Favorecido:</strong> Ex: <code>Paróquia São José</code> ou <code>Diocese de Caraguatatuba</code>.</li>
                  <li><strong>Cidade do Favorecido:</strong> Ex: <code>Caraguatatuba</code>.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-900">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>Gerador Automático de PIX Copia e Cola e QR Code</span>
                </div>
                <p>
                  Assim que a chave é salva, o painel gera automaticamente a carga estática no padrão oficial EMV:
                </p>
                <ul className="space-y-1 list-disc pl-5">
                  <li><strong>QR Code Visual:</strong> Exibido no site público para fiéis que estejam no computador escanearem com o app do banco no celular.</li>
                  <li><strong>Botão "Copiar Chave Copia e Cola":</strong> Permite que fiéis que acessam o site pelo celular copiem o código com 1 toque e colem diretamente no app do banco.</li>
                  <li><strong>Botão de Teste no Painel:</strong> Na página principal da secretaria, a equipe pode testar a chave e copiar o payload para conferência a qualquer momento.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6: Traditional Bank Details */}
          <section id="dados-bancarios" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Dados Bancários Tradicionais (TED / DOC / Depósito)
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para atender paroquianos, benfeitores idosos ou empresas que preferem realizar transferências bancárias convencionais, o painel permite cadastrar a conta bancária da paróquia:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block">Identificação Bancária</span>
                <p className="text-zinc-600">Nome do Banco (ex: Banco Santander / Bradesco / Banco do Brasil), número da Agência com dígito e Conta Corrente com dígito.</p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block">Titularidade Jurídica</span>
                <p className="text-zinc-600">CNPJ da Diocese/Paróquia (ex: <code>44.428.188/0001-08</code>) e Razão Social do Beneficiário.</p>
              </div>
            </div>
          </section>

          {/* Section 7: Receipts and Campaigns */}
          <section id="comprovantes-campanhas" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Recebimento de Comprovantes & Campanhas Pastorais
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Na parte inferior da tela de Doações (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/secretaria/doacoes</code>), você pode configurar os canais de recebimento de comprovantes e os textos institucionais das campanhas:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Send className="w-4 h-4 text-brand-600" />
                  <span>WhatsApp e E-mail para Envio de Comprovantes</span>
                </div>
                <p className="text-zinc-600">
                  Os dizimistas que contribuem via PIX podem enviar o comprovante com nome completo para baixa no dízimo paroquial. Você pode definir um WhatsApp exclusivo da tesouraria/secretaria e um e-mail específico para essa finalidade.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Textos de Acolhida e Campanhas Especiais</span>
                </div>
                <p className="text-zinc-600">
                  Personalize a mensagem bíblica de acolhida do Dízimo (ex: <em>"Cada um dê conforme determinou em seu coração..."</em>) e a descrição da <strong>Campanha do Centro Pastoral</strong> ou reformas paroquiais.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: FAQ */}
          <section id="faq-secretaria" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Perguntas Frequentes sobre a Secretaria & PIX
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  A chave PIX cadastrada no painel cobra alguma taxa da paróquia?
                </span>
                <p className="text-zinc-600">
                  Não. O sistema apenas gera o código de pagamento oficial do Banco Central para a chave da própria conta da paróquia. O dinheiro cai integralmente e diretamente na conta bancária paroquial, sem intermediários.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Se mudarmos o número do WhatsApp da secretaria, o que acontece com o site?
                </span>
                <p className="text-zinc-600">
                  O site público é alimentado diretamente pela API do painel. Ao salvar o novo número em <em>Editar Dados de Contato</em>, todos os botões do site passam a apontar para o novo número instantaneamente, sem necessidade de alterar o código.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Quem pode alterar os dados da secretaria e a chave PIX?
                </span>
                <p className="text-zinc-600">
                  Apenas usuários autorizados com o papel de <strong>Secretaria</strong> ou <strong>Administrador</strong> têm permissão para editar os dados institucionais e bancários da paróquia.
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
