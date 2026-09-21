'use client';

import React, { useState, useRef } from 'react';
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
import { useEditPatron } from '@/components/features/churches/edit-patron/use-edit-patron';
import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import { User, Upload, X, Sparkles, BookOpen } from 'lucide-react';

export default function EditCommunityPatronPage() {
  const { formik, isPending, community } = useEditPatron();

  const [uploadingPatron, setUploadingPatron] = useState(false);
  const [patronProgress, setPatronProgress] = useState(0);
  const [patronError, setPatronError] = useState('');
  const patronInputRef = useRef<HTMLInputElement>(null);

  const handlePatronPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPatron(true);
    setPatronProgress(0);
    setPatronError('');
    try {
      const res = await uploadFileWithProgress(file, setPatronProgress);
      formik.setFieldValue('patronPhotoId', res.attachmentId);
      formik.setFieldValue('patronPhotoUrl', URL.createObjectURL(file));
    } catch (err: unknown) {
      setPatronError(typeof err === 'string' ? err : 'Erro no upload da foto do padroeiro');
    } finally {
      setUploadingPatron(false);
      if (patronInputRef.current) patronInputRef.current.value = '';
    }
  };

  const handleRemovePatronPhoto = () => {
    formik.setFieldValue('patronPhotoId', '');
    formik.setFieldValue('patronPhotoUrl', '');
  };

  return (
    <div className="w-full lg:col-start-2 min-h-screen flex flex-col bg-zinc-50/40">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="mx-auto w-full max-w-4xl px-4 lg:px-8 py-4">
          <BackButton href={`/${community?.slug}`} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <CoverImage url={community?.coverUrl} className="h-16 w-20 rounded-xl" />

            <div>
              <TypographyH1>Padroeiro(a) da Comunidade</TypographyH1>
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
          {/* Card: Nome do Padroeiro e Foto */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-[#B8872E]" />
              <h2 className="font-semibold text-zinc-900 text-base">
                Identificação do Padroeiro(a)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Left: Foto do Padroeiro */}
              <div className="sm:col-span-4 flex flex-col items-center sm:items-start gap-3">
                <span className="block text-xs font-semibold text-zinc-700">
                  Foto ou Imagem do Padroeiro(a)
                </span>

                <input
                  type="file"
                  ref={patronInputRef}
                  onChange={handlePatronPhotoUpload}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                <div className="relative group size-32 rounded-2xl overflow-hidden border border-zinc-200 bg-[#fef8ed] flex items-center justify-center shadow-xs">
                  {formik.values.patronPhotoUrl ? (
                    <>
                      <img
                        src={formik.values.patronPhotoUrl}
                        alt="Foto do Padroeiro"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePatronPhoto}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 transition cursor-pointer"
                        title="Remover foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <User className="w-12 h-12 text-[#B8872E]/60 stroke-1" />
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingPatron}
                  onClick={() => patronInputRef.current?.click()}
                  className="w-full max-w-32 gap-1.5 text-xs cursor-pointer"
                >
                  {uploadingPatron ? (
                    <>
                      <Spinner className="w-3.5 h-3.5 mr-1" />
                      <span>{patronProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formik.values.patronPhotoUrl ? 'Alterar foto' : 'Enviar foto'}</span>
                    </>
                  )}
                </Button>

                {patronError && (
                  <span className="text-xs text-red-600 text-center sm:text-left">
                    {patronError}
                  </span>
                )}
              </div>

              {/* Right: Nome do Padroeiro */}
              <div className="sm:col-span-8 space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
                    Nome do Padroeiro(a)
                  </label>
                  <InputRoot error={formik.errors.patronName} touched={formik.touched.patronName}>
                    <InputControl
                      name="patronName"
                      value={formik.values.patronName || ''}
                      onChange={formik.handleChange}
                      placeholder="Ex: São José, Santa Teresinha do Menino Jesus..."
                    />
                  </InputRoot>
                  <p className="text-[11px] text-zinc-500 mt-1.5">
                    Nome do santo ou santa protetor(a) que dá nome ou acolhe a comunidade.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Biografia e História do Padroeiro */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-[#B8872E]" />
              <h2 className="font-semibold text-zinc-900 text-base">
                História, Vida e Devoção do Padroeiro(a)
              </h2>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Conte a história de vida do padroeiro(a), virtudes, testemunho de fé e a importância da sua devoção para a comunidade.
            </p>

            <div>
              <Textarea
                name="patronDescription"
                value={formik.values.patronDescription || ''}
                onChange={formik.handleChange}
                placeholder="Descreva a vida, os milagres, o exemplo e a oração ou devoção ao padroeiro..."
                className="min-h-[260px] sm:min-h-[340px] text-sm font-serif leading-relaxed"
              />
            </div>
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
                'Salvar Padroeiro'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
