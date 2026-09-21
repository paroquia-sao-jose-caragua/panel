'use client';

import React from 'react';
import Link from 'next/link';
import { BackButton } from '@/components/common/back-button';
import { CoverImage } from '@/components/common/cover-image';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { FieldSection } from '@/components/ui/field-section';
import { useEditAbout } from '@/components/features/churches/edit-about/use-edit-about';
import { FileText, Sparkles, History, AlignLeft } from 'lucide-react';

export default function EditCommunityAboutPage() {
  const { formik, isPending, community } = useEditAbout();

  return (
    <div className="w-full lg:col-start-2 min-h-screen flex flex-col bg-zinc-50/40">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="mx-auto w-full max-w-4xl px-4 lg:px-8 py-4">
          <BackButton href={`/${community?.slug}`} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <CoverImage url={community?.coverUrl} className="h-16 w-20 rounded-xl" />

            <div>
              <TypographyH1>Textos da Comunidade</TypographyH1>
              <span className="text-sm font-medium text-zinc-500">
                {community?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="w-full max-w-4xl px-4 py-8 mx-auto lg:px-8 flex-1">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
          {/* Subtítulo Hero */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#B8872E]" />
              <h2 className="font-semibold text-zinc-900 text-base">
                Subtítulo de Destaque (Cabeçalho)
              </h2>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Frase de acolhida ou lema exibido logo abaixo do nome da comunidade no site público.
            </p>
            <Textarea
              name="heroSubtitle"
              value={formik.values.heroSubtitle || ''}
              onChange={formik.handleChange}
              placeholder="Ex: Uma comunidade viva de fé, esperança e fraternidade a serviço do Evangelho..."
              className="min-h-20 text-sm"
            />
          </div>

          {/* Seção Sobre e História Principal */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-[#B8872E]" />
              <h2 className="font-semibold text-zinc-900 text-base">
                História e Sobre a Comunidade
              </h2>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Apresente a história completa, missão, pastorais e vida comunitária. O texto é exibido com tipografia editorial no site.
            </p>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
                Título da Seção
              </label>
              <InputRoot>
                <InputControl
                  name="aboutTitle"
                  value={formik.values.aboutTitle || ''}
                  onChange={formik.handleChange}
                  placeholder="Ex: Sobre a Comunidade, Conheça Nossa História..."
                />
              </InputRoot>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
                Descrição Completa da História
              </label>
              <Textarea
                name="aboutDescription"
                value={formik.values.aboutDescription || ''}
                onChange={formik.handleChange}
                placeholder="Escreva a história da comunidade, como tudo começou, os momentos marcantes, as atividades comunitárias..."
                className="min-h-[280px] sm:min-h-[360px] text-sm font-serif leading-relaxed"
              />
            </div>
          </div>

          {/* Resumo Histórico / Destaques */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-[#B8872E]" />
              <h2 className="font-semibold text-zinc-900 text-base">
                Resumo Histórico e Marcos
              </h2>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Marcos cronológicos, data de fundação ou resumo dos momentos mais relevantes da comunidade.
            </p>
            <Textarea
              name="historySummary"
              value={formik.values.historySummary || ''}
              onChange={formik.handleChange}
              placeholder="Ex: Fundação em 1985, construção da capela em 1992, celebração do jubileu de prata..."
              className="min-h-[140px] text-sm"
            />
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-4 pb-12 border-t border-zinc-200">
            <Link href={`/${community?.slug}`}>
              <Button type="button" variant="outline" size="lg">
                Cancelar
              </Button>
            </Link>

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="min-w-36 bg-[#18351E] hover:bg-[#23472b] text-white"
            >
              {isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  <span>Salvando...</span>
                </>
              ) : (
                'Salvar Textos'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
