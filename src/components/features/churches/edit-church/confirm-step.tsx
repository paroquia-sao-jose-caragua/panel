import { TypographyH2 } from '@/components/ui/typography/h2';
import { Check, MapPinIcon } from 'lucide-react';
import { ImagePreview } from '@/components/ui/file-input';

interface EditConfirmStepProps {
  name: string;
  type: 'chapel' | 'parish_church' | string;
  address: string;
}

export const ConfirmStep = ({ name, type, address }: EditConfirmStepProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 sm:py-8 flex flex-col gap-4 pb-5">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-0 text-brand-700">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <TypographyH2 className="text-center">Confirmação</TypographyH2>
          <p className="text-center text-zinc-600 mt-3">
            Revise as alterações antes de salvar
          </p>
        </div>
        <div className="w-full max-w-100 divide-y divide-divider">
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Comunidade</span>
            <span className="text-right font-medium">{name}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Tipo</span>
            <span className="text-right font-medium">
              {type === 'parish_church' ? 'Igreja Matriz' : 'Capela'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Foto</span>
            <div className="flex flex-row justify-end">
              <ImagePreview />
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-6 py-3">
            <span className="text-zinc-600">Endereço</span>
            <div className="flex flex-row gap-2">
              <MapPinIcon className="text-zinc-400" />
              <span className="font-medium">{address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
