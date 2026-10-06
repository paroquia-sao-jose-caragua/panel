'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  QrCode,
  Church,
  Heart,
  Flame,
  CreditCard,
  Send,
  X,
  PlusCircle,
  Tag,
  Filter,
  Layers,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

interface HelpTopic {
  id: string;
  category: 'appointments' | 'secretariat' | 'communities' | 'clergy' | 'announcements' | 'system';
  title: string;
  description: string;
  badge: string;
  role: 'Todos' | 'Secretaria' | 'Padres & Agentes' | 'Administradores';
  readTime: string;
  href?: string;
  highlights: string[];
  keywords: string[];
  isMainForPage?: boolean;
}

const TOPICS: HelpTopic[] = [
  // ==========================================
  // MAIN TOPICS (1 POR PÁGINA DA CENTRAL DE AJUDA)
  // Exibidos quando o filtro for "Todos os Tópicos"
  // ==========================================
  {
    id: 'main-agendamentos',
    isMainForPage: true,
    category: 'appointments',
    title: 'Guia Completo: Atendimentos & Atendimentos Pastorais',
    description:
      'Manual unificado da página de Atendimentos: marcação presencial e por telefone, pauta impressa em PDF com checklist para o Padre, grade de horários semanais e visitas a enfermos.',
    badge: 'Manual de Atendimentos',
    role: 'Todos',
    readTime: '5 min',
    href: '/ajuda/atendimentos',
    highlights: [
      'Registro de atendimentos presenciais e validação de horários livres',
      'Emissão da folha timbrada de pauta em PDF e checklist para o sacerdote',
      'Configuração da grade de disponibilidade semanal e bloqueios pontuais',
      'Controle de visitas domiciliares, enfermos e unção dos enfermos',
    ],
    keywords: [
      'agendamento',
      'agendamentos',
      'padre',
      'pdf',
      'pauta',
      'checklist',
      'visita',
      'horarios',
      'grade',
      'bloqueio',
      'atendimento',
      'manual',
    ],
  },
  {
    id: 'main-secretaria',
    isMainForPage: true,
    category: 'secretariat',
    title: 'Guia Completo: Dados da Secretaria & Chaves PIX',
    description:
      'Manual unificado da página da Secretaria: atualização dos contatos oficiais da Paróquia São José, horários de expediente, QR Code dinâmico do PIX sem taxas e dados bancários do dízimo.',
    badge: 'Manual da Secretaria',
    role: 'Secretaria',
    readTime: '5 min',
    href: '/ajuda/secretaria',
    highlights: [
      'Telefones fixos, link direto de WhatsApp e endereço da Matriz com mapa',
      'Horários de atendimento ao público no balcão paroquial',
      'Chave PIX paroquial oficial com QR Code e Copia e Cola dinâmico',
      'Canais de envio de comprovantes de dízimo e contas bancárias tradicionais',
    ],
    keywords: [
      'secretaria',
      'pix',
      'qrcode',
      'dizimo',
      'dízimo',
      'doacao',
      'telefone',
      'whatsapp',
      'horario',
      'banco',
      'comprovante',
      'manual',
    ],
  },
  {
    id: 'main-comunidades',
    isMainForPage: true,
    category: 'communities',
    title: 'Guia Completo: Comunidades, Capelas & Horários de Missa',
    description:
      'Manual unificado da página de Comunidades: cadastro das capelas da rede paroquial, fotos de capa e organização litúrgica em Missas Regulares, Missas Devocionais e Solenidades Anuais.',
    badge: 'Manual de Comunidades',
    role: 'Secretaria',
    readTime: '5 min',
    href: '/ajuda/comunidades',
    highlights: [
      'Cadastro de capelas, bairros, lema pastoral e fotos de capa em 16:9',
      'Missas regulares semanais e celebrações dominicais nos bairros',
      'Missas devocionais, novenas periódicas e adoração ao Santíssimo',
      'Solenidades anuais: Natal, Páscoa, Corpus Christi e festas dos padroeiros',
    ],
    keywords: [
      'comunidade',
      'comunidades',
      'capela',
      'capelas',
      'missa',
      'missas',
      'horarios de missa',
      'padroeiro',
      'solenidade',
      'novena',
      'devocional',
      'domingo',
      'manual',
    ],
  },
  {
    id: 'main-clerigos',
    isMainForPage: true,
    category: 'clergy',
    title: 'Guia Completo: Gestão de Clérigos e Padres da Paróquia',
    description:
      'Manual da página de Clérigos: cadastro do Pároco, vigários paroquiais, diáconos permanentes e autoridades que conduzem nossa comunidade e diocese na fé.',
    badge: 'Manual de Clérigos',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/clerigos',
    highlights: [
      'Destaque comemorativo do Clérigo Principal (Pároco da Matriz)',
      'Cadastro de vigários paroquiais e diáconos permanentes',
      'Upload de fotos oficiais com fallbacks eclesiásticos automáticos',
      'Lema de ordenação sacerdotal, biografia e anos de ministério',
    ],
    keywords: [
      'clerigo',
      'clerigos',
      'padre',
      'padres',
      'paroco',
      'vigario',
      'diacono',
      'bispo',
      'sacerdote',
      'quem nos conduz na fe',
      'lema',
      'manual',
    ],
  },
  {
    id: 'main-avisos',
    isMainForPage: true,
    category: 'announcements',
    title: 'Guia Completo: Banners & Avisos no Topo do Site',
    description:
      'Manual unificado da página de Banners e Avisos: gestão da barra de alerta urgente no topo do site, comunicados de reformas e cancelamentos, e carrossel de eventos com expiração automática.',
    badge: 'Manual de Banners & Avisos',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/avisos',
    highlights: [
      'Barra de alerta urgente no topo do site com variantes de cor litúrgica',
      'Cadastro de banners com upload de imagem e link de ação externo/interno',
      'Validade programada com data de início e término para expiração automática',
      'Reordenação visual e prioridade de exibição na página inicial',
    ],
    keywords: [
      'aviso',
      'avisos',
      'banner',
      'banners',
      'alerta',
      'alerta urgente',
      'urgente',
      'reforma',
      'cancelamento',
      'carrossel',
      'comunicado',
      'expiracao',
      'validade',
      'manual',
    ],
  },
  {
    id: 'main-sistema',
    isMainForPage: true,
    category: 'system',
    title: 'Papéis de Usuários e Permissões de Acesso no Painel',
    description:
      'Entenda as diferenças de acesso entre Administrador, Secretária e Padres / Agentes Pastorais no painel da Paróquia São José.',
    badge: 'Segurança & Perfis',
    role: 'Administradores',
    readTime: '4 min',
    href: '/ajuda/usuarios',
    highlights: [
      'Administrador: controle total do sistema, configurações e usuários',
      'Secretária: gestão de agendamentos, avisos, secretaria e missas',
      'Agente Pastoral / Padre: visualização restrita à própria pauta e horários',
      'Criação de novos usuários, alteração de papéis e redefinição de senhas',
    ],
    keywords: [
      'usuario',
      'usuarios',
      'permissao',
      'permissoes',
      'administrador',
      'secretaria',
      'padre',
      'agente',
      'seguranca',
      'login',
      'senha',
      'perfil',
      'acesso',
    ],
  },

  // ==========================================
  // TOPICOS DETALHADOS: AGENDAMENTOS PASTORAIS
  // Exibidos ao filtrar por "Atendimentos" ou na busca
  // ==========================================
  {
    id: 'novo-agendamento',
    isMainForPage: false,
    category: 'appointments',
    title: 'Como registrar um Novo Atendimento pelo Painel',
    description:
      'Guia para secretárias e agentes registrarem atendimentos presenciais ou por telefone com validação de horários.',
    badge: 'Atendimentos',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/atendimentos#como-agendar',
    highlights: [
      'Seleção automática do sacerdote ou escolha de agente',
      'Carga dinâmica de horários livres no calendário',
      'Dados de visitas domiciliares aos enfermos',
      'Definição de status e anotações pastorais internas',
    ],
    keywords: [
      'agendamento',
      'marcar',
      'atendimento',
      'secretaria',
      'padre',
      'calendario',
      'horario',
      'telefone',
      'presencial',
      'fiel',
      'novo',
    ],
  },
  {
    id: 'gestao-agendamentos',
    isMainForPage: false,
    category: 'appointments',
    title: 'Gestão da Fila de Atendimentos, Status e Confirmações',
    description:
      'Como acompanhar a lista de atendimentos, aprovar pedidos do site público, alterar status e remarcar fiéis.',
    badge: 'Atendimentos',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/atendimentos#como-agendar',
    highlights: [
      'Filtros por data, sacerdote e situação (Pendente, Confirmado, Concluído)',
      'Aprovação rápida de solicitações públicas feitas pelos fiéis pelo site',
      'Reagendamento de horários e contato direto via WhatsApp do paroquiano',
      'Histórico de atendimentos anteriores e anotações internas da secretaria',
    ],
    keywords: [
      'agendamento',
      'agendamentos',
      'fila',
      'status',
      'confirmar',
      'pendente',
      'solicitacao',
      'reagendar',
      'atendimento',
      'fiel',
      'lista',
    ],
  },
  {
    id: 'grade-horarios-bloqueios',
    isMainForPage: false,
    category: 'appointments',
    title: 'Grade de Horários Semanais e Bloqueios de Data',
    description:
      'Como o sacerdote ou ministro configura sua disponibilidade semanal e bloqueia datas para retiros ou férias.',
    badge: 'Disponibilidade',
    role: 'Padres & Agentes',
    readTime: '4 min',
    href: '/ajuda/atendimentos#grade-e-bloqueios',
    highlights: [
      'Ativação dos dias da semana com horário de início e término',
      'Configuração da duração do atendimento (ex: 30 ou 45 min)',
      'Bloqueio pontual com motivo (férias, viagem, retiro)',
      'Prevenção automática de conflitos na agenda',
    ],
    keywords: [
      'grade',
      'horario',
      'disponibilidade',
      'bloqueio',
      'bloquear',
      'ferias',
      'retiro',
      'viagem',
      'padre',
      'agenda',
      'conflito',
      'semanal',
    ],
  },
  {
    id: 'visitas-enfermos',
    isMainForPage: false,
    category: 'appointments',
    title: 'Atendimento Domiciliar e Unção dos Enfermos',
    description:
      'Requisitos especiais e preenchimento de endereço e condições de saúde dos enfermos para visitas pastorais.',
    badge: 'Visitas Domiciliares',
    role: 'Todos',
    readTime: '3 min',
    href: '/ajuda/atendimentos#visitas-domiciliares',
    highlights: [
      'Endereço completo com ponto de referência',
      'Condições do paciente: acamado, lúcido, deglute hóstia',
      'Instruções de acesso e cuidados da família',
    ],
    keywords: [
      'visita',
      'domiciliar',
      'enfermo',
      'doente',
      'acamado',
      'uncao',
      'saude',
      'hostia',
      'hospital',
      'remedios',
      'padre',
      'casa',
      'idoso',
    ],
  },
  {
    id: 'pausa-agendamento-online',
    isMainForPage: false,
    category: 'appointments',
    title: 'Pausar ou Ativar o Atendimento Online no Site',
    description:
      'Como suspender temporariamente novos agendamentos públicos com aviso personalizado aos fiéis.',
    badge: 'Configurações',
    role: 'Secretaria',
    readTime: '2 min',
    href: '/ajuda/atendimentos#pausar-agendamento',
    highlights: [
      'Interrupção imediata de novas solicitações pelo site',
      'Mensagem e título personalizados na página pública',
      'A secretaria e os padres continuam podendo agendar internamente',
    ],
    keywords: [
      'pausar',
      'pausa',
      'desativar',
      'ativar',
      'online',
      'site',
      'aviso',
      'recesso',
      'suspender',
      'configuracao',
      'bloqueio geral',
    ],
  },

  // ==========================================
  // TOPICOS DETALHADOS: SECRETARIA & PIX
  // Exibidos ao filtrar por "Secretaria & PIX" ou na busca
  // ==========================================
  {
    id: 'secretaria-visao-geral',
    isMainForPage: false,
    category: 'secretariat',
    title: 'Visão Geral da Secretaria e Canais de Comunicação',
    description:
      'Entenda como o módulo da secretaria sincroniza contatos, expediente e arrecadação em tempo real com o site.',
    badge: 'Secretaria & Matriz',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/secretaria#visao-geral',
    highlights: [
      'Sincronização instantânea com a Home, Contato e Doações',
      'Centralização das informações oficiais da Igreja Matriz',
      'Acesso seguro exclusivo para Secretaria e Administradores',
    ],
    keywords: [
      'secretaria',
      'visao geral',
      'institucional',
      'matriz',
      'sincronizacao',
      'painel',
      'canais',
      'balcao',
      'modulo',
    ],
  },
  {
    id: 'secretaria-contatos-loc',
    isMainForPage: false,
    category: 'secretariat',
    title: 'Telefones, WhatsApp Oficial e Endereço da Matriz',
    description:
      'Como atualizar telefone fixo, link direto do WhatsApp, e-mail institucional e endereço completo com Google Maps.',
    badge: 'Contatos & Matriz',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/secretaria#dados-contato',
    highlights: [
      'Telefone fixo e link direto wa.me para início de conversa no WhatsApp',
      'E-mail oficial para acolhida e intenções de missa',
      'Endereço da Matriz para localização no Google Maps e fiéis',
    ],
    keywords: [
      'telefone',
      'whatsapp',
      'zap',
      'celular',
      'email',
      'e-mail',
      'endereco',
      'rua',
      'matriz',
      'bairro',
      'cep',
      'mapa',
      'contato',
      'localizacao',
    ],
  },
  {
    id: 'secretaria-horarios',
    isMainForPage: false,
    category: 'secretariat',
    title: 'Configuração dos Horários de Atendimento ao Público',
    description:
      'Formatação recomendada dos dias e horários de funcionamento presencial e telefônico na secretaria paroquial.',
    badge: 'Expediente',
    role: 'Secretaria',
    readTime: '2 min',
    href: '/ajuda/secretaria#horario-atendimento',
    highlights: [
      'Definição de expediente: manhã, intervalo de almoço e tarde',
      'Atendimento aos sábados, domingos e feriados',
      'Avisos de recessos e horários especiais de fim de ano',
    ],
    keywords: [
      'horario',
      'expediente',
      'atendimento',
      'funcionamento',
      'balcao',
      'almoco',
      'sabado',
      'domingo',
      'secretaria',
      'recesso',
      'plantao',
    ],
  },
  {
    id: 'secretaria-pix-qrcode',
    isMainForPage: false,
    category: 'secretariat',
    title: 'Configuração da Chave PIX e Gerador de QR Code',
    description:
      'Como cadastrar a chave paroquial (CNPJ, Telefone, E-mail ou EVP) com geração automática de QR Code e Copia e Cola.',
    badge: 'PIX & Arrecadação',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/secretaria#configuracao-pix',
    highlights: [
      'Suporte aos 4 tipos de chaves oficiais do Banco Central',
      'Geração automática do padrão EMV Copia e Cola e QR Code',
      'Zero taxas e repasse 100% direto na conta da paróquia',
      'Botão de teste e cópia de chave no painel',
    ],
    keywords: [
      'pix',
      'chave pix',
      'qrcode',
      'qr code',
      'copia e cola',
      'chave aleatoria',
      'cnpj',
      'banco central',
      'doacao',
      'dizimo',
      'oferta',
      'arrecadacao',
      'pagamento',
    ],
  },
  {
    id: 'secretaria-dados-bancarios',
    isMainForPage: false,
    category: 'secretariat',
    title: 'Dados Bancários Tradicionais (TED, DOC e Depósitos)',
    description:
      'Cadastro de Agência, Conta Corrente e CNPJ da paróquia para doações de fiéis idosos ou empresas parceiras.',
    badge: 'Contas Bancárias',
    role: 'Secretaria',
    readTime: '2 min',
    href: '/ajuda/secretaria#dados-bancarios',
    highlights: [
      'Identificação do Banco, Agência e Conta Corrente com dígito',
      'Razão Social e CNPJ oficial da Diocese / Paróquia',
      'Exibição transparente na página Quero Contribuir',
    ],
    keywords: [
      'ted',
      'doc',
      'deposito',
      'transferencia',
      'banco',
      'agencia',
      'conta corrente',
      'cnpj',
      'razao social',
      'empresa',
      'benfeitor',
      'bancario',
    ],
  },
  {
    id: 'secretaria-comprovantes-campanhas',
    isMainForPage: false,
    category: 'secretariat',
    title: 'Comprovantes do Dízimo e Campanhas Pastorais',
    description:
      'Configuração do WhatsApp de baixa do dízimo, e-mail para envio de comprovantes e campanhas de obras.',
    badge: 'Dízimo & Campanhas',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/secretaria#comprovantes-campanhas',
    highlights: [
      'WhatsApp exclusivo para paroquianos enviarem comprovantes',
      'Mensagem bíblica e pastoral de acolhida do dízimo',
      'Divulgação da Campanha do Centro Pastoral ou reformas',
    ],
    keywords: [
      'comprovante',
      'dizimo',
      'dízimo',
      'dizimista',
      'campanha',
      'reforma',
      'centro pastoral',
      'acolhida',
      'whatsapp dizimo',
      'baixa',
    ],
  },

  // ==========================================
  // TOPICOS DETALHADOS: COMUNIDADES & MISSAS
  // Exibidos ao filtrar por "Comunidades & Missas" ou na busca
  // ==========================================
  {
    id: 'comunidades-visao-geral',
    isMainForPage: false,
    category: 'communities',
    title: 'Visão Geral da Rede de Comunidades, Capelas & Matriz',
    description:
      'Como o painel gerencia a estrutura eclesiástica das capelas e alimenta a lista de próximas missas no site.',
    badge: 'Rede Paroquial',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/comunidades#visao-geral',
    highlights: [
      'Matriz e Capelas nos bairros com identidade própria',
      'Cálculo inteligente da próxima missa em tempo real no site',
      'Catálogo público com fotos, endereços e mapas',
    ],
    keywords: [
      'comunidade',
      'comunidades',
      'capela',
      'capelas',
      'matriz',
      'rede paroquial',
      'bairros',
      'igreja',
      'missas',
      'proximas',
    ],
  },
  {
    id: 'comunidades-cadastro-capela',
    isMainForPage: false,
    category: 'communities',
    title: 'Como Cadastrar e Editar uma Nova Comunidade ou Capela',
    description:
      'Passo a passo para cadastrar o nome da capela, slug amigável, bairro, endereço, foto de capa e lema pastoral.',
    badge: 'Cadastro de Capelas',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/comunidades#cadastro-comunidade',
    highlights: [
      'Geração automática de slug para a URL amigável do site',
      'Endereço completo com mapa e telefone dos coordenadores',
      'Upload de foto de capa (16:9) da fachada ou altar',
    ],
    keywords: [
      'cadastrar capela',
      'adicionar comunidade',
      'slug',
      'foto',
      'fachada',
      'altar',
      'bairro',
      'coordenador',
      'lema',
      'editar comunidade',
      'nova',
    ],
  },
  {
    id: 'comunidades-missas-regulares',
    isMainForPage: false,
    category: 'communities',
    title: 'Missas Regulares: Celebrações Dominicais e Semanais',
    description:
      'Cadastro dos horários semanais fixos que se repetem com indicação de dia, hora, celebrante e observações litúrgicas.',
    badge: 'Missas Regulares',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/comunidades#missas-regulares',
    highlights: [
      'Dia da semana (Domingo a Sábado) e horário exato',
      'Identificação do celebrante habitual ou clero paroquial',
      'Observações: Missa com Catequese, Transmissão ao Vivo, etc.',
      'Exibição imediata na busca "Próximas Missas" da Home',
    ],
    keywords: [
      'missa regular',
      'missa semanal',
      'missa domingo',
      'domingo',
      'sabado',
      'horario de missa',
      'celebrante',
      'catequese',
      'transmissao',
      'proximas missas',
      'eucaristia',
    ],
  },
  {
    id: 'comunidades-missas-devocionais',
    isMainForPage: false,
    category: 'communities',
    title: 'Missas Devocionais, Novenas e Bênçãos Especiais',
    description:
      'Celebrações de ciclos piedosos: 1ª Sexta-feira do Mês (Sagrado Coração), dia 19 de São José e Adoração ao Santíssimo.',
    badge: 'Missas Devocionais',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/comunidades#missas-devocionais',
    highlights: [
      'Regra de periodicidade mensal, quinzenal ou semanal',
      '1ª Sexta-feira do Mês, dia 19 de São José e Adoração',
      'Novenas perpétuas e horários de confissões prévias',
    ],
    keywords: [
      'devocional',
      'missa devocional',
      'novena',
      'sagrado coracao',
      'sao jose',
      'dia 19',
      'santissimo',
      'adoracao',
      'bencao',
      'primeira sexta-feira',
      'confissao',
      'terco',
    ],
  },
  {
    id: 'comunidades-missas-anuais',
    isMainForPage: false,
    category: 'communities',
    title: 'Missas Anuais, Festas de Padroeiros & Solenidades',
    description:
      'Celebrações solenes com data específica: Natal, Páscoa, Corpus Christi e festas dos padroeiros das capelas.',
    badge: 'Solenidades & Festas',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/comunidades#missas-anuais',
    highlights: [
      'Festas dos padroeiros locais (ex: Santo Antônio, São Francisco)',
      'Solenidade de São José (19 de Março) e Procissões',
      'Natal, Ano Novo, Semana Santa e Corpus Christi',
      'Planejamento antecipado no calendário anual',
    ],
    keywords: [
      'missa anual',
      'solenidade',
      'festa de padroeiro',
      'natal',
      'ano novo',
      'corpus christi',
      'semana santa',
      'pascoa',
      'procissao',
      'solene',
      'padroeiro',
      'calendario anual',
    ],
  },
  {
    id: 'comunidades-padroeiro-galeria',
    isMainForPage: false,
    category: 'communities',
    title: 'Santo Padroeiro, História da Capela e Galeria de Fotos',
    description:
      'Como enriquecer a página da capela com biografia do santo, data da memória litúrgica, história e fotos dos eventos.',
    badge: 'Padroeiro & História',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/comunidades#padroeiro-galeria',
    highlights: [
      'História e data litúrgica do padroeiro para catequese',
      'Ano de fundação da capela, fundadores e pastorais ativas',
      'Galeria de fotos de quermesses, batizados e festas',
    ],
    keywords: [
      'padroeiro',
      'historia',
      'biografia',
      'santo',
      'galeria',
      'fotos',
      'fundadores',
      'sobre',
      'memoria liturgica',
      'imagem',
    ],
  },

  // ==========================================
  // TOPICOS DETALHADOS: USUÁRIOS & SEGURANÇA
  // Exibidos ao filtrar por "Usuários & Segurança" ou na busca
  // ==========================================
  {
    id: 'usuarios-papeis-acesso',
    isMainForPage: false,
    category: 'system',
    title: 'Diferenças de Acesso: Admin, Secretaria e Agentes Pastorais',
    description:
      'Entenda em detalhes os privilégios operacionais de cada papel e o sigilo pastoral dos sacerdotes.',
    badge: 'Papéis de Acesso',
    role: 'Administradores',
    readTime: '3 min',
    href: '/ajuda/usuarios#visao-geral',
    highlights: [
      'Administrador: acesso irrestrito e controle institucional total',
      'Secretária: operação completa de agendamentos, secretaria, missas e avisos',
      'Agente Pastoral: sigilo pastoral estrito na visualização da própria pauta',
    ],
    keywords: [
      'usuario',
      'permissao',
      'papeis',
      'admin',
      'secretaria',
      'padre',
      'pastoral',
      'seguranca',
      'acesso',
    ],
  },
  {
    id: 'usuarios-novo-cadastro',
    isMainForPage: false,
    category: 'system',
    title: 'Como Cadastrar Novos Usuários e Definir Senha Inicial',
    description:
      'Passo a passo para o Administrador convidar colaboradores e clérigos definindo e-mail e credenciais.',
    badge: 'Novo Usuário',
    role: 'Administradores',
    readTime: '3 min',
    href: '/ajuda/usuarios#criar-usuarios',
    highlights: [
      'Acesso seguro à tela de criação em /configuracoes/usuarios/novo',
      'Preenchimento de nome civil e e-mail institucional',
      'Definição do papel de acesso e senha temporária segura',
    ],
    keywords: [
      'cadastrar',
      'novo usuario',
      'criar conta',
      'convite',
      'email',
      'senha inicial',
      'admin',
    ],
  },
  {
    id: 'usuarios-alterar-papeis',
    isMainForPage: false,
    category: 'system',
    title: 'Como Alterar Papéis e Permissões de Usuários Existentes',
    description:
      'Procedimento para promover colaboradores, ajustar permissões e atribuir novas responsabilidades paroquiais.',
    badge: 'Permissões',
    role: 'Administradores',
    readTime: '2 min',
    href: '/ajuda/usuarios#alterar-papeis',
    highlights: [
      'Atualização instantânea de permissões pelo Administrador',
      'Acesso rápido em /configuracoes/usuarios/[id]/papel',
      'Efeito imediato no próximo clique ou navegação do usuário',
    ],
    keywords: [
      'alterar papel',
      'mudar permissao',
      'promover',
      'secretaria para admin',
      'permissoes',
      'ajustar papel',
    ],
  },
  {
    id: 'usuarios-senhas-seguranca',
    isMainForPage: false,
    category: 'system',
    title: 'Redefinição de Senhas e Segurança em Computadores Compartilhados',
    description:
      'Recuperação de acesso, redefinição emergencial por administradores e boas práticas de logout na secretaria.',
    badge: 'Segurança & Senhas',
    role: 'Todos',
    readTime: '3 min',
    href: '/ajuda/usuarios#seguranca-senhas',
    highlights: [
      'Recuperação de senha na tela de login (/esqueci-minha-senha)',
      'Redefinição direta por um Administrador em casos de esquecimento',
      'Boas práticas de encerramento de sessão em PCs da secretaria',
    ],
    keywords: [
      'senha',
      'redefinir senha',
      'esqueci senha',
      'seguranca',
      'computador compartilhado',
      'logout',
      'sair',
    ],
  },
  // ==========================================
  // TOPICOS DETALHADOS: CLÉRIGOS & PADRES
  // Exibidos ao filtrar por "Clérigos & Padres" ou na busca
  // ==========================================
  {
    id: 'clerigos-visao-geral',
    isMainForPage: false,
    category: 'clergy',
    title: 'Visão Geral do Módulo: Quem nos conduz na fé',
    description:
      'Apresentação pública dos sacerdotes e autoridades religiosas que pastoreiam a paróquia e a diocese.',
    badge: 'Corpo Pastoral',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/clerigos#visao-geral',
    highlights: [
      'Alimenta a seção "Quem nos conduz na fé" no site público',
      'Apresentação institucional transparente para os paroquianos e turistas',
      'Card de destaque especial para o Pároco da Matriz',
    ],
    keywords: [
      'clerigos',
      'visao geral',
      'padres',
      'quem nos conduz na fe',
      'pastor',
      'paroco',
      'site publico',
    ],
  },
  {
    id: 'clerigos-cargos-hierarquia',
    isMainForPage: false,
    category: 'clergy',
    title: 'Hierarquia e Cargos Canônicos Suportados',
    description:
      'Categorização canônica entre Pároco, Vigários Paroquiais, Diáconos Permanentes e Bispo Diocesano.',
    badge: 'Cargos Canônicos',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/clerigos#cargos-eclesiasticos',
    highlights: [
      'Pároco (Parish Priest), Vigário Paroquial e Diácono Permanente',
      'Homenagem ao Bispo Diocesano e autoridades eclesiásticas',
      'Título público personalizável (ex: "Pároco & Reitor")',
    ],
    keywords: [
      'cargos',
      'hierarquia',
      'paroco',
      'vigario',
      'diacono',
      'bispo',
      'titulo',
    ],
  },
  {
    id: 'clerigos-cadastrar-novo',
    isMainForPage: false,
    category: 'clergy',
    title: 'Como Cadastrar um Novo Sacerdote ou Diácono',
    description:
      'Passo a passo para cadastrar nome completo, título usual, ordem de exibição e posição ministerial.',
    badge: 'Novo Clérigo',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/clerigos#cadastrar-clerigo',
    highlights: [
      'Acesso em /clerigos/adicionar pelo botão "+ Novo Clérigo"',
      'Nome com prefixo religioso (Pe., Diác., Dom)',
      'Definição da ordem numérica para posicionamento dos cards',
    ],
    keywords: [
      'cadastrar clerigo',
      'adicionar padre',
      'novo padre',
      'ordem de exibicao',
      'formulario',
    ],
  },
  {
    id: 'clerigos-destaque-principal',
    isMainForPage: false,
    category: 'clergy',
    title: 'O Clérigo Principal: Destaque Solene do Pároco',
    description:
      'Como funciona a marcação do Clérigo Principal com moldura litúrgica, foto ampliada e biografia no topo.',
    badge: 'Pároco em Destaque',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/clerigos#clerigo-principal',
    highlights: [
      'Opção "Clérigo Principal" que posiciona o sacerdote em card hero',
      'Badge dourada de honra e moldura litúrgica comemorativa',
      'Eleição automática do sacerdote com cargo de Pároco caso não marcado',
    ],
    keywords: [
      'clerigo principal',
      'paroco',
      'destaque',
      'card principal',
      'moldura',
      'hero',
    ],
  },
  {
    id: 'clerigos-foto-biografia-lema',
    isMainForPage: false,
    category: 'clergy',
    title: 'Foto Oficial, Biografia e Lema Sacerdotal Vocacional',
    description:
      'Orientações para foto de alta qualidade, ilustrações eclesiásticas de fallback e registro do lema bíblico.',
    badge: 'Foto & Biografia',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/clerigos#foto-biografia',
    highlights: [
      'Upload de foto em traje clerical com fallbacks automáticos',
      'Lema de ordenação (frase bíblica vocacional do sacerdote)',
      'Data de ordenação presbiteral para datas comemorativas e jubileus',
    ],
    keywords: [
      'foto',
      'biografia',
      'lema',
      'ordenacao',
      'jubileu',
      'imagem',
      'fallback',
    ],
  },

  // ==========================================
  // TOPICOS DETALHADOS: BANNERS & AVISOS
  // Exibidos ao filtrar por "Banners & Avisos" ou na busca
  // ==========================================
  {
    id: 'avisos-visao-geral',
    isMainForPage: false,
    category: 'announcements',
    title: 'Visão Geral da Comunicação: Alertas no Topo vs Banners na Capa',
    description:
      'Entenda quando utilizar a barra de alerta fixada no topo e quando divulgar eventos no carrossel de banners.',
    badge: 'Comunicação',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/avisos#visao-geral',
    highlights: [
      'Diferença entre alerta urgente fixo e carrossel de banners promocionais',
      'Regras pastorais de comunicação rápida para os fiéis e paroquianos',
      'Sincronização imediata entre painel e site público',
    ],
    keywords: [
      'avisos',
      'banners',
      'visao geral',
      'comunicacao',
      'alerta urgente',
      'carrossel',
      'capa',
    ],
  },
  {
    id: 'avisos-alerta-urgente',
    isMainForPage: false,
    category: 'announcements',
    title: 'Como Configurar a Barra de Alerta Urgente no Topo do Site',
    description:
      'Passo a passo para ativar comunicados urgentes, texto direto e link de ação destacados em todas as páginas.',
    badge: 'Alerta Urgente',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/avisos#alerta-urgente',
    highlights: [
      'Ativação/Desativação da barra no topo com um clique',
      'Mensagem concisa e objetiva visível em celulares e computadores',
      'Botão de ação opcional (ex: "Ver orientações", "Local da missa")',
    ],
    keywords: [
      'alerta',
      'urgente',
      'barra topo',
      'alerta urgente',
      'comunicado',
      'aviso topo',
      'link acao',
    ],
  },
  {
    id: 'avisos-variantes-liturgicas',
    isMainForPage: false,
    category: 'announcements',
    title: 'Variantes Litúrgicas e Cores do Alerta (Alerta, Informativo, Solenidade)',
    description:
      'Cores adequadas para cada mensagem: âmbar/vermelho para urgência, azul para avisos gerais e dourado para festas.',
    badge: 'Cores Litúrgicas',
    role: 'Secretaria',
    readTime: '2 min',
    href: '/ajuda/avisos#variantes-alerta',
    highlights: [
      'Variante Alerta (Âmbar/Vermelho): reformas, chuvas e cancelamentos',
      'Variante Informativo (Azul Marinho): horários da secretaria e inscrições',
      'Variante Solenidade (Dourado Nobre): Páscoa, Natal e festa do Padroeiro',
    ],
    keywords: [
      'variantes',
      'cores',
      'alerta',
      'informativo',
      'solenidade',
      'dourado',
      'liturgico',
      'estilo',
    ],
  },
  {
    id: 'avisos-cadastrar-banner',
    isMainForPage: false,
    category: 'announcements',
    title: 'Como Cadastrar um Novo Banner com Imagem e Link',
    description:
      'Tutorial completo para criar banners no carrossel da capa com título, descrição, link interno ou externo e foto.',
    badge: 'Novo Banner',
    role: 'Secretaria',
    readTime: '4 min',
    href: '/ajuda/avisos#cadastrar-banner',
    highlights: [
      'Acesso em /avisos/banners e botão "+ Novo Banner"',
      'Upload de artes em proporção 16:9 (JPG, PNG ou WebP até 2MB)',
      'Configuração de link para páginas internas do site ou redes sociais',
    ],
    keywords: [
      'cadastrar banner',
      'novo banner',
      'imagem banner',
      'carrossel',
      'upload',
      'link banner',
      'arte',
    ],
  },
  {
    id: 'avisos-reordenar-prioridade',
    isMainForPage: false,
    category: 'announcements',
    title: 'Ordem de Exibição e Prioridade dos Banners no Carrossel',
    description:
      'Como ordenar os slides do carrossel para que as pastorais e eventos mais urgentes apareçam em primeiro lugar.',
    badge: 'Ordem & Destaque',
    role: 'Secretaria',
    readTime: '2 min',
    href: '/ajuda/avisos#reordenar-banners',
    highlights: [
      'Definição numérica de ordem de exibição',
      'O slide de menor número ou mais recente abre o carrossel na capa',
      'Recomendação pastoral de manter entre 3 e 5 banners ativos simultaneamente',
    ],
    keywords: [
      'ordem',
      'reordenar',
      'prioridade',
      'carrossel',
      'primeiro banner',
      'slide',
    ],
  },
  {
    id: 'avisos-validade-expiracao',
    isMainForPage: false,
    category: 'announcements',
    title: 'Validade Programada e Expiração Automática de Campanhas',
    description:
      'Atendimento de campanhas com data de início e término para que o banner saia do ar sozinho ao terminar o evento.',
    badge: 'Expiração Automática',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/avisos#validade-expiracao',
    highlights: [
      'Definição de Data Inicial e Data Final de exibição',
      'Ocultação 100% automática após as 23h59 da data de término',
      'Preservação do histórico e artes no painel para reativações futuras',
    ],
    keywords: [
      'validade',
      'expiracao',
      'data final',
      'programar',
      'agendar banner',
      'desativar automatico',
    ],
  },
  {
    id: 'avisos-casos-pastorais',
    isMainForPage: false,
    category: 'announcements',
    title: 'Casos Pastorais: Reformas, Chuvas Fortes, Quaresma e Festas',
    description:
      'Exemplos práticos de textos e combinações visuais prontas para copiar e usar em situações paroquiais rotineiras.',
    badge: 'Casos Pastorais',
    role: 'Secretaria',
    readTime: '3 min',
    href: '/ajuda/avisos#casos-pastorais',
    highlights: [
      'Reformas em capelas e transferência temporária de missas',
      'Temporais, alagamentos e cancelamento emergencial de celebrações',
      'Festas de Padroeiros, Novenas, Quaresma, Natal e Semana Santa',
    ],
    keywords: [
      'casos pastorais',
      'reforma',
      'temporal',
      'chuva',
      'quaresma',
      'natal',
      'festa do padroeiro',
      'cancelamento',
      'exemplo',
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todos os Tópicos' },
  { id: 'appointments', label: 'Atendimentos Pastorais' },
  { id: 'secretariat', label: 'Secretaria & PIX' },
  { id: 'communities', label: 'Comunidades & Missas' },
  { id: 'clergy', label: 'Clérigos & Padres' },
  { id: 'announcements', label: 'Banners & Avisos' },
  { id: 'system', label: 'Usuários & Segurança' },
] as const;

const QUICK_TAGS = [
  'Atendimentos',
  'Banners & Avisos',
  'Clérigos & Padres',
  'Horários de Missa',
  'Comunidades & Capelas',
  'Dízimo & Doações',
  'Visitas Domiciliares',
  'WhatsApp',
];

const FAQS = [
  {
    category: 'appointments',
    question: 'A secretária pode criar agendamentos mesmo com o agendamento online pausado?',
    answer:
      'Sim! Quando o agendamento online é desativado nas configurações, apenas o site público impede que os fiéis solicitem novos horários pela internet. A equipe da secretaria e os sacerdotes continuam com permissão total para registrar agendamentos recebidos por telefone ou presencialmente.',
  },
  {
    category: 'appointments',
    question: 'Como o Padre acessa seus atendimentos no painel?',
    answer:
      'Ao fazer login com seu e-mail e senha de "Agente Pastoral", o sacerdote é direcionado diretamente para o seu hub de atendimentos. Ele só visualiza os agendamentos atribuídos ao seu nome, podendo consultar dados do fiel, confirmar ou remarcar, além de definir sua grade semanal de horários e bloqueios pontuais de férias.',
  },
  {
    category: 'appointments',
    question: 'Se o Padre não quiser usar o computador ou celular, como a secretaria procede?',
    answer:
      'A secretaria pode acessar a tela de "Relatório & Pauta (PDF)", escolher o período (ex: "Hoje" ou "Esta Semana"), selecionar o Padre e clicar em "Imprimir / Salvar em PDF". A folha já sai timbrada com o checklist de comparecimento para o padre assinalar a caneta e linhas para anotações. Além disso, a secretária pode clicar em "Copiar p/ WhatsApp" para enviar a lista do dia diretamente no chat do sacerdote.',
  },
  {
    category: 'appointments',
    question: 'O fiel pode cancelar um agendamento sozinho?',
    answer:
      'Sim. Quando o fiel faz um agendamento pelo site, ele recebe um link com token de acesso exclusivo (ex: /atendimentos/track/CODIGO). Por essa página, ele pode verificar o status do pedido e cancelar o atendimento com justificativa, liberando automaticamente a vaga na agenda do padre.',
  },
  {
    category: 'appointments',
    question: 'O que acontece quando o sacerdote bloqueia uma data?',
    answer:
      'O sistema bloqueia imediatamente todos os horários daquele sacerdote no dia ou período especificado, tanto no site público quanto no painel da secretaria. Caso já houvesse agendamentos anteriores para aquela data, eles são sinalizados para que a secretaria entre em contato com os fiéis e faça o reagendamento.',
  },
  {
    category: 'secretariat',
    question: 'A chave PIX cadastrada no painel cobra alguma taxa da paróquia?',
    answer:
      'Não. O sistema apenas gera a carga estática e o código oficial do Banco Central (padrão EMV) diretamente para a conta da paróquia. As contribuições caem integralmente na conta paroquial, sem intermediação, sem retenção e sem comissões de terceiros.',
  },
  {
    category: 'secretariat',
    question: 'Ao alterar os contatos ou horários da secretaria, preciso mudar algo no site?',
    answer:
      'Não é necessário alterar código nem solicitar intervenção técnica. O site público consome a API do painel em tempo real: assim que a secretária salva o novo WhatsApp, telefone ou horário de funcionamento, os botões, links diretos e rodapé do site atualizam instantaneamente.',
  },
  {
    category: 'communities',
    question: 'Uma comunidade pode ter mais de um horário de missa no mesmo dia?',
    answer:
      'Sim! Por exemplo, a Igreja Matriz pode ter celebrações no Domingo às 08:00, 10:00 e 19:30. Basta cadastrar cada horário separadamente no bloco de Missas Regulares. O site organiza e calcula a mais próxima automaticamente para o fiel.',
  },
  {
    category: 'communities',
    question: 'Como cadastrar novenas periódicas e solenidades como Natal e Padroeiros?',
    answer:
      'Utilize os blocos correspondentes: para novenas e celebrações mensais (ex: 1ª Sexta-feira ou dia 19 de São José), utilize o bloco de Missas Devocionais. Para celebrações com data definida (Natal, Ano Novo, Corpus Christi e festa da padroeira), utilize o bloco de Missas Anuais.',
  },
  {
    category: 'clergy',
    question: 'Qual a diferença entre cadastrar um Clérigo e criar um Usuário do Painel?',
    answer:
      'O cadastro de Clérigo alimenta a apresentação pública do sacerdote no site ("Quem nos conduz na fé"). Já o Usuário do Painel (com papel de Agente Pastoral) serve para o padre fazer login no sistema para consultar sua pauta de agendamentos e configurar horários.',
  },
  {
    category: 'clergy',
    question: 'Como funciona o destaque do Clérigo Principal no site?',
    answer:
      'Ao marcar a opção "Clérigo Principal", o sacerdote (normalmente o Pároco da Matriz) é exibido com moldura solene, foto maior e biografia em primeiro plano no topo da página do clero no site.',
  },
  {
    category: 'announcements',
    question: 'O que acontece quando a data de validade de um aviso ou banner expira?',
    answer:
      'O sistema oculta o banner do site público automaticamente após a data final programada, sem que a secretaria precise excluir manualmente. O item permanece salvo no painel caso a equipe queira reativá-lo para a mesma festa no ano seguinte.',
  },
  {
    category: 'announcements',
    question: 'Como funciona a barra de alerta urgente no topo do site?',
    answer:
      'Ela aparece fixada no topo de todas as páginas públicas do site. Possui 3 estilos visuais (Alerta urgente em âmbar/vermelho, Informativo em azul marinho e Solenidade em dourado). É ideal para comunicados imediatos de chuva forte, capelas em reforma ou feriados.',
  },
  {
    category: 'announcements',
    question: 'Qual a dimensão recomendada para imagens de banners?',
    answer:
      'Recomenda-se imagens na proporção horizontal 16:9 ou banner de capa (ex: 1920x600px ou 1200x500px), com artes nítidas, textos contrastantes e tamanho de arquivo até 2MB em JPG, PNG ou WebP.',
  },
];

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Normalize search tokens for smart multi-word search
  const searchTokens = useMemo(() => {
    const clean = normalizeText(searchTerm.replace(/^#/, ''));
    return clean.split(/\s+/).filter(Boolean);
  }, [searchTerm]);

  const hasSearch = searchTokens.length > 0;

  // Filtered topics based on search query and category
  // When in "todos os tópicos" without search: EXACTLY 1 TOPIC PER HELP CENTER PAGE!
  const filteredTopics = useMemo(() => {
    const isAll = selectedCategory === 'all';

    return TOPICS.filter((topic) => {
      // Rule 1: In "todos os tópicos" and no search query: ONLY SHOW MAIN TOPIC (1 per page)
      if (isAll && !hasSearch) {
        return Boolean(topic.isMainForPage);
      }

      // Rule 2: If a specific category is selected and no search, show all granular topics of that category
      if (!isAll && !hasSearch) {
        return topic.category === selectedCategory && !topic.isMainForPage;
      }

      // Rule 3: If search query is active, search across topics matching category (or all if isAll)
      if (!isAll && topic.category !== selectedCategory) {
        return false;
      }

      return searchTokens.every((token) => {
        const inTitle = normalizeText(topic.title).includes(token);
        const inDesc = normalizeText(topic.description).includes(token);
        const inBadge = normalizeText(topic.badge).includes(token);
        const inRole = normalizeText(topic.role).includes(token);
        const inHighlights = topic.highlights.some((h) =>
          normalizeText(h).includes(token)
        );
        const inKeywords = topic.keywords.some((k) =>
          normalizeText(k).includes(token)
        );

        return inTitle || inDesc || inBadge || inRole || inHighlights || inKeywords;
      });
    });
  }, [selectedCategory, hasSearch, searchTokens]);

  // Category item counts
  const categoryCounts = useMemo(() => {
    if (!hasSearch) {
      return {
        all: 6, // 1 per page of the help center! (Atendimentos, Secretaria, Comunidades, Clérigos, Avisos, Usuários)
        appointments: TOPICS.filter((t) => t.category === 'appointments' && !t.isMainForPage).length,
        secretariat: TOPICS.filter((t) => t.category === 'secretariat' && !t.isMainForPage).length,
        communities: TOPICS.filter((t) => t.category === 'communities' && !t.isMainForPage).length,
        clergy: TOPICS.filter((t) => t.category === 'clergy' && !t.isMainForPage).length,
        announcements: TOPICS.filter((t) => t.category === 'announcements' && !t.isMainForPage).length,
        system: TOPICS.filter((t) => t.category === 'system' && !t.isMainForPage).length,
      };
    }

    const counts: Record<string, number> = {
      all: 0,
      appointments: 0,
      secretariat: 0,
      communities: 0,
      clergy: 0,
      announcements: 0,
      system: 0,
    };

    TOPICS.forEach((topic) => {
      const matchesSearch = searchTokens.every((token) => {
        const inTitle = normalizeText(topic.title).includes(token);
        const inDesc = normalizeText(topic.description).includes(token);
        const inBadge = normalizeText(topic.badge).includes(token);
        const inRole = normalizeText(topic.role).includes(token);
        const inHighlights = topic.highlights.some((h) =>
          normalizeText(h).includes(token)
        );
        const inKeywords = topic.keywords.some((k) =>
          normalizeText(k).includes(token)
        );

        return inTitle || inDesc || inBadge || inRole || inHighlights || inKeywords;
      });

      if (matchesSearch) {
        counts.all++;
        if (counts[topic.category] !== undefined) {
          counts[topic.category]++;
        }
      }
    });

    return counts;
  }, [hasSearch, searchTokens]);

  // Filtered FAQs based on search query and category
  const filteredFaqs = useMemo(() => {
    if (!hasSearch && selectedCategory === 'all') {
      return FAQS;
    }

    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!hasSearch) return true;

      return searchTokens.every((token) => {
        const inQuestion = normalizeText(faq.question).includes(token);
        const inAnswer = normalizeText(faq.answer).includes(token);
        return inQuestion || inAnswer;
      });
    });
  }, [selectedCategory, hasSearch, searchTokens]);

  const handleTagClick = (tag: string) => {
    if (searchTerm === tag) {
      setSearchTerm('');
    } else {
      setSearchTerm(tag);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col scroll-smooth">
      {/* Top Navbar */}
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
              <span>Central de Ajuda</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/">
                <span>Acessar Painel</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Search Engine & Tags */}
      <section className="relative bg-brand-gradient text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d6a64a_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-200 text-xs font-medium border border-white/15 backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>Documentação Oficial e Guias Operacionais</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-white">
            Como podemos ajudar você hoje?
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
            Consulte instruções passo a passo, tutoriais de agendamento, gestão de chaves PIX, cadastro de capelas e horários litúrgicos da Paróquia São José de Caraguatatuba.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Busque por 'pix', 'dízimo', 'missas', 'comunidade', 'pauta pdf', 'visitas'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-13 pl-12 pr-16 bg-white text-zinc-900 placeholder:text-zinc-400 rounded-2xl shadow-xl text-sm border-0 focus:outline-none focus:ring-3 focus:ring-brand-400/80 transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-900 font-medium px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-brand-200">
              <span className="font-semibold text-white/90 flex items-center gap-1">
                <Tag className="w-3 h-3 text-brand-300" />
                Buscas rápidas:
              </span>
              {QUICK_TAGS.map((tag) => {
                const isActive = searchTerm === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs transition cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 font-bold shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-brand-100 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>#{tag}</span>
                    {isActive && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-10">
        {/* Category Filters and Topics Section */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-serif">
                  Tópicos e Artigos de Ajuda
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200 font-bold">
                  {filteredTopics.length} {filteredTopics.length === 1 ? 'tópico' : 'tópicos'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                {hasSearch ? (
                  <span>Resultados da busca por <strong>"{searchTerm}"</strong>:</span>
                ) : selectedCategory === 'all' ? (
                  <span>
                    Exibindo <strong>1 guia principal por página da central de ajuda</strong> para navegação rápida e objetiva. Clique em uma categoria para ver os artigos detalhados.
                  </span>
                ) : (
                  <span>
                    Exibindo artigos detalhados do módulo <strong>{CATEGORIES.find((c) => c.id === selectedCategory)?.label}</strong>.
                  </span>
                )}
              </p>
            </div>

            {/* Filter buttons with counters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] ?? 0;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-700 text-white shadow-2xs font-semibold'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active search / category filter feedback banner */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="p-3 bg-brand-50/70 border border-brand-200/80 rounded-xl flex items-center justify-between text-xs text-brand-900">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-700" />
                <span>
                  Filtros ativos:{' '}
                  {searchTerm && (
                    <strong className="bg-white px-2 py-0.5 rounded border border-brand-200 mr-1.5">
                      Busca: "{searchTerm}"
                    </strong>
                  )}
                  {selectedCategory !== 'all' && (
                    <strong className="bg-white px-2 py-0.5 rounded border border-brand-200">
                      Módulo: {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                    </strong>
                  )}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs text-brand-800 hover:text-brand-950 hover:bg-brand-100/80 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Voltar a Todos os Tópicos
              </Button>
            </div>
          )}

          {/* Topics Grid */}
          {filteredTopics.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-zinc-200 space-y-3">
              <Search className="w-8 h-8 text-zinc-300 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-700">
                Nenhum tópico encontrado para "{searchTerm}"
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Tente pesquisar por termos comuns como "pix", "agenda", "missa", "dízimo", "capela", "horários" ou limpe os filtros.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs mt-2 cursor-pointer"
              >
                Limpar filtros e exibir guias principais
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
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700 border border-amber-200/80">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-serif">
                  Perguntas Frequentes (FAQ)
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Dúvidas operacionais mais comuns sobre agendamentos, secretaria, PIX e comunidades.
                </p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 font-semibold text-zinc-600 hidden sm:inline-block">
              {filteredFaqs.length} perguntas
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              Nenhuma pergunta frequente coincide com os termos pesquisados.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
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
          )}
        </section>

        {/* Assistance / Support Footer Banner */}
        <section className="bg-brand-50 border border-brand-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-950 font-serif">
              Ainda tem dúvidas sobre o funcionamento do painel?
            </h3>
            <p className="text-xs text-brand-800 max-w-xl">
              Entre em contato com a secretaria paroquial ou consulte os manuais específicos de cada área paroquial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white text-xs">
              <Link href="/ajuda/secretaria">
                <Building2 className="w-3.5 h-3.5 mr-1.5" />
                Manual da Secretaria
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
