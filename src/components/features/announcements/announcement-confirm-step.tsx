'use client';

import { TypographyH2 } from '@/components/ui/typography/h2';
import { Check, Monitor, Tablet, Smartphone, Sparkles, Megaphone, Link as LinkIcon, Eye } from 'lucide-react';
import type { AnnouncementFormValues } from './announcement-form-step';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { apiBaseUrl } from '@/api/utils/api';

interface AnnouncementConfirmStepProps extends AnnouncementFormValues {
  mode?: 'add' | 'edit';
}

export const AnnouncementConfirmStep = ({
  mode = 'add',
  title,
  badgeText,
  description,
  actionText,
  actionUrl,
  coverDesktopId,
  coverTabletId,
  coverMobileId,
  active,
}: AnnouncementConfirmStepProps) => {
  const getImageUrl = (id: string) => {
    if (!id) return '';
    if (id.startsWith('blob:') || id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/')) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const desktopUrl = getImageUrl(coverDesktopId);
  const tabletUrl = getImageUrl(coverTabletId);
  const mobileUrl = getImageUrl(coverMobileId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 sm:py-8 flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-700">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <TypographyH2 className="text-center">Confirmação</TypographyH2>
          <p className="text-center text-zinc-600 mt-2 text-sm">
            Revise as informações e clique nas mídias enviadas para visualizar em tela cheia antes de salvar.
          </p>
        </div>

        <div className="w-full max-w-xl divide-y divide-divider mt-2">
          {badgeText && (
            <div className="grid grid-cols-3 gap-4 py-3 items-center">
              <span className="text-zinc-600 text-sm">Badge / Rótulo</span>
              <span className="col-span-2 text-right font-medium text-sm text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full w-fit ml-auto border border-amber-200">
                {badgeText}
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 py-3 items-center">
            <span className="text-zinc-600 text-sm">Título</span>
            <span className="col-span-2 text-right font-semibold text-zinc-900 text-sm">
              {title}
            </span>
          </div>

          <div className="flex flex-col gap-1 py-3">
            <span className="text-zinc-600 text-sm">Descrição</span>
            <p className="text-zinc-800 text-sm bg-zinc-50 p-3 rounded-xl border border-zinc-100 mt-1 leading-relaxed">
              {description}
            </p>
          </div>

          {(actionText || actionUrl) && (
            <div className="grid grid-cols-3 gap-4 py-3 items-center">
              <span className="text-zinc-600 text-sm">Botão / CTA</span>
              <span className="col-span-2 text-right font-medium text-sm text-brand-700">
                {actionText || 'Ver mais'} ({actionUrl || '#'})
              </span>
            </div>
          )}

          {/* Responsive Image Previews with Lightbox Fullscreen */}
          <div className="py-4 space-y-3">
            <span className="text-zinc-700 font-semibold text-sm block mb-2">
              Visualização das Imagens (Clique para Fullscreen)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Desktop Preview */}
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-brand-600" /> Desktop
                </span>
                {desktopUrl ? (
                  <ImageLightbox
                    src={desktopUrl}
                    label="Capa Desktop (1440x632)"
                    size="sm"
                    className="w-full h-20"
                  />
                ) : (
                  <span className="text-xs text-zinc-400 italic py-4">Não enviada</span>
                )}
              </div>

              {/* Tablet Preview */}
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                  <Tablet className="w-3.5 h-3.5 text-zinc-500" /> Tablet
                </span>
                {tabletUrl ? (
                  <ImageLightbox
                    src={tabletUrl}
                    label="Capa Tablet (1024x600)"
                    size="sm"
                    className="w-full h-20"
                  />
                ) : (
                  <span className="text-xs text-zinc-400 italic py-4">Usa versão Desktop</span>
                )}
              </div>

              {/* Mobile Preview */}
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-500" /> Mobile
                </span>
                {mobileUrl ? (
                  <ImageLightbox
                    src={mobileUrl}
                    label="Capa Mobile (800x800)"
                    size="sm"
                    className="w-full h-20"
                  />
                ) : (
                  <span className="text-xs text-zinc-400 italic py-4">Usa versão Desktop</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-3 items-center">
            <span className="text-zinc-600 text-sm">Status no Site</span>
            <span className={`col-span-2 text-right font-bold text-sm ${active ? 'text-emerald-600' : 'text-zinc-400'}`}>
              {active ? 'Ativo (Exibido no Carrossel)' : 'Inativo (Oculto)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
