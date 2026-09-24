'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Megaphone,
  Plus,
  Pencil,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Eye,
  Volume2,
  FileText,
} from 'lucide-react';
import { listAnnouncements, reorderAnnouncements } from '@/api/announcements';
import { getUrgentAlert } from '@/api/urgent-alert';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { apiBaseUrl } from '@/api/utils/api';

const ITEMS_PER_PAGE = 5;

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3001';

  // Fetch urgent alert
  const { data: alertData, isPending: isAlertPending } = useQuery({
    queryKey: ['urgent-alert'],
    queryFn: getUrgentAlert,
  });

  const urgentAlert = alertData?.alert;

  // Fetch announcements
  const { data: announcementsData, isPending: isAnnouncementsPending } = useQuery({
    queryKey: ['announcements'],
    queryFn: listAnnouncements,
  });

  const announcements = announcementsData?.announcements ?? [];

  // Mutations
  const reorderMutation = useMutation({
    mutationFn: reorderAnnouncements,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const handleMove = (indexInFullList: number, direction: 'up' | 'down') => {
    const newItems = [...announcements];
    const targetIndex = direction === 'up' ? indexInFullList - 1 : indexInFullList + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[indexInFullList];
    newItems[indexInFullList] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const orderedIds = newItems.map((item) => item.id);
    reorderMutation.mutate(orderedIds);
  };

  // Pagination math
  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnnouncements = announcements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getImageUrl = (id: string | null | undefined) => {
    if (!id) return '';
    if (id.startsWith('blob:') || id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/')) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const variantStyles = {
    alert: {
      barBg: 'bg-[#85261d] text-[#fff8f0]',
      badgeBg: 'bg-[#5e1811] text-amber-200 border-amber-500/30',
      badgeText: 'ALERTA URGENTE',
      buttonBg: 'bg-amber-400 text-stone-900',
      icon: AlertTriangle,
      label: 'Alerta Urgente',
      colorBadge: 'bg-red-50 text-red-700 border-red-200',
    },
    info: {
      barBg: 'bg-[#153422] text-[#f4efe6]',
      badgeBg: 'bg-[#0e2417] text-emerald-200 border-emerald-500/30',
      badgeText: 'COMUNICADO',
      buttonBg: 'bg-[#cfa55b] text-[#153422]',
      icon: Info,
      label: 'Comunicado Paroquial',
      colorBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    solemnity: {
      barBg: 'bg-[#6b4c1b] text-[#fff8ed]',
      badgeBg: 'bg-[#4a3411] text-amber-200 border-amber-400/40',
      badgeText: 'SOLENIDADE / FESTA',
      buttonBg: 'bg-[#f4d068] text-[#3a270a]',
      icon: Sparkles,
      label: 'Solenidade / Festa',
      colorBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  };

  const currentVariant = variantStyles[urgentAlert?.variant || 'alert'];
  const VariantIcon = currentVariant.icon;

  const isPending = isAlertPending || isAnnouncementsPending;

  if (isPending) {
    return (
      <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
        <div>
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      {/* Top Breadcrumb: Página raiz sem botão voltar e apenas o título do menu */}
      <AppBreadcrumb
        links={[
          {
            key: 'announcements',
            href: '/announcements',
            title: 'Banners & Avisos',
            icon: Megaphone,
          },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <TypographyH1>Banners & Avisos</TypographyH1>

        {/* Public Site Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="outline" size="sm" className="gap-2 text-xs h-9">
            <a
              href={`${siteBaseUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver no site público</span>
            </a>
          </Button>

          <Button asChild size="sm" className="gap-2 text-xs h-9">
            <Link href="/announcements/add">
              <Plus className="w-4 h-4" />
              <span>Novo Banner</span>
            </Link>
          </Button>
        </div>
      </div>

      <Describe className="mb-8">
        Painel de gerenciamento dos avisos em destaque: configure a faixa de comunicados urgentes e administre os banners do carrossel principal.
      </Describe>

      <div className="space-y-12">
        {/* ========================================================= */}
        {/* SEÇÃO 1: FAIXA DE ALERTA / COMUNICADO URGENTE             */}
        {/* ========================================================= */}
        <section>
          {/* Subtítulo de Seção no layout: Ícone alinhado somente ao subtítulo com a mesma cor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-900">
                <AlertTriangle className="w-5 h-5 text-zinc-900 shrink-0" />
                <h2
                  className="text-xl sm:text-2xl font-semibold text-zinc-900"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Faixa de Alerta Urgente
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Letreiro em destaque com rolagem contínua exibido no topo da página inicial do site
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0 self-start sm:self-center">
              <Link href="/announcements/alert/edit">
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar Faixa</span>
              </Link>
            </Button>
          </div>

          {/* Cards diretos no layout da página */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Card 1.1: Configuração & Visualização do Letreiro */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4.5 h-4.5 text-[#B8872E]" />
                    <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                      Letreiro & Visualização
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      urgentAlert?.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        urgentAlert?.active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                      }`}
                    />
                    {urgentAlert?.active ? 'Ativa no Site' : 'Desativada'}
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">Categoria / Tom:</span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${currentVariant.colorBadge}`}
                    >
                      <VariantIcon className="w-3.5 h-3.5" />
                      {currentVariant.label}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">Texto da Faixa:</span>
                    <p className="font-medium text-zinc-800 bg-zinc-50 border border-zinc-100 p-3 rounded-xl leading-relaxed whitespace-pre-line">
                      {urgentAlert?.text || 'Nenhum texto cadastrado.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">Período de Exibição:</span>
                    <span className="font-medium text-zinc-700">
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
                        'Contínuo (sem data de expiração)'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Prévia Visual
                </span>
                <div
                  className={`w-full rounded-xl overflow-hidden py-2.5 px-3.5 shadow-2xs flex items-center justify-between gap-3 ${currentVariant.barBg}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider border ${currentVariant.badgeBg}`}
                    >
                      <VariantIcon className="w-2.5 h-2.5" />
                      {currentVariant.badgeText}
                    </span>
                    <span className="text-xs font-medium truncate">
                      {urgentAlert?.text || 'Sem texto de alerta'}
                    </span>
                  </div>
                  {urgentAlert?.hasModal && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${currentVariant.buttonBg}`}
                    >
                      {urgentAlert.modalButtonText || 'Ver Detalhes'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 1.2: Modal com Mais Informações */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#B8872E]" />
                  <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
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
                <div className="flex-1 flex flex-col min-h-0 space-y-4 text-xs sm:text-sm">
                  <div className="shrink-0">
                    <span className="text-zinc-500 text-xs block mb-0.5">Título do Modal:</span>
                    <p className="font-semibold text-zinc-900 text-base whitespace-pre-line leading-snug">
                      {urgentAlert.modalTitle || 'Sem título'}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <span className="text-zinc-500 text-xs block mb-1 shrink-0">Conteúdo / Descrição:</span>
                    <div className="flex-1 min-h-[140px] overflow-y-auto whitespace-pre-line bg-zinc-50 p-3 rounded-xl border border-zinc-100 leading-relaxed font-normal text-zinc-600">
                      {urgentAlert.modalDescription || 'Nenhuma descrição detalhada.'}
                    </div>
                  </div>

                  {urgentAlert.modalActionText && (
                    <div className="shrink-0">
                      <span className="text-zinc-500 text-xs block mb-0.5">Botão de Ação:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-600 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                          {urgentAlert.modalActionText}
                          {urgentAlert.modalActionUrl && <ExternalLink className="w-3 h-3" />}
                        </span>
                        {urgentAlert.modalActionUrl && (
                          <span className="text-xs text-zinc-400 truncate max-w-xs">
                            {urgentAlert.modalActionUrl}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                  <Eye className="w-10 h-10 text-zinc-300 stroke-1 mb-2" />
                  <p className="text-sm font-medium text-zinc-700">Nenhum modal vinculado</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                    Ao ativar o modal, o botão na faixa permitirá que os fiéis abram uma janela com informações completas e foto.
                  </p>
                </div>
              )}

              {urgentAlert?.hasModal && urgentAlert.modalImageId && (
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between shrink-0">
                  <span className="text-xs text-zinc-500">Cartaz / Flyer anexado:</span>
                  <ImageLightbox
                    src={getImageUrl(urgentAlert.modalImageId)}
                    label="Cartaz do Comunicado"
                    size="sm"
                    className="h-10 w-16 rounded-lg object-cover border border-zinc-200"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SEÇÃO 2: CARROSSEL DE BANNERS                             */}
        {/* ========================================================= */}
        <section>
          {/* Subtítulo de Seção no layout: Ícone alinhado somente ao subtítulo com a mesma cor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-900">
                <Layers className="w-5 h-5 text-zinc-900 shrink-0" />
                <h2
                  className="text-xl sm:text-2xl font-semibold text-zinc-900"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Banners em Destaque
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Carrossel principal da página inicial com imagens responsivas para computador, tablet e celular
              </p>
            </div>

            <Button asChild size="sm" className="gap-1.5 shrink-0 self-start sm:self-center">
              <Link href="/announcements/add">
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Banner</span>
              </Link>
            </Button>
          </div>

          {announcements.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
              <Megaphone className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-zinc-800">Nenhum banner cadastrado</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-6">
                Crie seu primeiro banner responsivo em 2 etapas para destacar novenas, festas ou eventos paroquiais.
              </p>
              <Link href="/announcements/add">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" /> Cadastrar Primeiro Banner
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedAnnouncements.map((item, pageIdx) => {
                const fullIndex = startIndex + pageIdx;
                const desktopUrl = getImageUrl(item.coverDesktopId);

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                      !item.active ? 'opacity-60 bg-zinc-50/70' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1 items-center justify-center pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleMove(fullIndex, 'up')}
                          disabled={fullIndex === 0}
                          className="text-zinc-400 hover:text-zinc-700 disabled:opacity-20"
                          title="Mover para cima"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-bold text-zinc-400">#{fullIndex + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleMove(fullIndex, 'down')}
                          disabled={fullIndex === announcements.length - 1}
                          className="text-zinc-400 hover:text-zinc-700 disabled:opacity-20"
                          title="Mover para baixo"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Desktop Image Lightbox Preview */}
                      {desktopUrl && (
                        <div className="hidden sm:block shrink-0">
                          <ImageLightbox
                            src={desktopUrl}
                            label="Capa Desktop"
                            size="md"
                            className="h-20 w-32 rounded-xl border border-zinc-200"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.badgeText && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              {item.badgeText}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              item.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-zinc-200 text-zinc-600'
                            }`}
                          >
                            {item.active ? (
                              <>
                                <CheckCircle className="w-3 h-3" /> Ativo
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" /> Inativo
                              </>
                            )}
                          </span>
                        </div>
                        <h4 className="font-semibold text-zinc-900 text-base">{item.title}</h4>
                        <p className="text-sm text-zinc-500 line-clamp-2">{item.description}</p>
                        {item.actionText && (
                          <div className="flex items-center gap-1 text-xs text-brand-600 font-medium pt-1">
                            <span>Botão: {item.actionText}</span>
                            {item.actionUrl && <span className="text-zinc-400">({item.actionUrl})</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href={`/announcements/edit/${item.id}`}>
                          <Pencil className="w-4 h-4" />
                          <span>Editar</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Card para cadastrar novo banner */}
              <Link
                href="/announcements/add"
                className="border-2 border-dashed border-zinc-200 hover:border-brand-500 rounded-2xl p-6 flex items-center justify-center gap-3 bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-full bg-white shadow-xs border border-zinc-200 flex items-center justify-center text-zinc-500 group-hover:text-brand-600 group-hover:border-brand-300 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-zinc-700 group-hover:text-brand-700 transition-colors block">
                    Adicionar Novo Banner
                  </span>
                  <p className="text-xs text-zinc-400">
                    Cadastre um novo banner em destaque com suporte a múltiplos tamanhos de tela
                  </p>
                </div>
              </Link>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-divider mt-8">
                  <span className="text-sm text-zinc-500">
                    Página <strong className="text-zinc-800">{currentPage}</strong> de{' '}
                    <strong className="text-zinc-800">{totalPages}</strong> (Total: {announcements.length} avisos)
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="gap-1"
                    >
                      Próximo <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
