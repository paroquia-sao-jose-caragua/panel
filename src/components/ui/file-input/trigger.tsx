'use client';

import { UploadCloud } from 'lucide-react';
import { useFileInput } from './root';

export const Trigger = ({ actionLabel }: { actionLabel?: string }) => {
  const { id } = useFileInput();

  return (
    <label
      htmlFor={id}
      className="group bg-white flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-lg px-6 py-4 text-center text-zinc-500 shadow-sm border border-input hover:bg-brand-0/80 hover:text-brand-500 hover:border-brand-300"
    >
      <div className="rounded-full border-6 border-zinc-50 bg-zinc-100 p-2 group-hover:border-brand-50 group-hover:bg-brand-100">
        <UploadCloud className="h-5 w-5 text-zinc-600 group-hover:text-brand-700" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-sm">
          <span className="font-semibold text-brand-700">
            {actionLabel || 'Clique para enviar'}
          </span>{' '}
          a imagem
        </span>
        <span className="text-xs">PNG, JPG or JPEG (max. 900x600px)</span>
      </div>
    </label>
  );
};
