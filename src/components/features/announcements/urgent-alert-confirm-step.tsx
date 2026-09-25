'use client';

import React, { useState } from 'react';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Button } from '@/components/ui/button';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { apiBaseUrl } from '@/api/utils/api';
import type { UrgentAlertFormValues } from './urgent-alert-form-step';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Check,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  ArrowRight,
  X,
} from 'lucide-react';

interface UrgentAlertConfirmStepProps {
  values: UrgentAlertFormValues;
}

export const UrgentAlertConfirmStep: React.FC<UrgentAlertConfirmStepProps> = ({ values }) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const getImageUrl = (id: string | null) => {
    if (!id) return '';
    if (id.startsWith('blob:') || id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/')) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const variantLabels = {
    alert: 'Alerta Urgente',
    info: 'Comunicado Paroquial',
    solemnity: 'Solenidade / Festa',
  };

  const variantStyles = {
    alert: {
      barBg:
        'bg-gradient-to-r from-[#701710] via-[#85261d] to-[#701710] text-[#fff8f2] border-b border-[#a8382c]/40',
      badgeBg: 'bg-[#5e1811] text-amber-200 border-amber-500/30',
      buttonBg: 'bg-amber-400 text-stone-900',
    },
    info: {
      barBg:
        'bg-gradient-to-r from-[#0f2617] via-[#153422] to-[#0f2617] text-[#f4efe6] border-b border-emerald-700/30',
      badgeBg: 'bg-[#0e2417] text-emerald-200 border-emerald-500/30',
      buttonBg: 'bg-[#cfa55b] text-[#153422]',
    },
    solemnity: {
      barBg:
        'bg-gradient-to-r from-[#523912] via-[#6e4e1a] to-[#523912] text-[#fff8ed] border-b border-amber-500/40',
      badgeBg: 'bg-[#4a3411] text-amber-200 border-amber-400/40',
      buttonBg: 'bg-[#f4d068] text-[#3a270a]',
    },
  };

  const currentVariant = variantStyles[values.variant] || variantStyles.alert;
  const imageUrl = getImageUrl(values.modalImageId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-brand-50 text-brand-700">
          <Check className="w-7 h-7" />
        </div>
        <div className="text-center">
          <TypographyH2 className="text-center">Confirmação da Faixa</TypographyH2>
          <p className="text-zinc-600 mt-1 text-sm">
            Revise as configurações abaixo antes de salvar.
          </p>
        </div>
      </div>

      {/* Live Preview Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Prévia no Site
          </span>
          {values.hasModal && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewModalOpen(true)}
              className="gap-1.5 text-xs h-7"
            >
              <Eye className="w-3.5 h-3.5" />
              Ver Modal Completo
            </Button>
          )}
        </div>

        <div
          className={`w-full overflow-hidden py-3 px-4 rounded-xl shadow-xs flex items-center justify-between gap-4 ${currentVariant.barBg}`}
        >
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className="text-base sm:text-lg font-semibold tracking-wide truncate">
              {values.text || 'Nenhum texto informado'}
            </span>
            <span className="opacity-60 text-sm sm:text-base shrink-0">☩</span>
          </div>
        </div>
      </div>

      {/* Tabela de resumo */}
      <div className="w-full divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
        <div className="grid grid-cols-3 gap-4 py-3 items-center">
          <span className="text-zinc-500 text-sm">Status</span>
          <span className="col-span-2 text-right">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                values.active
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {values.active ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Ativa
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" /> Desativada
                </>
              )}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-3 items-center">
          <span className="text-zinc-500 text-sm">Categoria</span>
          <span className="col-span-2 text-right font-medium text-sm text-zinc-900">
            {variantLabels[values.variant]}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-3 items-start">
          <span className="text-zinc-500 text-sm">Texto da Faixa</span>
          <span className="col-span-2 text-right text-sm text-zinc-900 font-medium whitespace-pre-line leading-relaxed">
            {values.text || '-'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-3 items-center">
          <span className="text-zinc-500 text-sm">Período</span>
          <span className="col-span-2 text-right text-xs text-zinc-700">
            {values.startsAt || values.endsAt ? (
              <>
                {values.startsAt ? new Date(values.startsAt).toLocaleString('pt-BR') : 'Imediato'}{' '}
                até{' '}
                {values.endsAt ? new Date(values.endsAt).toLocaleString('pt-BR') : 'Indeterminado'}
              </>
            ) : (
              'Contínuo (sem data de expiração)'
            )}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-3 items-center">
          <span className="text-zinc-500 text-sm">Modal de Detalhes</span>
          <span className="col-span-2 text-right text-sm font-medium">
            {values.hasModal ? (
              <span className="text-emerald-700">Habilitado</span>
            ) : (
              <span className="text-zinc-500">Desabilitado</span>
            )}
          </span>
        </div>

        {values.hasModal && (
          <>
            <div className="grid grid-cols-3 gap-4 py-3 items-start">
              <span className="text-zinc-500 text-sm">Título do Modal</span>
              <span className="col-span-2 text-right text-sm font-medium text-zinc-900 whitespace-pre-line leading-snug">
                {values.modalTitle || '-'}
              </span>
            </div>

            {values.modalDescription && (
              <div className="grid grid-cols-3 gap-4 py-3 items-start">
                <span className="text-zinc-500 text-sm">Descrição Completa</span>
                <span className="col-span-2 text-right text-xs text-zinc-700 whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
                  {values.modalDescription}
                </span>
              </div>
            )}

            {values.modalImageId && (
              <div className="grid grid-cols-3 gap-4 py-3 items-center">
                <span className="text-zinc-500 text-sm">Cartaz / Imagem</span>
                <div className="col-span-2 flex justify-end">
                  <ImageLightbox
                    src={imageUrl}
                    label="Cartaz do Comunicado"
                    size="md"
                    className="h-16 w-16 rounded-lg object-cover border border-zinc-200"
                  />
                </div>
              </div>
            )}

            {values.modalActionText && (
              <div className="grid grid-cols-3 gap-4 py-3 items-center">
                <span className="text-zinc-500 text-sm">Botão de Ação</span>
                <span className="col-span-2 text-right text-xs text-zinc-700 truncate">
                  {values.modalActionText} ({values.modalActionUrl || 'Sem URL'})
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Dialog de Teste */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-[#fbf6ee] p-6 sm:p-8 rounded-2xl border border-stone-200 text-stone-900">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl sm:text-2xl font-serif text-[#14201d] font-bold whitespace-pre-line leading-snug">
              {values.modalTitle || 'Comunicado Paroquial'}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Pré-visualização do comunicado para os fiéis
            </DialogDescription>
          </DialogHeader>

          {values.modalImageId && (
            <div className="mt-4 rounded-xl overflow-hidden border border-stone-300 shadow-sm">
              <img
                src={imageUrl}
                alt={values.modalTitle || 'Cartaz'}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          <div className="mt-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
            {values.modalDescription || values.text || 'Nenhum detalhe adicional configurado.'}
          </div>

          {values.modalActionText && (
            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14201d] text-[#e8dfd1] rounded-full text-xs font-semibold shadow-xs">
                {values.modalActionText}
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
