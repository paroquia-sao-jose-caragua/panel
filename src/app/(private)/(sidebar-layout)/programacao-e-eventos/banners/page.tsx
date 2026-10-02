'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppHeader } from '@/components/common/header';
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
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { listAnnouncements, reorderAnnouncements } from '@/api/announcements';
import { getUrgentAlert } from '@/api/urgent-alert';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { apiBaseUrl } from '@/api/utils/api';
import { ROUTES } from '@/constants/routes';

const ITEMS_PER_PAGE = 5;

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3001';

  // Fetch urgent alert for status preview
  const { data: alertData } = useQuery({
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

  // Reorder Mutation
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

  if (isAnnouncementsPending) {
    return (
      <>
        <AppHeader
          links={[
            {
              key: 'announcements',
              href: ROUTES.ANNOUNCEMENTS.HOME,
              title: 'Banners',
              icon: Megaphone,
            },
          ]}
        />
        <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
          <div>
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-20 rounded-2xl" />

          <div className="space-y-4">
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'announcements',
            href: ROUTES.ANNOUNCEMENTS.HOME,
            title: 'Banners',
            icon: Megaphone,
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <TypographyH1>Banners em Destaque</TypographyH1>

          <div className="flex items-center gap-2 flex-wrap">
            <Button asChild variant="outline" size="sm" className="gap-2 text-xs h-9">
              <a href={siteBaseUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span>Ver no site público</span>
              </a>
            </Button>

            <Button asChild size="sm" className="gap-2 text-xs h-9 bg-brand-800 hover:bg-brand-700 text-white">
              <Link href={ROUTES.ANNOUNCEMENTS.ADD}>
                <Plus className="w-4 h-4" />
                <span>Novo Banner</span>
              </Link>
            </Button>
          </div>
        </div>

        <Describe className="mb-6">
          Gerencie os banners do carrossel principal da página inicial do site paroquial com imagens responsivas para computador, tablet e celular.
        </Describe>

        <div className="space-y-8">
          {/* Banners List Section */}
          <section className="space-y-4">
            {announcements.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center shadow-xs">
                <Megaphone className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-zinc-800">Nenhum banner cadastrado</h3>
                <p className="text-zinc-500 text-sm mt-1 mb-6">
                  Crie seu primeiro banner responsivo para destacar festas, novenas ou eventos paroquiais.
                </p>
                <Link href={ROUTES.ANNOUNCEMENTS.ADD}>
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
                        {/* Botões de Reordenação */}
                        <div className="flex sm:flex-col items-center gap-1 shrink-0 bg-zinc-50 p-1 rounded-xl border border-zinc-100">
                          <button
                            type="button"
                            onClick={() => handleMove(fullIndex, 'up')}
                            disabled={fullIndex === 0 || reorderMutation.isPending}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer rounded-lg hover:bg-zinc-200/50"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-zinc-500 px-1">
                            {fullIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMove(fullIndex, 'down')}
                            disabled={
                              fullIndex === announcements.length - 1 || reorderMutation.isPending
                            }
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer rounded-lg hover:bg-zinc-200/50"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Prévia da Capa */}
                        <div className="relative group shrink-0">
                          {desktopUrl ? (
                            <ImageLightbox
                              src={desktopUrl}
                              label={item.title}
                              size="md"
                              className="h-24 w-40 object-cover rounded-xl border border-zinc-200 shadow-2xs group-hover:opacity-95 transition-opacity"
                            />
                          ) : (
                            <div className="h-24 w-40 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center text-zinc-400 p-2 text-center">
                              <Megaphone className="w-6 h-6 mb-1 opacity-50" />
                              <span className="text-[10px] leading-tight font-medium">
                                Sem imagem anexada
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Informações do Banner */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
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
                              {item.actionUrl && (
                                <span className="text-zinc-400">({item.actionUrl})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
                        <Button asChild variant="outline" size="sm" className="gap-2">
                          <Link href={`/avisos/editar/${item.id}`}>
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
                  href={ROUTES.ANNOUNCEMENTS.ADD}
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
                      <strong className="text-zinc-800">{totalPages}</strong> (Total:{' '}
                      {announcements.length} banners)
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        className="gap-1 cursor-pointer"
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
    </>
  );
}
