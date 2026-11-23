'use client';

import React, { useState } from 'react';
import { FieldLabel } from '@/components/ui/field';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import { apiBaseUrl } from '@/api/utils/api';
import type { NoticeVariant } from '@/entities/notice';
import {
  AlertTriangle,
  Info,
  Sparkles,
  ImagePlus,
  Trash2,
  Pin,
  Calendar,
} from 'lucide-react';

export interface NoticeFormValues {
  title: string;
  summary: string;
  description: string;
  variant: NoticeVariant;
  imageId: string;
  actionText: string;
  actionUrl: string;
  pinned: boolean;
  active: boolean;
  startsAt: string;
  endsAt: string;
}

interface NoticeFormProps {
  values: NoticeFormValues;
  onChange: (
    field: keyof NoticeFormValues,
    value: NoticeFormValues[keyof NoticeFormValues]
  ) => void;
  errors?: Record<string, string>;
}

export function toLocalDateTimeInput(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function toIsoOrNull(localDateTime: string): string | null {
  if (!localDateTime) return null;
  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function NoticeForm({ values, onChange, errors }: NoticeFormProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const getImageUrl = (id: string) => {
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setUploadError('');
    try {
      const res = await uploadFileWithProgress(file, setProgress);
      onChange('imageId', res.attachmentId);
    } catch (err: unknown) {
      setUploadError(typeof err === 'string' ? err : 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const variants: {
    value: NoticeVariant;
    label: string;
    description: string;
    icon: typeof Info;
    activeClass: string;
  }[] = [
    {
      value: 'info',
      label: 'Comunicado',
      description: 'Avisos gerais da paróquia',
      icon: Info,
      activeClass: 'border-emerald-600 bg-emerald-50/70 text-emerald-950',
    },
    {
      value: 'alert',
      label: 'Urgente',
      description: 'Mudanças de horário ou alertas',
      icon: AlertTriangle,
      activeClass: 'border-red-600 bg-red-50/70 text-red-950',
    },
    {
      value: 'solemnity',
      label: 'Solenidade / Festa',
      description: 'Festividades e celebrações especiais',
      icon: Sparkles,
      activeClass: 'border-amber-600 bg-amber-50/70 text-amber-950',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Categoria / Variante */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs space-y-3">
        <FieldLabel>Categoria do Aviso</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {variants.map((item) => {
            const Icon = item.icon;
            const selected = values.variant === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange('variant', item.value)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selected
                    ? item.activeClass
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </div>
                <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="notice-title">
            Título do Aviso <span className="text-red-500">*</span>
          </FieldLabel>
          <InputRoot>
            <InputControl
              id="notice-title"
              placeholder="Ex: Inscrições abertas para a Catequese 2027"
              value={values.title}
              onChange={(e) => onChange('title', e.target.value)}
              maxLength={255}
            />
          </InputRoot>
          {errors?.title && (
            <p className="text-xs text-red-600 font-medium">{errors.title}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="notice-summary">
            Resumo curto (opcional)
          </FieldLabel>
          <InputRoot>
            <InputControl
              id="notice-summary"
              placeholder="Texto breve exibido nos cards e no sininho do site"
              value={values.summary}
              onChange={(e) => onChange('summary', e.target.value)}
              maxLength={500}
            />
          </InputRoot>
          <p className="text-xs text-zinc-500">
            Se não informado, o site exibirá um trecho da descrição completa.
          </p>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="notice-description">
            Descrição completa <span className="text-red-500">*</span>
          </FieldLabel>
          <Textarea
            id="notice-description"
            rows={6}
            placeholder="Escreva todos os detalhes, horários, locais e orientações para os fiéis..."
            value={values.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
          {errors?.description && (
            <p className="text-xs text-red-600 font-medium">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Imagem / Cartaz opcional */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs space-y-3">
        <FieldLabel>Imagem / Cartaz (opcional)</FieldLabel>
        {values.imageId ? (
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-40 aspect-video rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 shrink-0">
              <ImageLightbox
                src={getImageUrl(values.imageId)}
                alt={values.title || 'Imagem do aviso'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-zinc-600">
                Imagem anexada ao aviso.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onChange('imageId', '')}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Remover imagem
              </Button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-xl p-6 cursor-pointer hover:border-brand-500 hover:bg-brand-50/20 transition-colors">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                <Spinner className="w-5 h-5" />
                <span>Enviando imagem... {progress}%</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <ImagePlus className="w-6 h-6 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700">
                  Clique para enviar um cartaz ou imagem
                </span>
                <span className="text-xs text-zinc-500">
                  PNG, JPG ou WEBP
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
        {uploadError && (
          <p className="text-xs text-red-600 font-medium">{uploadError}</p>
        )}
      </div>

      {/* Botão de Ação (opcional) */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs space-y-4">
        <FieldLabel>Botão / Link de Ação (opcional)</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="notice-action-text">Texto do botão</FieldLabel>
            <InputRoot>
              <InputControl
                id="notice-action-text"
                placeholder="Ex: Fazer inscrição"
                value={values.actionText}
                onChange={(e) => onChange('actionText', e.target.value)}
                maxLength={100}
              />
            </InputRoot>
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="notice-action-url">Link de destino</FieldLabel>
            <InputRoot>
              <InputControl
                id="notice-action-url"
                placeholder="https://... ou /agenda"
                value={values.actionUrl}
                onChange={(e) => onChange('actionUrl', e.target.value)}
                maxLength={500}
              />
            </InputRoot>
          </div>
        </div>
      </div>

      {/* Vigência e Configurações */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
          <Calendar className="w-4 h-4 text-zinc-500" />
          Período de exibição e destaque
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="notice-starts-at">
              Início da exibição (opcional)
            </FieldLabel>
            <InputRoot>
              <InputControl
                id="notice-starts-at"
                type="datetime-local"
                value={values.startsAt}
                onChange={(e) => onChange('startsAt', e.target.value)}
              />
            </InputRoot>
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="notice-ends-at">
              Fim / Expiração (opcional)
            </FieldLabel>
            <InputRoot>
              <InputControl
                id="notice-ends-at"
                type="datetime-local"
                value={values.endsAt}
                onChange={(e) => onChange('endsAt', e.target.value)}
              />
            </InputRoot>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-zinc-100">
          <label className="flex items-center justify-between gap-3 flex-1 p-3 rounded-lg border border-zinc-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Pin className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium text-zinc-900">
                  Fixar no topo
                </div>
                <div className="text-xs text-zinc-500">
                  Aparece primeiro no mural e no sininho
                </div>
              </div>
            </div>
            <Switch
              checked={values.pinned}
              onCheckedChange={(checked) => onChange('pinned', checked)}
            />
          </label>

          <label className="flex items-center justify-between gap-3 flex-1 p-3 rounded-lg border border-zinc-200 cursor-pointer">
            <div>
              <div className="text-sm font-medium text-zinc-900">
                Aviso ativo
              </div>
              <div className="text-xs text-zinc-500">
                Exibir no site (respeitando as datas)
              </div>
            </div>
            <Switch
              checked={values.active}
              onCheckedChange={(checked) => onChange('active', checked)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
