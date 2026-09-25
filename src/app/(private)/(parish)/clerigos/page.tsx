'use client';

/* eslint-disable @next/next/no-img-element */

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Pencil,
  Sparkles,
  Church,
  Shield,
  UsersIcon,
  PlusIcon,
} from 'lucide-react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useClergy } from '@/api/clergy/use-clergy';
import type { Clergy } from '@/entities/Clergy';

export default function ClergiesPage() {
  const { clergy, isPending } = useClergy();

  const mainMember =
    clergy.find((m) => m.isMain || m.position === 'parish_priest') || clergy[0];
  const otherMembers = clergy.filter((m) => m.id !== mainMember?.id);

  const getFallbackPhoto = (member: Clergy) => {
    if (member.photoUrl) return member.photoUrl;
    if (member.position === 'parish_priest') return '/clergies/paroco.png';
    if (member.position === 'permanent_deacon') return '/clergies/diacono.png';
    if (member.position === 'diocesan_bishop') return '/clergies/bispo.png';
    if (member.position === 'supreme_pontiff') return '/clergies/papa.png';
    return '/clergies/paroco.png';
  };

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      {/* Top Breadcrumb & Action */}
      <AppBreadcrumb
        links={[
          { key: 'origin', href: '/clerigos', title: 'Clérigos', icon: UsersIcon },
        ]}
      />

      <div className="flex flex-row justify-between items-center w-full">
        <TypographyH1>Quem nos conduz na fé</TypographyH1>

        <div className="hidden items-center md:flex">
          <Link href="/clerigos/adicionar">
            <Button>
              <PlusIcon />
              Novo Clérigo
            </Button>
          </Link>
        </div>
      </div>

      <Describe>
        Gerencie os sacerdotes, diáconos e autoridades religiosas que conduzem nossa
        comunidade e diocese. As informações cadastradas aqui são exibidas na seção do clero
        no site público.
      </Describe>

      {/* Content Section */}
      <div className="py-6 space-y-8">
        {isPending ? (
          <div className="space-y-8">
            {/* Main Skeleton */}
            <div className="w-full bg-white border border-zinc-200/80 rounded-3xl p-6 flex flex-col md:flex-row gap-6 min-h-[320px]">
              <Skeleton className="w-full md:w-80 h-72 rounded-2xl" />
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-32 rounded-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
                <Skeleton className="h-10 w-40 rounded-full" />
              </div>
            </div>

            {/* Grid Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col items-center min-h-[260px]"
                >
                  <Skeleton className="size-32 rounded-full mb-4" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-40 mb-3" />
                  <Skeleton className="h-8 w-full mt-auto rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ) : clergy.length === 0 ? (
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center shadow-xs">
            <div className="size-16 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3
              className="text-2xl font-semibold text-zinc-900 mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Nenhum clérigo cadastrado
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              Cadastre o pároco, diáconos, bispo ou outras autoridades religiosas da paróquia.
            </p>
            <Button asChild size="sm" className="rounded-full px-6 shadow-md gap-1.5">
              <Link href="/clerigos/adicionar">
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Adicionar primeiro clérigo</span>
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* 1. Main Clergy Member (Pároco) */}
            {mainMember && (
              <div className="w-full bg-white border border-[#D6A64A]/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-stretch relative">
                {/* Photo Column */}
                <div className="w-full md:w-80 lg:w-96 shrink-0 relative bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] border-b md:border-b-0 md:border-r border-[#D6A64A]/20 min-h-[280px] flex items-center justify-center overflow-hidden">
                  <img
                    src={getFallbackPhoto(mainMember)}
                    alt={mainMember.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18351E] border border-[#D6A64A]/40 text-[#D6A64A] text-xs font-semibold tracking-wider uppercase shadow-md">
                    <Sparkles className="w-3 h-3 text-[#D6A64A]" />
                    <span>{mainMember.roleName || 'CLÉRIGO PRINCIPAL'}</span>
                  </div>
                </div>

                {/* Content Column */}
                <div className="p-6 md:p-8 lg:p-10 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-xs font-bold text-[#B8872E] uppercase tracking-widest block mb-1">
                          {mainMember.roleName || 'PÁROCO'}
                        </span>
                        <h2
                          className="text-2xl md:text-4xl font-semibold text-zinc-900 leading-tight"
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                          {mainMember.name}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                        >
                          <Link href={`/clerigos/editar/${mainMember.id}`}>
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {mainMember.shortIntro && (
                      <p className="text-xs sm:text-sm font-semibold text-[#B8872E] uppercase tracking-wider mb-4">
                        {mainMember.shortIntro}
                      </p>
                    )}

                    <p className="text-sm md:text-base text-zinc-600 font-serif leading-relaxed mb-6 line-clamp-4 md:line-clamp-5">
                      {mainMember.bio || 'Nenhuma biografia informada.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D6A64A]/20 flex items-center justify-between text-xs text-zinc-500 font-serif">
                    <span>Ordem de exibição: #{mainMember.orderIndex ?? 1}</span>
                    <span className="text-[#18351E] font-medium">Exibido em destaque no site</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Other Members Grid & Add Clergy Card */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-zinc-700" />
                  <h3
                    className="text-2xl md:text-3xl font-semibold text-zinc-900"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    Outros Ministros e Pastores
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {otherMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group bg-white border border-[#D6A64A]/30 sm:border-zinc-200/80 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs hover:shadow-md hover:border-[#B8872E] transition-all"
                  >
                    {/* Circular Portrait Photo */}
                    <div className="relative size-32 aspect-square mb-4 overflow-hidden rounded-full border-2 border-[#D6A64A]/50 shadow-xs bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] flex items-center justify-center">
                      <img
                        src={getFallbackPhoto(member)}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Role */}
                    <span className="text-[11px] font-semibold text-[#B8872E] uppercase tracking-wider mb-1">
                      {member.roleName || member.title || 'Ministro'}
                    </span>

                    {/* Name */}
                    <h4
                      className="text-lg font-semibold text-zinc-900 leading-snug mb-2 line-clamp-1"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {member.name}
                    </h4>

                    {/* Short Intro / Bio */}
                    <p className="text-xs text-zinc-600 font-serif leading-relaxed line-clamp-3 mb-4 px-2">
                      {member.shortIntro || member.bio || 'Sem descrição cadastrada.'}
                    </p>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-zinc-100 w-full justify-center">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-1.5 w-full"
                      >
                        <Link href={`/clerigos/editar/${member.id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Clergy Action Card */}
                <Link
                  href="/clerigos/adicionar"
                  className="border-2 border-dashed border-zinc-200 hover:border-brand-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer min-h-[260px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-zinc-200 flex items-center justify-center text-zinc-500 group-hover:text-brand-600 group-hover:border-brand-300 group-hover:scale-110 transition-all mb-3">
                    <Plus className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h4
                    className="text-base font-semibold text-zinc-700 group-hover:text-brand-700 transition-colors mb-1"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    Adicionar clérigo
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-[180px]">
                    Cadastre um novo sacerdote, diácono ou autoridade
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
