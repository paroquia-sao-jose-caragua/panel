'use client';

import React, { useState, useRef } from 'react';
import { FieldLabel } from '@/components/ui/field';
import { Root as InputRoot, Control as InputControl } from '@/components/common/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { apiBaseUrl } from '@/api/utils/api';
import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import type { UrgentAlertVariant } from '@/entities/urgent-alert';
import {
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
  Calendar,
  Eye,
  Trash2,
  Upload,
  Volume2,
  Layers,
  X,
} from 'lucide-react';

export interface UrgentAlertFormValues {
  active: boolean;
  text: string;
  variant: UrgentAlertVariant;
  startsAt: string;
  endsAt: string;
  hasModal: boolean;
  modalButtonText: string;
  modalTitle: string;
  modalDescription: string;
  modalImageId: string | null;
  modalActionText: string;
  modalActionUrl: string;
}

interface UrgentAlertFormStepProps {
  values: UrgentAlertFormValues;
  onChange: <K extends keyof UrgentAlertFormValues>(
    field: K,
    value: UrgentAlertFormValues[K]
  ) => void;
  errors?: Record<string, string>;
}

const variantBarStyles: Record<UrgentAlertVariant, string> = {
  alert:
    'bg-gradient-to-r from-[#701710] via-[#85261d] to-[#701710] text-[#fff8f2] border-b border-[#a8382c]/40',
  info:
    'bg-gradient-to-r from-[#0f2617] via-[#153422] to-[#0f2617] text-[#f4efe6] border-b border-emerald-700/30',
  solemnity:
    'bg-gradient-to-r from-[#523912] via-[#6e4e1a] to-[#523912] text-[#fff8ed] border-b border-amber-500/40',
};

export const UrgentAlertFormStep: React.FC<UrgentAlertFormStepProps> = ({
  values,
  onChange,
  errors = {},
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [confirmRemoveImage, setConfirmRemoveImage] = useState(false);
  const [confirmClearDates, setConfirmClearDates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (id: string | null) => {
    if (!id) return '';
    if (id.startsWith('blob:') || id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/')) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      const res = await uploadFileWithProgress(file, setUploadProgress);
      onChange('modalImageId', res.attachmentId);
    } catch (err: unknown) {
      setUploadError(typeof err === 'string' ? err : 'Falha no upload da imagem');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('modalImageId', null);
  };

  const handleClearDates = () => {
    onChange('startsAt', '');
    onChange('endsAt', '');
  };

  return (
    <div className="space-y-6">
      {/* 1. Ativação e Tipo */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              Publicação e Status
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Defina se a faixa estará visível no site imediatamente ou conforme agendamento.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                values.active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${values.active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
              {values.active ? 'Ativa' : 'Desativada'}
            </span>
            <Switch checked={values.active} onCheckedChange={(val) => onChange('active', val)} />
          </div>
        </div>

        {/* Categoria / Estilo */}
        <div>
          <FieldLabel className="mb-2 block">Estilo Visual & Categoria</FieldLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onChange('variant', 'alert')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                values.variant === 'alert'
                  ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-red-700 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Alerta Urgente
                </div>
                {values.variant === 'alert' && <CheckCircle2 className="w-4 h-4 text-red-600" />}
              </div>
              <p className="text-xs text-zinc-500">
                Avisos que demandam atenção imediata, como cancelamentos ou alterações de emergência.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChange('variant', 'info')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                values.variant === 'info'
                  ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                  <Info className="w-4 h-4 text-emerald-700" />
                  Comunicado Paroquial
                </div>
                {values.variant === 'info' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <p className="text-xs text-zinc-500">
                Informações gerais da secretaria, cursos, horários ou recados importantes da comunidade.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChange('variant', 'solemnity')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                values.variant === 'solemnity'
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Solenidade / Festa
                </div>
                {values.variant === 'solemnity' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </div>
              <p className="text-xs text-zinc-500">
                Festas de Padroeiros, Novenas, Semana Santa, Natal e celebrações especiais.
              </p>
            </button>
          </div>
        </div>

        {/* Agendamento Opcional */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <FieldLabel className="flex items-center gap-1.5 text-xs text-zinc-700">
              <Calendar className="w-4 h-4 text-zinc-400" />
              Período de Exibição Automático (Opcional)
            </FieldLabel>
            {(values.startsAt || values.endsAt) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmClearDates(true)}
                className="h-7.5 px-2.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-100/70 border-red-200 hover:border-red-300 gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
                <span>Limpar datas</span>
              </Button>
            )}
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            Caso não preencha, a faixa será exibida continuamente enquanto estiver com o status &quot;Ativa&quot;.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1">Início da exibição</label>
              <input
                type="datetime-local"
                value={values.startsAt}
                onChange={(e) => onChange('startsAt', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-zinc-700 focus:outline-brand-600"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1">Término da exibição</label>
              <input
                type="datetime-local"
                value={values.endsAt}
                onChange={(e) => onChange('endsAt', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-zinc-700 focus:outline-brand-600"
              />
            </div>
          </div>

          <DeleteConfirmationDialog
            open={confirmClearDates}
            onOpenChange={setConfirmClearDates}
            title="Limpar Período de Exibição"
            description="Tem certeza que deseja limpar as datas de início e término? A faixa passará a ser exibida continuamente enquanto estiver com o status 'Ativa'."
            confirmText="Limpar datas"
            onConfirm={() => {
              handleClearDates();
              setConfirmClearDates(false);
            }}
          />
        </div>
      </div>

      {/* 2. Texto da Faixa */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="text" className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-brand-600" />
            Texto do Letreiro *
          </FieldLabel>
          <span className={`text-xs ${values.text.length > 250 ? 'text-amber-600 font-semibold' : 'text-zinc-400'}`}>
            {values.text.length} / 255
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Mensagem que desliza no topo da página inicial do site. Seja conciso e claro.
        </p>
        <Textarea
          id="text"
          value={values.text}
          onChange={(e) => onChange('text', e.target.value)}
          maxLength={255}
          rows={3}
          placeholder="Ex: Neste sábado teremos procissão e Missa Solene às 18h na Igreja Matriz..."
          className="resize-none"
        />
        {errors.text && <p className="text-xs text-red-500 mt-1">{errors.text}</p>}

        {/* Prévia em tempo real */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Prévia em Tempo Real
          </span>
          <div
            className={`w-full overflow-hidden py-3 px-4 rounded-xl shadow-xs flex items-center justify-between gap-3 ${
              variantBarStyles[values.variant] || variantBarStyles.alert
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <span className="text-base sm:text-lg font-semibold tracking-wide truncate">
                {values.text || 'Digite a mensagem acima para visualizar a prévia...'}
              </span>
              <span className="opacity-60 text-sm sm:text-base shrink-0">☩</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Modal de Detalhes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-600" />
              Modal com Mais Informações (Opcional)
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Habilita um botão na faixa para que o visitante abra uma janela com o comunicado completo e imagem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-600">
              {values.hasModal ? 'Ativado' : 'Desativado'}
            </span>
            <Switch checked={values.hasModal} onCheckedChange={(val) => onChange('hasModal', val)} />
          </div>
        </div>

        {values.hasModal && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <FieldLabel htmlFor="modalButtonText">Texto do Botão na Faixa</FieldLabel>
              <InputRoot className="mt-1">
                <InputControl
                  id="modalButtonText"
                  value={values.modalButtonText}
                  onChange={(e) => onChange('modalButtonText', e.target.value)}
                  maxLength={50}
                  placeholder="Ex: Ver Detalhes, Saiba Mais"
                />
              </InputRoot>
              {errors.modalButtonText && (
                <p className="text-xs text-red-500 mt-1">{errors.modalButtonText}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel htmlFor="modalTitle">Título da Janela</FieldLabel>
                <span className={`text-xs ${values.modalTitle.length > 240 ? 'text-amber-600 font-semibold' : 'text-zinc-400'}`}>
                  {values.modalTitle.length} / 255
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-2">
                Suporta quebras de linha para destacar títulos e subtítulos no modal.
              </p>
              <Textarea
                id="modalTitle"
                value={values.modalTitle}
                onChange={(e) => onChange('modalTitle', e.target.value)}
                maxLength={255}
                rows={2}
                placeholder="Ex: Comunicado sobre a Festa de São José"
                className="min-h-18 resize-y"
              />
              {errors.modalTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.modalTitle}</p>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="modalDescription" className="mb-1 block">
                Texto Completo / Detalhes
              </FieldLabel>
              <p className="text-xs text-zinc-500 mb-2">
                Suporta quebras de linha e múltiplos parágrafos para detalhar comunicados e avisos.
              </p>
              <Textarea
                id="modalDescription"
                value={values.modalDescription}
                onChange={(e) => onChange('modalDescription', e.target.value)}
                rows={6}
                className="min-h-32 resize-y"
                placeholder="Insira aqui todas as informações detalhadas que os fiéis devem saber..."
              />
            </div>

            {/* Imagem / Cartaz */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel asChild className="mb-0">
                  <span className="cursor-default">
                    Cartaz / Flyer de Divulgação (Opcional)
                  </span>
                </FieldLabel>
              </div>
              <p className="text-xs text-zinc-500 mb-2">
                Adicione uma arte ou comunicado visual que será exibido aos fiéis na janela modal.
              </p>

              {values.modalImageId ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
                  <div className="relative shrink-0 group">
                    <ImageLightbox
                      src={getImageUrl(values.modalImageId)}
                      label="Cartaz do Comunicado"
                      size="lg"
                      className="h-28 w-28 object-cover rounded-xl border border-zinc-200 shadow-xs"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => setConfirmRemoveImage(true)}
                      className="absolute top-2 right-2 rounded-full shadow-md z-10 hover:scale-105 transition-transform cursor-pointer"
                      title="Remover cartaz"
                      aria-label="Remover cartaz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-zinc-800">Cartaz carregado</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Os fiéis poderão visualizar este cartaz ampliado no modal do comunicado.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="gap-1.5 text-xs font-medium cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Trocar imagem</span>
                      </Button>
                    </div>

                    {uploadingImage && (
                      <div className="flex items-center gap-2 pt-1 text-xs text-brand-600 font-medium">
                        <Spinner className="w-3.5 h-3.5" />
                        <span>Enviando nova imagem... {uploadProgress}%</span>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-xs text-red-500 pt-1">{uploadError}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-300 hover:border-brand-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors"
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Spinner className="w-6 h-6 text-brand-600" />
                        <span className="text-xs font-semibold text-zinc-600">
                          Enviando... {uploadProgress}%
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-zinc-800 block">
                            Clique para selecionar cartaz ou imagem
                          </span>
                          <span className="text-[11px] text-zinc-400 mt-0.5 block">
                            Formatos aceitos: PNG, JPG ou WebP
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-1 gap-1.5 text-xs pointer-events-none"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Selecionar arquivo</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                </div>
              )}

              {/* Input file invisível controlado via ref */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                disabled={uploadingImage}
                onChange={handleUpload}
                className="hidden"
              />

              <DeleteConfirmationDialog
                open={confirmRemoveImage}
                onOpenChange={setConfirmRemoveImage}
                title="Remover Cartaz do Comunicado"
                description="Tem certeza que deseja remover este cartaz? O comunicado deixará de exibir a imagem no modal."
                confirmText="Remover"
                onConfirm={() => {
                  handleRemoveImage();
                  setConfirmRemoveImage(false);
                }}
              />
            </div>

            {/* Ação Externa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="modalActionText">Rótulo do Link Externo (Opcional)</FieldLabel>
                <InputRoot>
                  <InputControl
                    id="modalActionText"
                    value={values.modalActionText}
                    onChange={(e) => onChange('modalActionText', e.target.value)}
                    maxLength={100}
                    placeholder="Ex: Fazer Inscrição, Mais Informações"
                  />
                </InputRoot>
              </div>

              <div>
                <FieldLabel htmlFor="modalActionUrl">Endereço Web / Link (Opcional)</FieldLabel>
                <InputRoot>
                  <InputControl
                    id="modalActionUrl"
                    value={values.modalActionUrl}
                    onChange={(e) => onChange('modalActionUrl', e.target.value)}
                    maxLength={500}
                    placeholder="https://..."
                  />
                </InputRoot>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
