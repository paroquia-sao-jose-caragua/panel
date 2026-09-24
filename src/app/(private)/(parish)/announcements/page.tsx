'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Megaphone,
  Plus,
  Edit,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
} from 'lucide-react';
import Link from 'next/link';
import {
  listAnnouncements,
  reorderAnnouncements,
} from '@/api/announcements';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { apiBaseUrl } from '@/api/utils/api';

const ITEMS_PER_PAGE = 5;

export default function AnnouncementsListPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch announcements
  const { data, isPending } = useQuery({
    queryKey: ['announcements'],
    queryFn: listAnnouncements,
  });

  const announcements = data?.announcements ?? [];

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

  const getImageUrl = (id: string) => {
    if (!id) return '';
    if (id.startsWith('blob:') || id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/')) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[
          { key: 'origin', href: '/announcements', title: 'Banners & Avisos', icon: Megaphone },
        ]}
      />

      <div className="flex flex-row justify-between items-center w-full">
        <TypographyH1>Banners & Avisos</TypographyH1>

        <div className="hidden items-center md:flex">
          <Link href="/announcements/add">
            <Button size="lg">
              <PlusIcon />
              Adicionar Banner
            </Button>
          </Link>
        </div>
      </div>

      <Describe>
        Gerencie os banners em destaque exibidos no topo do site público com suporte a múltiplos tamanhos de tela.
      </Describe>

      {/* Content Section */}
      <div className="py-6 space-y-8">
        {isPending ? (
          <div className="flex items-center gap-2 text-zinc-500 py-16 justify-center">
            <Spinner className="w-6 h-6 text-brand-600" />
            Carregando avisos...
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
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
                  className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
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
                          className="h-20 w-32 rounded-xl"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
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

                      <h4 className="font-bold text-zinc-900 text-lg">{item.title}</h4>
                      <p className="text-zinc-600 text-sm line-clamp-2">{item.description}</p>

                      <div className="flex items-center gap-3 pt-2 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-md font-medium text-zinc-700">
                          <Monitor className="w-3.5 h-3.5 text-brand-600" /> Desktop
                        </span>
                        {item.coverTabletId && (
                          <span className="inline-flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-md font-medium text-zinc-700">
                            <Tablet className="w-3.5 h-3.5 text-zinc-500" /> Tablet
                          </span>
                        )}
                        {item.coverMobileId && (
                          <span className="inline-flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-md font-medium text-zinc-700">
                            <Smartphone className="w-3.5 h-3.5 text-zinc-500" /> Mobile
                          </span>
                        )}
                        {item.actionText && (
                          <span className="text-brand-700 font-medium ml-auto hidden sm:inline">
                            CTA: {item.actionText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                      <Link href={`/announcements/edit/${item.id}`}>
                        <Edit className="w-3.5 h-3.5" /> Editar
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Add Announcement Action Card */}
            <Link
              href="/announcements/add"
              className="group bg-zinc-50/60 border-2 border-dashed border-[#D6A64A]/40 hover:border-[#B8872E] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4 shadow-xs hover:shadow-md hover:bg-[#fefbf6] transition-all cursor-pointer min-h-[100px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] group-hover:scale-110 transition-transform shrink-0">
                <Plus className="w-6 h-6" strokeWidth={2} />
              </div>
              <div>
                <h4
                  className="text-base font-semibold text-zinc-900 group-hover:text-[#B8872E] transition-colors mb-0.5"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Adicionar banner ou aviso
                </h4>
                <p className="text-xs text-zinc-500">
                  Cadastre um novo banner em destaque com suporte a múltiplos tamanhos de tela
                </p>
              </div>
            </Link>

            {/* Paginação Inteligente */}
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
      </div>
    </main>
  );
}
