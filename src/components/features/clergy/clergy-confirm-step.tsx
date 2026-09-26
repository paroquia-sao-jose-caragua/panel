'use client';

/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { User, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import type { ClergyFormValues } from './types';

interface ClergyConfirmStepProps extends ClergyFormValues {
  mode: 'add' | 'edit';
}

const getFallbackPhoto = (position: string) => {
  if (position === 'parish_priest') return '/clergies/paroco.png';
  if (position === 'permanent_deacon') return '/clergies/diacono.png';
  if (position === 'diocesan_bishop') return '/clergies/bispo.png';
  if (position === 'supreme_pontiff') return '/clergies/papa.png';
  return '/clergies/paroco.png';
};

export const ClergyConfirmStep = ({
  mode,
  name,
  title,
  position,
  roleName,
  shortIntro,
  bio,
  orderIndex,
  isMain,
  photoUrl,
}: ClergyConfirmStepProps) => {
  const imageSrc = photoUrl || getFallbackPhoto(position);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/30 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#5A463B] font-serif leading-relaxed">
          <p className="font-semibold text-[#18351E] mb-0.5">
            {mode === 'add' ? 'Revise os dados antes de cadastrar' : 'Revise as alterações antes de salvar'}
          </p>
          <p>
            Confira abaixo a prévia de como o perfil do clérigo será apresentado no site da paróquia.
          </p>
        </div>
      </div>

      {/* Preview Card */}
      <div className="w-full bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch">
        {/* Photo Column */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 relative bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] border-b md:border-b-0 md:border-r border-[#D6A64A]/20 min-h-[260px] flex items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18351E] border border-[#D6A64A]/40 text-[#D6A64A] text-xs font-semibold tracking-wider uppercase shadow-md">
            <Sparkles className="w-3 h-3 text-[#D6A64A]" />
            <span>{roleName || title || 'CLÉRIGO'}</span>
          </div>
        </div>

        {/* Content Column */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#B8872E] uppercase tracking-widest block mb-1">
              {roleName || 'MINISTRO DA IGREJA'}
            </span>

            <h3
              className="text-2xl sm:text-3xl font-semibold text-[#18351E] leading-tight mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {name || 'Nome do Clérigo'}
            </h3>

            {shortIntro && (
              <p className="text-xs sm:text-sm font-semibold text-[#B8872E] uppercase tracking-wider mb-4">
                {shortIntro}
              </p>
            )}

            <div className="mb-4">
              <span className="text-xs font-semibold text-zinc-700 block mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#B8872E]" />
                Biografia / História:
              </span>
              <p className="text-xs sm:text-sm text-[#5A463B] font-serif leading-relaxed line-clamp-4">
                {bio || 'Nenhuma biografia informada.'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#D6A64A]/20 grid grid-cols-2 gap-2 text-xs text-zinc-600 font-serif">
            <div>
              <span className="font-semibold text-[#18351E]">Destaque:</span>{' '}
              {isMain ? 'Sim (Pároco Principal)' : 'Não'}
            </div>
            <div>
              <span className="font-semibold text-[#18351E]">Ordem:</span> #{orderIndex}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
