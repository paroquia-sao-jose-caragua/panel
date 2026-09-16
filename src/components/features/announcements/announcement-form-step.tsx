'use client';

import React, { useState } from 'react';
import { FieldLabel } from '@/components/ui/field';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Sparkles,
  Megaphone,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import { Spinner } from '@/components/ui/spinner';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { apiBaseUrl } from '@/api/utils/api';

export interface AnnouncementFormValues {
  title: string;
  badgeText: string;
  description: string;
  actionText: string;
  actionUrl: string;
  coverDesktopId: string;
  coverTabletId: string;
  coverMobileId: string;
  active: boolean;
}

interface AnnouncementFormStepProps {
  values: AnnouncementFormValues;
  onChange: (field: keyof AnnouncementFormValues, value: any) => void;
  errors?: Record<string, string>;
}

export const AnnouncementFormStep = ({
  values,
  onChange,
  errors,
}: AnnouncementFormStepProps) => {
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [progressDesktop, setProgressDesktop] = useState(0);

  const [uploadingTablet, setUploadingTablet] = useState(false);
  const [progressTablet, setProgressTablet] = useState(0);

  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [progressMobile, setProgressMobile] = useState(0);

  const [uploadError, setUploadError] = useState('');

  const getImageUrl = (id: string) => {
    if (!id) return '';
    if (id.startsWith('blob:') || id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/')) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const handleUploadDesktop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDesktop(true);
    setProgressDesktop(0);
    setUploadError('');
    try {
      const res = await uploadFileWithProgress(file, setProgressDesktop);
      onChange('coverDesktopId', res.attachmentId);
    } catch (err: any) {
      setUploadError(typeof err === 'string' ? err : 'Erro no upload desktop');
    } finally {
      setUploadingDesktop(false);
    }
  };

  const handleUploadTablet = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTablet(true);
    setProgressTablet(0);
    setUploadError('');
    try {
      const res = await uploadFileWithProgress(file, setProgressTablet);
      onChange('coverTabletId', res.attachmentId);
    } catch (err: any) {
      setUploadError(typeof err === 'string' ? err : 'Erro no upload tablet');
    } finally {
      setUploadingTablet(false);
    }
  };

  const handleUploadMobile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMobile(true);
    setProgressMobile(0);
    setUploadError('');
    try {
      const res = await uploadFileWithProgress(file, setProgressMobile);
      onChange('coverMobileId', res.attachmentId);
    } catch (err: any) {
      setUploadError(typeof err === 'string' ? err : 'Erro no upload mobile');
    } finally {
      setUploadingMobile(false);
    }
  };

  const desktopUrl = getImageUrl(values.coverDesktopId);
  const tabletUrl = getImageUrl(values.coverTabletId);
  const mobileUrl = getImageUrl(values.coverMobileId);

  return (
    <div className="flex w-full flex-col gap-6">
      {uploadError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Card 1: Identificação do Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        <div>
          <FieldLabel htmlFor="title" className="flex items-center gap-2 font-semibold text-zinc-900">
            <Sparkles className="text-brand-600 w-5 h-5" />
            Identificação do Banner
          </FieldLabel>
          <span className="block text-zinc-600 text-sm mt-1">
            Informe o título principal e o rótulo de destaque que aparecerão sobre a imagem.
          </span>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <span className="block mb-2 text-sm text-zinc-700 font-semibold">
              Título do Banner *
            </span>
            <InputRoot error={errors?.title} touched={Boolean(errors?.title)}>
              <InputControl
                name="title"
                value={values.title}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Ex: Festa de São José 2026"
              />
            </InputRoot>
          </div>

          <div>
            <span className="block mb-2 text-sm text-zinc-700 font-semibold">
              Rótulo em Destaque (Badge)
            </span>
            <InputRoot>
              <InputControl
                name="badgeText"
                value={values.badgeText}
                onChange={(e) => onChange('badgeText', e.target.value)}
                placeholder="Ex: AVISO IMPORTANTE"
              />
            </InputRoot>
          </div>
        </div>
      </div>

      {/* Card 2: Conteúdo & Chamada para Ação */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        <div>
          <FieldLabel htmlFor="description" className="flex items-center gap-2 font-semibold text-zinc-900">
            <Megaphone className="text-brand-600 w-5 h-5" />
            Conteúdo e Chamada para Ação (CTA)
          </FieldLabel>
          <span className="block text-zinc-600 text-sm mt-1">
            Escreva o texto explicativo do aviso e o botão de destino para os visitantes.
          </span>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <span className="block mb-2 text-sm text-zinc-700 font-semibold">
              Descrição do Aviso *
            </span>
            <Textarea
              name="description"
              value={values.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Participe conosco das celebrações em honra ao nosso padroeiro durante todo o mês de março..."
              rows={3}
              className="w-full border-input focus:border-brand-300 focus:ring-brand-100 rounded-lg p-3"
            />
            {errors?.description && (
              <p className="mt-1 text-xs text-red-700">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block mb-2 text-sm text-zinc-700 font-semibold">
                Texto do Botão
              </span>
              <InputRoot>
                <InputControl
                  name="actionText"
                  value={values.actionText}
                  onChange={(e) => onChange('actionText', e.target.value)}
                  placeholder="Ex: Ver programação completa"
                />
              </InputRoot>
            </div>

            <div>
              <span className="block mb-2 text-sm text-zinc-700 font-semibold">
                Link do Botão (URL)
              </span>
              <InputRoot>
                <InputControl
                  name="actionUrl"
                  value={values.actionUrl}
                  onChange={(e) => onChange('actionUrl', e.target.value)}
                  placeholder="Ex: /agenda ou https://..."
                />
              </InputRoot>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Imagens Responsivas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        <div>
          <FieldLabel className="flex items-center gap-2 font-semibold text-zinc-900">
            <Monitor className="text-brand-600 w-5 h-5" />
            Imagens Responsivas (Múltiplos Formatos)
          </FieldLabel>
          <span className="block text-zinc-600 text-sm mt-1">
            Envie imagens otimizadas para cada tipo de tela. A capa Desktop deve ter as dimensões recomendadas de <strong>1440x632</strong>.
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {/* Desktop Slot */}
          <div className={`p-4 rounded-xl border transition-colors ${values.coverDesktopId ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-zinc-50/50'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-brand-600" /> Versão Desktop (1440x632) *
              </span>
              {values.coverDesktopId ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enviada
                </span>
              ) : (
                <span className="text-xs text-amber-700 bg-amber-50 font-medium px-2 py-0.5 rounded border border-amber-200">
                  Obrigatória
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {desktopUrl && (
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <ImageLightbox
                    src={desktopUrl}
                    label="Capa Desktop"
                    size="md"
                    className="h-24 w-36 rounded-xl border border-zinc-200 shadow-sm"
                  />
                  <span className="text-[10px] text-zinc-500 font-medium">Clique para expandir</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadDesktop}
                  className="text-xs file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-700 file:text-white hover:file:bg-brand-800 cursor-pointer"
                />
                {uploadingDesktop && (
                  <div className="text-xs text-brand-600 flex items-center gap-2">
                    <Spinner className="w-3.5 h-3.5" /> Upload em andamento: {progressDesktop}%
                  </div>
                )}
                {errors?.coverDesktopId && (
                  <p className="text-xs text-red-700">{errors.coverDesktopId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tablet Slot */}
          <div className={`p-4 rounded-xl border transition-colors ${values.coverTabletId ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-zinc-50/50'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                <Tablet className="w-4 h-4 text-zinc-500" /> Versão Tablet (Opcional)
              </span>
              {values.coverTabletId && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enviada
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange('coverTabletId', '')}
                    className="text-zinc-400 hover:text-red-600 p-1"
                    title="Remover versão tablet"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {tabletUrl && (
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <ImageLightbox
                    src={tabletUrl}
                    label="Capa Tablet"
                    size="md"
                    className="h-24 w-36 rounded-xl border border-zinc-200 shadow-sm"
                  />
                  <span className="text-[10px] text-zinc-500 font-medium">Clique para expandir</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadTablet}
                  className="text-xs file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-800 cursor-pointer"
                />
                {uploadingTablet && (
                  <div className="text-xs text-zinc-600 flex items-center gap-2">
                    <Spinner className="w-3.5 h-3.5" /> Upload em andamento: {progressTablet}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Slot */}
          <div className={`p-4 rounded-xl border transition-colors ${values.coverMobileId ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-zinc-50/50'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-zinc-500" /> Versão Mobile (Opcional)
              </span>
              {values.coverMobileId && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enviada
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange('coverMobileId', '')}
                    className="text-zinc-400 hover:text-red-600 p-1"
                    title="Remover versão mobile"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {mobileUrl && (
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <ImageLightbox
                    src={mobileUrl}
                    label="Capa Mobile"
                    size="md"
                    className="h-24 w-24 rounded-xl border border-zinc-200 shadow-sm"
                  />
                  <span className="text-[10px] text-zinc-500 font-medium">Clique para expandir</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadMobile}
                  className="text-xs file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-800 cursor-pointer"
                />
                {uploadingMobile && (
                  <div className="text-xs text-zinc-600 flex items-center gap-2">
                    <Spinner className="w-3.5 h-3.5" /> Upload em andamento: {progressMobile}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Visibilidade */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-row items-center justify-between gap-4">
        <div>
          <FieldLabel htmlFor="active" className="font-semibold text-zinc-900">
            Exibir no Site Público
          </FieldLabel>
          <span className="block text-zinc-600 text-sm mt-1">
            Se desativado, o banner não será visível no carrossel da home page.
          </span>
        </div>

        <Switch
          id="active"
          checked={values.active}
          onCheckedChange={(checked) => onChange('active', checked)}
        />
      </div>
    </div>
  );
};
