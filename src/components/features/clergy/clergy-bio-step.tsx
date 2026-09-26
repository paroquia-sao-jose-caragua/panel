'use client';

import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import type { ClergyFormValues } from './types';

interface ClergyBioStepProps {
  values: ClergyFormValues;
  onChange: <K extends keyof ClergyFormValues>(field: K, value: ClergyFormValues[K]) => void;
  errors: Record<string, string>;
}

export const ClergyBioStep = ({ values, onChange }: ClergyBioStepProps) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#5A463B] font-serif leading-relaxed">
          <p className="font-semibold text-[#18351E] mb-0.5">
            Biografia e Trajetória Pastoral de {values.name || 'Clérigo'}
          </p>
          <p>
            Este texto é exibido no modal biográfico interativo quando os fiéis clicarem para conhecer a história completa do clérigo no site público.
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4.5 h-4.5 text-[#B8872E]" />
          <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
            História de Vida e Ministério Sacerdotal / Pastoral
          </h3>
        </div>

        <p className="text-xs text-zinc-500 font-serif">
          Inclua detalhes como local de nascimento, data de nascimento, filiação, paróquia de origem, estudos, ordenação diaconal e presbiteral/episcopal e trabalhos pastorais realizados.
        </p>

        <textarea
          rows={12}
          value={values.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="Exemplo: Pe. Altair dos Santos nasceu em Florestópolis (PR), em 26 de janeiro de 1967. Foi ordenado presbítero em 29 de janeiro de 1994 em Curitiba (PR). Atualmente exerce seu ministério como pároco na Paróquia São José..."
          className="w-full p-4 rounded-xl border border-zinc-300 bg-zinc-50/50 text-sm sm:text-base text-zinc-800 font-serif leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#B8872E] focus:bg-white transition-colors"
        />

        <div className="flex items-center justify-between text-xs text-zinc-400 font-serif">
          <span>{values.bio ? `${values.bio.length} caracteres` : 'Nenhum texto inserido'}</span>
          <span>Dica: Use parágrafos claros para facilitar a leitura.</span>
        </div>
      </div>
    </div>
  );
};
