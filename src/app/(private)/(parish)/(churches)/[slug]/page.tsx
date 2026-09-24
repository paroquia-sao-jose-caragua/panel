'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Church,
  MapPin,
  Edit,
  Pencil,
  ExternalLink,
  FileText,
  ImageIcon,
  Calendar,
  Plus,
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  User,
  Phone,
  Mail,
  Clock,
  Trash2,
} from 'lucide-react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommunity } from '@/api/communities/use-community';
import { useMassSchedules } from '@/api/communities/mass-schedules/use-mass-schedules';
import { deleteCommunity } from '@/api/communities/delete';
import { showAlert } from '@/utils/showAlert';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import useTranslator from '@/hooks/use-translator';

const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export default function ChurchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { community, isPending: isCommunityPending } = useCommunity();
  const { massSchedules, isPending: isSchedulesPending } = useMassSchedules();
  const { t } = useTranslator();

  const photos = community?.photos || [];

  const [confirmDeleteCommunity, setConfirmDeleteCommunity] = React.useState(false);
  const [showAllOrdinary, setShowAllOrdinary] = React.useState(false);
  const [showAllDevotional, setShowAllDevotional] = React.useState(false);
  const [showAllAnnual, setShowAllAnnual] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      showAlert('Comunidade excluída com sucesso!');
      router.replace('/');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao excluir comunidade: ${err.message}`);
    },
  });

  React.useEffect(() => {
    const photosCount = photos.length;
    if (lightboxIndex === null || photosCount === 0) return;
    if (lightboxIndex === null || photosCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + photosCount) % photosCount : null
        );
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % photosCount : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, community?.photos]);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3001';
  const publicPageUrl = community?.slug
    ? `${siteBaseUrl}/comunidades/${community.slug}`
    : `${siteBaseUrl}/comunidades`;

  const ordinaryMasses = (massSchedules || [])
    .filter((ms) => ms.type === 'ordinary' && ms.active !== false)
    .sort((a, b) => (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0));

  const devotionalMasses = (massSchedules || []).filter(
    (ms) => ms.type === 'devotional' && ms.active !== false
  );

  const annualMasses = (massSchedules || []).filter(
    (ms) => ms.type === 'solemnity' && ms.active !== false
  );

  const visibleOrdinaryMasses = showAllOrdinary
    ? ordinaryMasses
    : ordinaryMasses.slice(0, 3);

  const visibleDevotionalMasses = showAllDevotional
    ? devotionalMasses
    : devotionalMasses.slice(0, 3);

  const visibleAnnualMasses = showAllAnnual
    ? annualMasses
    : annualMasses.slice(0, 3);

  const formatTimes = (times: { startTime: string }[]) => {
    if (!times || times.length === 0) return '';
    return times.map((t) => t.startTime.replace(':', 'h')).join(' | ');
  };

  const formatDevotionalSchedule = (ms: (typeof devotionalMasses)[0]) => {
    const timesStr = formatTimes(ms.times);
    let dayStr = '';

    if (typeof ms.dayOfMonth === 'number') {
      dayStr = `Dia ${ms.dayOfMonth} de cada mês`;
    } else if (
      typeof ms.weekOfMonth === 'number' &&
      typeof ms.dayOfWeek === 'number'
    ) {
      const weekPrefix =
        ms.weekOfMonth === 5 ? 'Última' : `${ms.weekOfMonth}ª`;
      dayStr = `${WEEKDAYS[ms.dayOfWeek]} (${weekPrefix} sem.)`;
    } else if (typeof ms.dayOfWeek === 'number') {
      dayStr = `Toda ${WEEKDAYS[ms.dayOfWeek]}`;
    }

    if (dayStr && timesStr) return `${dayStr} - ${timesStr}`;
    return dayStr || timesStr || 'Conforme agendamento';
  };

  const formatAnnualSchedule = (ms: (typeof annualMasses)[0]) => {
    if (
      typeof ms.dayOfMonth === 'number' &&
      typeof ms.monthOfYear === 'number'
    ) {
      return `${ms.dayOfMonth} de ${MONTHS[ms.monthOfYear - 1]}`;
    }
    if (typeof ms.monthOfYear === 'number') {
      return MONTHS[ms.monthOfYear - 1];
    }
    if (typeof ms.dayOfMonth === 'number') {
      return `Dia ${ms.dayOfMonth}`;
    }
    return 'Data festiva';
  };

  const isMatriz =
    community?.type === 'parish_church' ||
    community?.name.toLowerCase().includes('matriz');

  const displayName = community?.name
    ? isMatriz && !community.name.toLowerCase().includes('matriz')
      ? `Igreja Matriz ${community.name}`
      : community.name
    : '';

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      {/* 1. TOP BAR: Breadcrumbs + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <AppBreadcrumb
          links={[
            {
              key: 'home',
              href: '/',
              title: 'Início',
            },
            {
              key: 'communities',
              href: '/',
              title: 'Comunidades',
            },
            {
              key: 'church',
              title: isMatriz ? 'Igreja Matriz' : community?.name || '',
              href: `/${community?.slug}`,
            },
          ]}
        />

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Link href={`/${community?.slug}/edit`}>
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar Dados Principais</span>
            </Link>
          </Button>

          {community?.slug && (
            <Button asChild size="sm" className="gap-2 text-xs h-9">
              <a
                href={publicPageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver página no site público</span>
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* 2. HERO & COVER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Left Info Column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            {/* Badge */}
            {isCommunityPending ? (
              <Skeleton className="h-6 w-32 rounded-full mb-3" />
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef8ed] border border-[#D6A64A]/30 text-[#B8872E] text-xs font-semibold tracking-wider uppercase mb-3">
                <Church className="w-3.5 h-3.5 text-[#B8872E]" />
                <span>{isMatriz ? 'IGREJA MATRIZ' : 'CAPELA'}</span>
              </div>
            )}

            {/* Title */}
            {isCommunityPending ? (
              <Skeleton className="h-10 w-3/4 mb-3" />
            ) : (
              <h1
                className="text-3xl sm:text-4xl font-semibold text-zinc-900 mb-2 leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {displayName}
              </h1>
            )}

            {/* Address */}
            {isCommunityPending ? (
              <Skeleton className="h-5 w-full mb-4" />
            ) : (
              <div className="flex items-start gap-2 text-sm text-zinc-600 mb-3">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {community?.address || 'Endereço não informado'}
                </span>
              </div>
            )}

            {/* Subtitle */}
            {community?.heroSubtitle && (
              <p className="text-xs sm:text-sm text-zinc-500 italic mb-4 font-serif">
                &ldquo;{community.heroSubtitle}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Right Church Cover Photo Column */}
        <div className="lg:col-span-6 flex">
          <div className="relative aspect-4/3 w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-zinc-200/80 shadow-xs bg-zinc-100 min-h-[220px]">
            {community?.coverUrl ? (
              <img
                src={community.coverUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-50">
                <Church className="w-12 h-12 mb-2 stroke-1 text-zinc-300" />
                <span className="text-xs">Nenhuma foto de capa cadastrada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2.1 INFORMATION CARDS: Sobre a Comunidade & Padroeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Card: Sobre a Comunidade */}
        <div className="lg:col-span-6 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#B8872E]" />
                <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                  {community?.aboutTitle || 'Sobre a Comunidade'}
                </h3>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Link href={`/${community?.slug}/about`}>
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar texto</span>
                </Link>
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-serif leading-relaxed line-clamp-5">
              {community?.aboutDescription ||
                community?.heroSubtitle ||
                'Nenhum texto cadastrado ainda. Clique em "Editar texto" para adicionar a história e informações sobre a comunidade.'}
            </p>
          </div>

          {community?.historySummary && (
            <div className="mt-3 pt-3 border-t border-zinc-100">
              <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider block mb-1">
                Marcos Históricos
              </span>
              <p className="text-xs text-zinc-500 line-clamp-2">
                {community.historySummary}
              </p>
            </div>
          )}
        </div>

        {/* Card: Padroeiro(a) */}
        <div className="lg:col-span-6 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-[#B8872E]" />
                <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                  Padroeiro(a) da Comunidade
                </h3>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Link href={`/${community?.slug}/patron`}>
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </Link>
              </Button>
            </div>

            {community?.patronName || community?.patronPhotoUrl || community?.patronDescription ? (
              <div className="flex items-start gap-4">
                {community.patronPhotoUrl ? (
                  <img
                    src={community.patronPhotoUrl}
                    alt={community.patronName || 'Padroeiro'}
                    className="size-16 rounded-2xl object-cover border border-zinc-200 shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="size-16 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/30 flex items-center justify-center text-[#B8872E] shrink-0">
                    <User className="w-7 h-7 stroke-1" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-zinc-900 font-serif line-clamp-1 mb-1">
                    {community.patronName || 'Padroeiro(a)'}
                  </h4>
                  <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed font-serif">
                    {community.patronDescription || 'Nenhuma biografia do padroeiro cadastrada.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <User className="w-8 h-8 text-zinc-300 stroke-1 mb-1.5" />
                <p className="text-xs font-medium text-zinc-700">Nenhum padroeiro informado</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Adicione o nome, foto e história do padroeiro(a) nos dados principais.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. GALERIA DE FOTOS SECTION */}
      <div className="w-full rounded-2xl shadow-xs bg-white border border-zinc-200/80 p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-zinc-800" />
            <h2 className="font-semibold text-zinc-900 text-base sm:text-lg">
              Galeria de Fotos
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Link href={`/${community?.slug}/gallery`}>
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar galeria</span>
            </Link>
          </Button>
        </div>

        {!photos || photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-center">
            <ImageIcon className="w-9 h-9 text-zinc-400 mb-2 stroke-1" />
            <p className="text-sm font-medium text-zinc-700">
              Nenhuma foto cadastrada na galeria
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Fotos adicionadas aparecerão aqui e na página pública da comunidade.
            </p>
            <Link href={`/${community?.slug}/gallery`} className="mt-4">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar fotos</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {photos.map((photo, index) => (
              <Button
                key={photo.id || photo.photoId || index}
                type="button"
                variant="ghost"
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-4/3 h-auto w-full p-0 rounded-xl overflow-hidden border border-zinc-200/80 bg-zinc-100 shadow-xs hover:bg-zinc-100 hover:scale-[1.02] text-left block"
              >
                <img
                  src={
                    photo.photoUrl ||
                    (photo.photoId
                      ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/attachments/${photo.photoId}`
                      : '')
                  }
                  alt={photo.caption || `Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-white text-[10px] line-clamp-1 font-serif">
                      {photo.caption}
                    </span>
                  </div>
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Header */}
            <div
              className="flex items-center justify-between w-full max-w-5xl mx-auto z-10 text-white/90"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs font-mono tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {lightboxIndex + 1} / {photos.length}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setLightboxIndex(null)}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white"
                aria-label="Fechar galeria"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Center Image with Navigation */}
            <div
              className="relative flex items-center justify-center flex-1 max-w-5xl mx-auto w-full my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + photos.length) % photos.length
                    )
                  }
                  className="absolute left-2 sm:left-4 z-20 rounded-full bg-black/60 hover:bg-black/80 text-white hover:text-white backdrop-blur-sm border border-white/10 hover:scale-105"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              )}

              <img
                src={
                  photos[lightboxIndex].photoUrl ||
                  (photos[lightboxIndex].photoId
                    ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/attachments/${photos[lightboxIndex].photoId}`
                    : '')
                }
                alt={photos[lightboxIndex].caption || `Foto ${lightboxIndex + 1}`}
                className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-200"
              />

              {photos.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % photos.length)
                  }
                  className="absolute right-2 sm:right-4 z-20 rounded-full bg-black/60 hover:bg-black/80 text-white hover:text-white backdrop-blur-sm border border-white/10 hover:scale-105"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              )}
            </div>

            {/* Bottom Caption */}
            <div
              className="w-full max-w-3xl mx-auto text-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {photos[lightboxIndex].caption ? (
                <p className="text-sm sm:text-base text-white/90 font-serif bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm inline-block border border-white/10">
                  {photos[lightboxIndex].caption}
                </p>
              ) : (
                <span className="text-xs text-white/50 font-serif">
                  {community?.name}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. HORÁRIOS DE MISSA SECTION */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-800" />
            <h2 className="font-semibold text-zinc-900 text-base sm:text-lg">
              Horários de Missa
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Link href={`/${community?.slug}/add-ordinary-mass`}>
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar horários</span>
            </Link>
          </Button>
        </div>

        {/* 3 Columns Grid for Masses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1: Missas Regulares */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="bg-[#f0f6f1] px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-[#18351E]/10 flex items-center justify-center text-[#18351E]">
                    <Church className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-[#18351E]">
                    Missas Regulares
                  </span>
                </div>
                <Link
                  href={`/${community?.slug}/add-ordinary-mass`}
                  className="p-1 hover:bg-[#18351E]/10 rounded-md text-[#18351E] transition-colors"
                  title="Adicionar Missa Regular"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-100">
                {ordinaryMasses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    Nenhum horário regular cadastrado
                  </div>
                ) : (
                  visibleOrdinaryMasses.map((ms) => (
                    <Link
                      key={ms.id}
                      href={`/${community?.slug}/ordinary-mass/${ms.id}/edit`}
                      className="group px-4 py-3 flex items-center justify-between hover:bg-zinc-50 transition-colors text-xs sm:text-sm"
                    >
                      <span className="font-medium text-zinc-800">
                        {typeof ms.dayOfWeek === 'number'
                          ? WEEKDAYS[ms.dayOfWeek]
                          : 'Semanal'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-zinc-600">
                          {formatTimes(ms.times)}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {ordinaryMasses.length > 3 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAllOrdinary((prev) => !prev)}
                className="flex items-center justify-start gap-1.5 px-4 py-2.5 text-xs text-[#18351E] font-medium hover:underline border-t border-zinc-100 bg-zinc-50/40 w-full rounded-none h-auto"
              >
                {showAllOrdinary ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Ver menos horários</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Ver mais horários</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Column 2: Devocionais */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="bg-[#fdf8f0] px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-[#B8872E]/10 flex items-center justify-center text-[#B8872E]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-[#8c6016]">
                    Devocionais
                  </span>
                </div>
                <Link
                  href={`/${community?.slug}/add-devotional-mass`}
                  className="p-1 hover:bg-[#B8872E]/10 rounded-md text-[#8c6016] transition-colors"
                  title="Adicionar Missa Devocional"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-100">
                {devotionalMasses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    Nenhuma devoção cadastrada
                  </div>
                ) : (
                  visibleDevotionalMasses.map((ms) => (
                    <Link
                      key={ms.id}
                      href={`/${community?.slug}/devotional-mass/${ms.id}/edit`}
                      className="group px-4 py-3 flex items-center justify-between hover:bg-zinc-50 transition-colors text-xs sm:text-sm"
                    >
                      <span className="font-medium text-zinc-800 line-clamp-1 pr-2">
                        {ms.title || 'Devoção'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-500">
                          {formatDevotionalSchedule(ms)}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {devotionalMasses.length > 3 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAllDevotional((prev) => !prev)}
                className="flex items-center justify-start gap-1.5 px-4 py-2.5 text-xs text-[#8c6016] font-medium hover:underline border-t border-zinc-100 bg-zinc-50/40 w-full rounded-none h-auto"
              >
                {showAllDevotional ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Ver menos horários</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Ver mais horários</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Column 3: Anuais */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="bg-[#f0f5fa] px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-[#2b5c8f]/10 flex items-center justify-center text-[#2b5c8f]">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-[#1e446d]">
                    Anuais
                  </span>
                </div>
                <Link
                  href={`/${community?.slug}/add-annual-mass`}
                  className="p-1 hover:bg-[#2b5c8f]/10 rounded-md text-[#1e446d] transition-colors"
                  title="Adicionar Missa Anual / Solenidade"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-100">
                {annualMasses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    Nenhuma missa anual cadastrada
                  </div>
                ) : (
                  visibleAnnualMasses.map((ms) => (
                    <Link
                      key={ms.id}
                      href={`/${community?.slug}/annual-mass/${ms.id}/edit`}
                      className="group px-4 py-3 flex items-center justify-between hover:bg-zinc-50 transition-colors text-xs sm:text-sm"
                    >
                      <span className="font-medium text-zinc-800 line-clamp-1 pr-2">
                        {ms.title || 'Missa Festiva'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-500">
                          {formatAnnualSchedule(ms)}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {annualMasses.length > 3 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAllAnnual((prev) => !prev)}
                className="flex items-center justify-start gap-1.5 px-4 py-2.5 text-xs text-[#1e446d] font-medium hover:underline border-t border-zinc-100 bg-zinc-50/40 w-full rounded-none h-auto"
              >
                {showAllAnnual ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Ver menos horários</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Ver mais horários</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 4. DANGER ZONE: Opções Avançadas / Exclusão discreta da Comunidade */}
      {!isCommunityPending && community && (
        <div className="mt-14 pt-8 border-t border-zinc-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
              Gerenciamento da Comunidade
            </span>
            <p className="text-xs text-zinc-400 mt-0.5">
              Excluir esta comunidade removerá permanentemente suas fotos, horários e textos cadastrados.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDeleteCommunity(true)}
            className="text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 px-3 transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir Comunidade</span>
          </Button>
        </div>
      )}

      <DeleteConfirmationDialog
        open={confirmDeleteCommunity}
        onOpenChange={setConfirmDeleteCommunity}
        title="Excluir Comunidade"
        itemName={displayName}
        description={`Tem certeza que deseja excluir a comunidade "${displayName}"? Esta ação é irreversível e excluirá permanentemente todos os horários de missas, textos e fotos associados.`}
        isPending={deleteMutation.isPending}
        onConfirm={async () => {
          if (!community?.id) return;
          await deleteMutation.mutateAsync(community.id);
          setConfirmDeleteCommunity(false);
        }}
      />
    </main>
  );
}

