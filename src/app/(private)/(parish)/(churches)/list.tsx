'use client';

/* eslint-disable @next/next/no-img-element */

import React from 'react';
import Link from 'next/link';
import { Church, MapPin, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { useCommunities } from '@/api/communities/use-communities';
import { Skeleton } from '@/components/ui/skeleton';

export const CommunitiesList = () => {
  const { communities, isPending } = useCommunities();

  const getImageUrl = (coverUrl?: string, coverId?: string) => {
    if (coverUrl) return coverUrl;
    if (!coverId) return '/pastoral-center.png';
    if (
      coverId.startsWith('http://') ||
      coverId.startsWith('https://') ||
      coverId.startsWith('/')
    ) {
      return coverId;
    }
    const apiBase = process.env.NEXT_PUBLIC_BASE_API_URL || '';
    return `${apiBase}/attachments/${coverId}`;
  };

  if (isPending) {
    return (
      <div className="space-y-8">
        {/* Matriz Full Width Skeleton */}
        <div className="w-full bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-xs p-6 flex flex-col md:flex-row gap-6 min-h-[340px]">
          <Skeleton className="w-full md:w-5/12 h-64 md:h-auto min-h-[260px] rounded-2xl" />
          <div className="w-full md:w-7/12 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="size-10 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-10 w-full rounded-xl mb-4" />
            </div>
            <Skeleton className="h-11 w-48 rounded-full" />
          </div>
        </div>

        {/* Other Communities Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs min-h-[260px]"
            >
              <div>
                <Skeleton className="h-36 w-full rounded-xl mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
              </div>
              <Skeleton className="h-4 w-1/2 mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const matriz =
    communities?.find(
      (c) =>
        c.type === 'parish_church' || c.name.toLowerCase().includes('matriz')
    ) || communities?.[0];

  const otherCommunities =
    communities?.filter((c) => c.id !== matriz?.id) || [];

  if (!matriz && otherCommunities.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center shadow-xs">
        <div className="size-16 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] mx-auto mb-4">
          <Church className="w-8 h-8" />
        </div>
        <h3
          className="text-2xl font-semibold text-zinc-900 mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Nenhuma comunidade encontrada
        </h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
          Comece cadastrando a Igreja Matriz ou uma das capelas da Paróquia São José.
        </p>
        <Link
          href="/add"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] hover:bg-[#27442A] text-white text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar primeira comunidade</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Igreja Matriz Full Width Card (100%) */}
      {matriz && (
        <Link
          href={`/${matriz.slug || matriz.id}`}
          className="w-full bg-white border border-[#D6A64A]/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col md:flex-row items-stretch group cursor-pointer relative"
        >
          {/* Cover Photo Container */}
          <div className="relative md:w-5/12 lg:w-4/9 min-h-[260px] md:min-h-[320px] overflow-hidden bg-[#f3ece0]">
            <img
              src={getImageUrl(matriz.coverUrl, matriz.coverId)}
              alt={matriz.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18351E] border border-[#D6A64A]/40 text-[#D6A64A] text-xs font-semibold tracking-wider uppercase shadow-md">
              <Sparkles className="w-3 h-3 text-[#D6A64A]" />
              <span>
                {matriz.type === 'parish_church'
                  ? 'COMUNIDADE MATRIZ'
                  : 'IGREJA PRINCIPAL'}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="md:w-7/12 lg:w-5/9 p-6 md:p-8 lg:p-10 flex flex-col justify-between relative z-10">
            <div>
              {/* Header: Icon + Title + Badge */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] shrink-0 mt-0.5">
                  <Church className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-2xl md:text-3xl font-semibold text-zinc-900 leading-tight group-hover:text-[#B8872E] transition-colors"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {matriz.name}
                  </h3>
                  <span className="text-[10px] font-bold text-[#B8872E] uppercase tracking-widest">
                    MATRIZ
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6 font-serif line-clamp-3 md:line-clamp-4">
                {matriz.aboutDescription ||
                  matriz.heroSubtitle ||
                  'É na Igreja Matriz que nossa paróquia tem sua sede e realiza as principais celebrações e atividades pastorais.'}
              </p>

              {/* Address Row */}
              <div className="py-4 border-t border-b border-[#D6A64A]/20 mb-6 text-xs sm:text-sm text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B8872E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block mb-0.5">
                      Endereço
                    </span>
                    <span className="line-clamp-2">
                      {matriz.address || 'Caraguatatuba / SP'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manage Button */}
            <div>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] text-white text-xs sm:text-sm font-semibold group-hover:bg-[#27442A] transition-all shadow-md">
                <span>Gerenciar comunidade</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* 2. Other Communities Section & Grid Below (100% width space) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Church className="w-5 h-5 text-zinc-700" />
            <h2
              className="text-xl sm:text-2xl font-semibold text-zinc-900"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Capelas e Comunidades
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {otherCommunities.map((item) => {
            const imageSrc = getImageUrl(item.coverUrl, item.coverId);
            return (
              <Link
                key={item.id}
                href={`/${item.slug || item.id}`}
                className="group bg-white border border-[#D6A64A]/30 sm:border-zinc-200/80 rounded-2xl p-4 flex flex-col justify-between text-left shadow-xs hover:shadow-md hover:border-[#B8872E] hover:-translate-y-1 transition-all cursor-pointer min-h-[260px]"
              >
                <div>
                  {/* Rectangular Image */}
                  <div className="h-38 w-full overflow-hidden rounded-xl bg-zinc-100 mb-3 relative">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-base font-semibold text-zinc-900 group-hover:text-[#B8872E] transition-colors leading-snug mb-2 line-clamp-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {item.name}
                  </h3>

                  {/* Info */}
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                    <span className="truncate">
                      {item.address || 'Caraguatatuba / SP'}
                    </span>
                  </div>
                </div>

                {/* Link Footer */}
                <div className="flex items-center gap-1 text-xs font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors pt-2 border-t border-[#D6A64A]/20">
                  <span>Gerenciar comunidade</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}

          {/* Add Community Action Card */}
          <Link
            href="/add"
            className="group bg-zinc-50/60 border-2 border-dashed border-[#D6A64A]/40 hover:border-[#B8872E] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-[#fefbf6] transition-all cursor-pointer min-h-[260px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] group-hover:scale-110 transition-transform mb-3">
              <Plus className="w-6 h-6" strokeWidth={2} />
            </div>
            <h4
              className="text-base font-semibold text-zinc-900 group-hover:text-[#B8872E] transition-colors mb-1"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Adicionar comunidade
            </h4>
            <p className="text-xs text-zinc-500 max-w-[180px]">
              Cadastre uma nova capela ou igreja na paróquia
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
