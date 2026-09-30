'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Key,
  Lock,
  UserCheck,
  UserX,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CalendarCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  PlusCircle,
  Settings,
  Eye,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export default function UsersPermissionsHelpPage() {
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
              Manual: Papéis de Usuários & Segurança
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href="/configuracoes/usuarios/novo">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-zinc-600" />
                Novo Usuário
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/configuracoes/usuarios">
                Ver Usuários
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-brand-gradient text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Guia de Governança & Segurança Paroquial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Manual: Papéis de Usuários e Permissões de Acesso
          </h1>

          <p className="text-sm sm:text-base text-brand-100 max-w-2xl leading-relaxed">
            Entenda como funciona o modelo de permissões do painel da Paróquia São José de Caraguatatuba: as diferenças operacionais entre Administrador, Secretária e Padres/Agentes, procedimentos para criar usuários e boas práticas de proteção de dados.
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
                1. Visão Geral dos Papéis
              </a>
              <a href="#papel-admin" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                2. Perfil: Administrador Geral
              </a>
              <a href="#papel-secretaria" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                3. Perfil: Secretaria Paroquial
              </a>
              <a href="#papel-padres" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                4. Perfil: Padres & Agentes
              </a>
              <a href="#criar-usuarios" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                5. Como Cadastrar Usuários
              </a>
              <a href="#alterar-papeis" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                6. Alteração de Permissões
              </a>
              <a href="#seguranca-senhas" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                7. Senhas & Boas Práticas
              </a>
              <a href="#faq-usuarios" className="block p-1.5 rounded-lg text-zinc-600 hover:text-brand-700 hover:bg-zinc-50 font-medium transition">
                8. Perguntas Frequentes
              </a>
            </nav>

            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-center text-xs">
                <Link href="/configuracoes/usuarios/novo">
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                  Cadastrar Usuário
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full justify-center bg-brand-700 hover:bg-brand-800 text-white text-xs">
                <Link href="/configuracoes/usuarios">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  Listar Usuários
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
                Visão Geral dos Papéis de Acesso Paroquial
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O painel da Paróquia São José adota o princípio do <strong>privilégio mínimo</strong>: cada pessoa da equipe paroquial tem acesso apenas às ferramentas e dados estritamente necessários para o seu ministério ou função. Isso garante a proteção de dados confidenciais dos paroquianos e o sigilo de atendimentos pastorais.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                  Administrador
                </span>
                <p className="text-zinc-500">
                  Acesso total ao sistema, configurações avançadas, criação de contas e alteração de papéis.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-700" />
                  Secretária
                </span>
                <p className="text-zinc-500">
                  Operação diária da secretaria: comunidades, agenda, avisos, todos os agendamentos e PIX.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1 text-xs">
                <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Padres & Agentes
                </span>
                <p className="text-zinc-500">
                  Visualização restrita à própria pauta de atendimentos, horários de atendimento e pauta em PDF.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Admin Role */}
          <section id="papel-admin" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Papel: Administrador Geral (<code className="text-sm font-mono text-brand-800 font-normal">admin</code>)
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O papel de <strong>Administrador</strong> é destinado ao Pároco, vigários e aos responsáveis diretos pela coordenação técnica da paróquia. Possui permissão irrestrita em todas as áreas do painel:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Atribuições Exclusivas do Administrador:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                  <li><strong>Gestão de Contas de Usuários:</strong> Criar novas contas, ativar ou desativar acessos e excluir usuários do painel.</li>
                  <li><strong>Atribuição de Papéis:</strong> Definir se um usuário é Administrador, Secretária ou Agente Pastoral.</li>
                  <li><strong>Redefinição Emergencial de Senhas:</strong> Gerar nova senha diretamente pelo painel para colaboradores que esqueceram suas credenciais.</li>
                  <li><strong>Gerenciamento de Dispositivos:</strong> Visualizar dispositivos conectados e enviar notificações push administrativas.</li>
                  <li><strong>Acesso Completo a Todos os Módulos:</strong> Comunidades, Clérigos, Banners, Programação, Agendamentos e Secretaria.</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Recomendação de Segurança:</strong> Mantenha o número de administradores reduzido (apenas o Pároco e 1 ou 2 colaboradores de confiança máxima). Todos os demais membros da secretaria devem receber o papel de <em>Secretária</em>.
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Secretary Role */}
          <section id="papel-secretaria" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Papel: Secretaria Paroquial (<code className="text-sm font-mono text-brand-800 font-normal">secretary</code>)
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O papel de <strong>Secretária</strong> é o perfil padrão de trabalho cotidiano da paróquia. Ele dá acesso completo às ferramentas operacionais sem expor controles críticos de segurança:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>O que a Secretária pode fazer:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                  <li>Cadastrar e editar Capelas e horários de missas semanais, devocionais e anuais.</li>
                  <li>Criar avisos no site e registrar eventos na programação paroquial.</li>
                  <li>Agendar atendimentos para qualquer padre, presencialmente ou por telefone.</li>
                  <li>Aprovar ou cancelar solicitações vindas do site e emitir a pauta timbrada em PDF.</li>
                  <li>Configurar contatos paroquiais, chaves PIX e dados bancários de doações.</li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-500" />
                  <span>O que a Secretária NÃO acessa:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-zinc-600">
                  <li>Não visualiza a tela de gestão de usuários do sistema (<code className="bg-white px-1 py-0.5 rounded border">/configuracoes/usuarios</code>).</li>
                  <li>Não pode alterar papéis ou privilégios de outros colaboradores.</li>
                  <li>Não pode alterar senhas de outros usuários (apenas sua própria senha).</li>
                  <li>Não gerencia dispositivos móveis ou configurações estruturais do sistema.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Pastoral Agent Role */}
          <section id="papel-padres" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Papel: Padres & Agentes Pastorais (<code className="text-sm font-mono text-brand-800 font-normal">pastoral_agent</code>)
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              O papel de <strong>Agente Pastoral</strong> é projetado sob medida para sacerdotes, diáconos e ministros autorizados. Ele oferece uma experiência extremamente limpa, simples e focada:
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Sigilo Pastoral e Privacidade Automática</span>
                </div>
                <p>
                  Quando o sacerdote faz login no painel, ele visualiza <strong>apenas a sua própria pauta de atendimentos</strong>. Ele não vê agendamentos de outros padres nem dados administrativos desnecessários da secretaria. A barra lateral exibe apenas as opções relevantes ao seu ministério:
                </p>
                <ul className="space-y-1 list-disc pl-5 text-emerald-900">
                  <li><strong>Meus Atendimentos:</strong> Lista de atendimentos atribuídos a ele com dados de contato do fiel e justificativa.</li>
                  <li><strong>Novo Agendamento:</strong> Opção de agendar diretamente com um paroquiano presencialmente.</li>
                  <li><strong>Relatório & Pauta (PDF):</strong> Folha timbrada com checklist para impressão rápida e botão de cópia para WhatsApp.</li>
                  <li><strong>Grade de Horários & Bloqueios:</strong> Definição de seus horários semanais e bloqueio de datas para férias ou retiros espirituais.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Creating Users */}
          <section id="criar-usuarios" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Como Cadastrar um Novo Usuário no Painel
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Para adicionar um novo membro da equipe, o Administrador deve acessar <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">/configuracoes/usuarios/novo</code> ou clicar em <strong>"Novo Usuário"</strong> na tela de listagem:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">1</span>
                  <span>Nome Completo e E-mail Institucional</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Informe o nome civil do colaborador e o e-mail de acesso. O e-mail será o identificador único para login em conjunto com a senha.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">2</span>
                  <span>Seleção do Papel de Acesso</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Escolha cuidadosamente o papel: selecione <strong>Secretária</strong> para membros do atendimento paroquial, <strong>Agente Pastoral</strong> para padres e vigários, ou <strong>Administrador</strong> para coordenação geral.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">3</span>
                  <span>Definição de Senha Inicial</span>
                </div>
                <p className="text-zinc-600 pl-7">
                  Crie uma senha temporária segura com pelo menos 8 caracteres. O colaborador poderá alterá-la no primeiro acesso na tela de perfil (<code className="bg-white px-1 py-0.5 rounded border">/configuracoes/alterar-senha</code>).
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Changing Roles */}
          <section id="alterar-papeis" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Como Alterar o Papel de um Usuário Existente
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Se a função de um colaborador mudou (por exemplo, um voluntário que assumiu a secretaria ou um padre recém-chegado à paróquia), o Administrador pode atualizar o papel com facilidade:
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs">
              <ol className="space-y-2 list-decimal pl-5 text-zinc-600">
                <li>Acesse o menu <strong>Configurações → Usuários</strong> (<code className="bg-white px-1 py-0.5 rounded border">/configuracoes/usuarios</code>).</li>
                <li>Localize o usuário desejado e clique no menu de ações (ou acesse diretamente <code className="bg-white px-1 py-0.5 rounded border">/configuracoes/usuarios/[id]/papel</code>).</li>
                <li>Selecione o novo papel desejado no seletor de acesso.</li>
                <li>Clique em <strong>"Salvar Alteração"</strong>. As novas permissões passam a valer imediatamente no próximo clique do usuário.</li>
              </ol>
            </div>
          </section>

          {/* Section 7: Passwords and Security */}
          <section id="seguranca-senhas" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Segurança, Senhas e Boas Práticas Operacionais
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Redefinição de Senhas</span>
                </div>
                <p className="text-zinc-600">
                  Caso um usuário esqueça sua senha, ele pode clicar em <strong>"Esqueci minha senha"</strong> na tela de login (<code className="bg-white px-1 py-0.5 rounded border">/esqueci-minha-senha</code>). Além disso, um Administrador pode redefinir a senha do usuário em <code className="bg-white px-1 py-0.5 rounded border">/configuracoes/usuarios/[id]/redefinir-senha</code>.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Computadores Compartilhados</span>
                </div>
                <p className="text-zinc-600">
                  Em computadores do balcão da secretaria utilizados por mais de uma pessoa, sempre clique em <strong>"Sair"</strong> no menu do perfil ao encerrar o expediente para evitar que atendimentos sejam registrados sob o nome de outro colaborador.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: FAQ */}
          <section id="faq-usuarios" className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Perguntas Frequentes sobre Usuários & Permissões
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  Um padre pode ter acesso de Administrador?
                </span>
                <p className="text-zinc-600">
                  Sim. O Pároco geralmente possui o papel de Administrador para supervisionar todas as áreas da paróquia. Os demais vigários ou padres residentes podem utilizar o papel de Agente Pastoral para ter uma visão mais direta e despoluída dos seus atendimentos.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  A secretária consegue ver os atendimentos de todos os padres?
                </span>
                <p className="text-zinc-600">
                  Sim. O papel de Secretária tem permissão para visualizar e gerenciar a agenda de todos os clérigos da paróquia, permitindo registrar novos fiéis, reagendar e emitir relatórios diários de atendimento.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block text-sm">
                  O que acontece se um colaborador for desativado?
                </span>
                <p className="text-zinc-600">
                  O login é imediatamente bloqueado, mas todo o histórico de atendimentos e registros criados anteriormente por ele é preservado para fins de auditoria paroquial.
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
