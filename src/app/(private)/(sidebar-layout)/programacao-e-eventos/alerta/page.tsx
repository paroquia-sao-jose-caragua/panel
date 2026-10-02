'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Volume2,
  FileText,
  Pencil,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldAlert,
  Layers,
  Power,
  Info,
  X,
} from 'lucide-react';
import { getUrgentAlert, updateUrgentAlert } from '@/api/urgent-alert';
import { apiBaseUrl } from '@/api/utils/api';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';

export default function UrgentAlertPage() {
  const queryClient = useQueryClient();
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3001';

  // Fetch urgent alert data
  const { data: alertData, isPending } = useQuery({
    queryKey: ['urgent-alert'],
    queryFn: getUrgentAlert,
  });

  const urgentAlert = alertData?.alert;

  // Toggle active status mutation
  const toggleMutation = useMutation({
    mutationFn: (newActive: boolean) => {
      if (!urgentAlert) throw new Error('Dados do alerta não disponíveis.');
      return updateUrgentAlert({
        active: newActive,
        text: urgentAlert.text || '',
        variant: urgentAlert.variant || 'alert',
        startsAt: urgentAlert.startsAt || null,
        endsAt: urgentAlert.endsAt || null,
        hasModal: urgentAlert.hasModal ?? false,
        modalButtonText: urgentAlert.modalButtonText || 'Ver Detalhes',
        modalTitle: urgentAlert.modalTitle || null,
        modalDescription: urgentAlert.modalDescription || null,
        modalImageId: urgentAlert.modalImageId || null,
        modalActionText: urgentAlert.modalActionText || null,
        modalActionUrl: urgentAlert.modalActionUrl || null,
      });
    },
    onSuccess: (_, newActive) => {
      queryClient.invalidateQueries({ queryKey: ['urgent-alert'] });
      queryClient.invalidateQueries({ queryKey: ['active-urgent-alert'] });
      showAlert(
        newActive
          ? 'Faixa de alerta ativada com sucesso no site público!'
          : 'Faixa de alerta desativada.'
      );
    },
    onError: (err: Error) => {
      showAlert(`Erro ao atualizar status da faixa: ${err.message}`);
    },
  });

  const getImageUrl = (id: string | null | undefined) => {
    if (!id) return '';
    if (
      id.startsWith('blob:') ||
      id.startsWith('http://') ||
      id.startsWith('https://') ||
      id.startsWith('/')
    ) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const variantStyles = {
    alert: {
      barBg:
        'bg-gradient-to-r from-[#701710] via-[#85261d] to-[#701710] text-[#fff8f2] border-b border-[#a8382c]/40',
      badgeBg: 'bg-[#5e1811] text-amber-200 border-amber-500/30',
      buttonBg: 'bg-amber-400 text-stone-900 hover:bg-amber-300',
      label: 'Alerta Urgente',
      colorBadge: 'bg-red-50 text-red-700 border-red-200',
      icon: AlertTriangle,
    },
    info: {
      barBg:
        'bg-gradient-to-r from-[#0f2617] via-[#153422] to-[#0f2617] text-[#f4efe6] border-b border-emerald-700/30',
      badgeBg: 'bg-[#0e2417] text-emerald-200 border-emerald-500/30',
      buttonBg: 'bg-[#cfa55b] text-[#153422] hover:bg-[#d8b066]',
      label: 'Comunicado Paroquial',
      colorBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Info,
    },
    solemnity: {
      barBg:
        'bg-gradient-to-r from-[#523912] via-[#6e4e1a] to-[#523912] text-[#fff8ed] border-b border-amber-500/40',
      badgeBg: 'bg-[#4a3411] text-amber-200 border-amber-400/40',
      buttonBg: 'bg-[#f4d068] text-[#3a270a] hover:bg-[#fae088]',
      label: 'Solenidade / Festa',
      colorBadge: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Sparkles,
    },
  };

  const currentVariant = variantStyles[urgentAlert?.variant || 'alert'];
  const VariantIcon = currentVariant.icon;

  if (isPending) {
    return (
      <>
        <AppHeader
          links={[
            {
              key: 'announcements',
              href: ROUTES.ANNOUNCEMENTS.HOME,
              title: 'Banners',
              icon: Layers,
            },
            {
              key: 'alert',
              href: ROUTES.ANNOUNCEMENTS.ALERT,
              title: 'Faixa de Alerta',
              icon: AlertTriangle,
            },
          ]}
        />
        <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
          <div>
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-28 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </main>
      </>
    );
  }

  const isActive = Boolean(urgentAlert?.active);

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'announcements',
            href: ROUTES.ANNOUNCEMENTS.HOME,
            title: 'Banners',
            icon: Layers,
          },
          {
            key: 'alert',
            href: ROUTES.ANNOUNCEMENTS.ALERT,
            title: 'Faixa de Alerta',
            icon: AlertTriangle,
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <TypographyH1>Faixa de Alerta Urgente</TypographyH1>

          <div className="flex items-center gap-2 flex-wrap">
            <Button asChild variant="outline" size="sm" className="gap-2 text-xs h-9">
              <a href={siteBaseUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span>Ver no site público</span>
              </a>
            </Button>

            <Button asChild size="sm" className="gap-2 text-xs h-9 bg-brand-800 hover:bg-brand-700 text-white">
              <Link href={ROUTES.ANNOUNCEMENTS.EDIT_ALERT}>
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar Faixa de Alerta</span>
              </Link>
            </Button>
          </div>
        </div>

        <Describe className="mb-8">
          Letreiro em destaque exibido no topo da página inicial do site paroquial com rolagem contínua.
          Ideal para avisos extraordinários, emergências, mudanças de horário e solenidades.
        </Describe>

        <div className="space-y-8">
          {/* ========================================================= */}
          {/* CARD 1: STATUS HERO & QUICK TOGGLE                       */}
          {/* ========================================================= */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 transition-all ${
              isActive
                ? 'bg-emerald-50/80 border-emerald-200/80 shadow-2xs'
                : 'bg-zinc-50 border-zinc-200/80'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                      {isActive ? 'Faixa Ativa no Site' : 'Faixa Desativada'}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                        }`}
                      />
                      {isActive ? 'Visível no topo do site' : 'Oculta para os fiéis'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl">
                    {isActive
                      ? 'O letreiro está sendo exibido para todos os fiéis que acessam a página inicial do site da paróquia.'
                      : 'A mensagem está salva no sistema, mas não está visível no site público.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                <Button
                  type="button"
                  variant={isActive ? 'outline' : 'default'}
                  size="sm"
                  disabled={toggleMutation.isPending || !urgentAlert?.text}
                  onClick={() => toggleMutation.mutate(!isActive)}
                  className={`gap-2 text-xs font-semibold cursor-pointer ${
                    isActive
                      ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isActive ? 'Desativar Faixa' : 'Ativar no Site'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SEÇÃO 2: PRÉVIA EM TEMPO REAL                             */}
          {/* ========================================================= */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Simulação do Site
                </span>
                <h3 className="font-semibold text-zinc-900 text-base">
                  Prévia da Faixa no Topo da Página
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${currentVariant.colorBadge}`}
                >
                  <VariantIcon className="w-3.5 h-3.5" />
                  <span>{currentVariant.label}</span>
                </span>
              </div>
            </div>

            {/* Simulated browser ribbon */}
            <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-xs">
              <div className="bg-zinc-100 px-4 py-2 border-b border-zinc-200 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 truncate">{siteBaseUrl}</span>
              </div>

              {/* Top Banner Ribbon - 100% Text & Clickable */}
              <div
                onClick={() => urgentAlert?.hasModal && setModalPreviewOpen(true)}
                className={`w-full py-3.5 px-4 sm:px-6 shadow-inner flex items-center transition-all select-none ${
                  urgentAlert?.hasModal
                    ? 'cursor-pointer hover:brightness-105 active:brightness-95'
                    : 'cursor-default'
                } ${currentVariant.barBg}`}
                title={
                  urgentAlert?.hasModal
                    ? 'Faixa clicável: clique para abrir a janela com os detalhes'
                    : undefined
                }
              >
                <div className="overflow-hidden relative w-full flex items-center">
                  <div className="text-sm sm:text-base font-semibold tracking-wide flex items-center gap-6 whitespace-nowrap overflow-x-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className="inline-flex items-center gap-6 shrink-0">
                        <span>{urgentAlert?.text || 'Nenhum texto de alerta cadastrado'}</span>
                        <span className="opacity-60 text-sm sm:text-base">☩</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Informação sobre a interação */}
              <div className="bg-zinc-50 px-4 py-2.5 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>
                    {urgentAlert?.hasModal
                      ? 'A faixa é contínua e 100% clicável: qualquer clique sobre o letreiro abre o modal de detalhes.'
                      : 'Faixa exclusivamente textual contínua (sem janela modal vinculada).'}
                  </span>
                </span>
                {urgentAlert?.hasModal && (
                  <button
                    type="button"
                    onClick={() => setModalPreviewOpen(true)}
                    className="font-semibold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Testar clique na faixa</span>
                  </button>
                )}
              </div>

              {/* Simulated header preview below the ribbon */}
              <div className="bg-zinc-50/80 px-6 py-4 flex items-center justify-between text-zinc-400 text-xs border-t border-zinc-200/50">
                <span className="font-semibold text-zinc-500">Paróquia São José de Caraguatatuba</span>
                <span>[Menu de Navegação do Site]</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SEÇÃO 3: DETALHES DO LETREIRO & MODAL                     */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 3.1: Letreiro & Período */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <Volume2 className="w-4.5 h-4.5 text-[#B8872E]" />
                  <h3 className="font-semibold text-zinc-900 text-base">
                    Configuração do Letreiro
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">
                      Categoria / Estilo Litúrgico:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${currentVariant.colorBadge}`}
                    >
                      <VariantIcon className="w-3.5 h-3.5" />
                      <span>{currentVariant.label}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">
                      Texto da Faixa:
                    </span>
                    <p className="font-medium text-zinc-800 bg-zinc-50 border border-zinc-100 p-3.5 rounded-xl leading-relaxed whitespace-pre-line text-sm">
                      {urgentAlert?.text || 'Nenhum texto cadastrado.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">
                      Período de Exibição / Vigência:
                    </span>
                    <div className="flex items-center gap-2 text-zinc-700 bg-zinc-50 border border-zinc-100 px-3.5 py-2.5 rounded-xl text-xs font-medium">
                      <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>
                        {urgentAlert?.startsAt || urgentAlert?.endsAt ? (
                          <>
                            {urgentAlert.startsAt
                              ? new Date(urgentAlert.startsAt).toLocaleString('pt-BR')
                              : 'Imediato'}{' '}
                            até{' '}
                            {urgentAlert.endsAt
                              ? new Date(urgentAlert.endsAt).toLocaleString('pt-BR')
                              : 'Indeterminado'}
                          </>
                        ) : (
                          'Contínuo (sem data de expiração configurada)'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100">
                <Button asChild variant="outline" size="sm" className="w-full gap-2 text-xs">
                  <Link href={ROUTES.ANNOUNCEMENTS.EDIT_ALERT}>
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar Texto ou Estilo</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 3.2: Modal com Mais Informações */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-[#B8872E]" />
                    <h3 className="font-semibold text-zinc-900 text-base">
                      Janela Modal de Detalhes
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      urgentAlert?.hasModal
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {urgentAlert?.hasModal ? 'Habilitado' : 'Desabilitado'}
                  </span>
                </div>

                {urgentAlert?.hasModal ? (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-zinc-500 text-xs block mb-0.5">
                        Título do Modal:
                      </span>
                      <p className="font-semibold text-zinc-900 text-base">
                        {urgentAlert.modalTitle || 'Sem título'}
                      </p>
                    </div>

                    <div>
                      <span className="text-zinc-500 text-xs block mb-1">
                        Conteúdo / Descrição Completa:
                      </span>
                      <div className="max-h-32 overflow-y-auto whitespace-pre-line bg-zinc-50 p-3 rounded-xl border border-zinc-100 leading-relaxed text-zinc-600 text-xs">
                        {urgentAlert.modalDescription || 'Nenhuma descrição detalhada.'}
                      </div>
                    </div>

                    {urgentAlert.modalActionText && (
                      <div>
                        <span className="text-zinc-500 text-xs block mb-1">
                          Botão de Ação / Link Externo:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 text-xs">
                            {urgentAlert.modalActionText}
                            {urgentAlert.modalActionUrl && (
                              <ExternalLink className="w-3 h-3" />
                            )}
                          </span>
                          {urgentAlert.modalActionUrl && (
                            <span className="text-xs text-zinc-400 truncate max-w-xs">
                              {urgentAlert.modalActionUrl}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {urgentAlert.modalImageId && (
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          Cartaz / Flyer anexado:
                        </span>
                        <ImageLightbox
                          src={getImageUrl(urgentAlert.modalImageId)}
                          label="Cartaz do Comunicado"
                          size="sm"
                          className="h-10 w-16 rounded-lg object-cover border border-zinc-200"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Eye className="w-10 h-10 text-zinc-300 stroke-1 mb-2" />
                    <p className="text-sm font-medium text-zinc-700">
                      Nenhum modal vinculado
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                      Ao ativar a janela modal, os fiéis podem clicar em qualquer ponto da faixa de alerta para abrir uma janela com mais detalhes, texto completo e cartaz anexado.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2">
                {urgentAlert?.hasModal && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalPreviewOpen(true)}
                    className="flex-1 gap-1.5 text-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Testar Modal</span>
                  </Button>
                )}

                <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                  <Link href={ROUTES.ANNOUNCEMENTS.EDIT_ALERT}>
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{urgentAlert?.hasModal ? 'Editar Modal' : 'Habilitar Modal'}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SEÇÃO 4: CARD DE ATALHO PARA OS BANNERS                  */}
          {/* ========================================================= */}
          <div className="bg-gradient-to-r from-zinc-50 via-white to-zinc-50 border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#B8872E]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 text-sm sm:text-base">
                  Deseja gerenciar os Banners do Carrossel?
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Organize os banners principais da página inicial para festas, campanhas de dízimo e eventos de médio prazo.
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-2 shrink-0 self-start sm:self-center">
              <Link href={ROUTES.ANNOUNCEMENTS.HOME}>
                <span>Ir para Banners</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Modal Preview Dialog */}
      {urgentAlert?.hasModal && (
        <Dialog open={modalPreviewOpen} onOpenChange={setModalPreviewOpen}>
          <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-xl font-bold text-zinc-900 leading-tight">
                {urgentAlert.modalTitle || 'Comunicado Paroquial'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Prévia da janela modal da faixa de alerta
              </DialogDescription>
            </DialogHeader>
 
            <div className="px-6 pb-6 space-y-4">
              {urgentAlert.modalImageId && (
                <div className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 max-h-64 flex items-center justify-center">
                  <img
                    src={getImageUrl(urgentAlert.modalImageId)}
                    alt={urgentAlert.modalTitle || 'Cartaz'}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="text-sm text-zinc-700 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                {urgentAlert.modalDescription}
              </div>

              {urgentAlert.modalActionText && (
                <div className="pt-2 border-t border-zinc-100 flex justify-end">
                  <Button
                    type="button"
                    asChild={Boolean(urgentAlert.modalActionUrl)}
                    className="bg-brand-800 hover:bg-brand-700 text-white gap-2"
                  >
                    {urgentAlert.modalActionUrl ? (
                      <a
                        href={urgentAlert.modalActionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{urgentAlert.modalActionText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span>{urgentAlert.modalActionText}</span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
