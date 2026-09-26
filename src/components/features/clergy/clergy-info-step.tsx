'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { Upload, User, Sparkles, Trash2 } from 'lucide-react';
import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import type { ClergyPosition } from '@/entities/Clergy';
import type { ClergyFormValues } from './types';

interface ClergyInfoStepProps {
  values: ClergyFormValues;
  onChange: <K extends keyof ClergyFormValues>(field: K, value: ClergyFormValues[K]) => void;
  errors: Record<string, string>;
}

const POSITIONS: { value: ClergyPosition; label: string; defaultRole: string; defaultTitle: string }[] = [
  { value: 'parish_priest', label: 'Pároco', defaultRole: 'Pároco', defaultTitle: 'Padre' },
  { value: 'permanent_deacon', label: 'Diácono Permanente', defaultRole: 'Diácono Permanente', defaultTitle: 'Diácono' },
  { value: 'diocesan_bishop', label: 'Bispo Diocesano', defaultRole: 'Bispo Diocesano', defaultTitle: 'Dom' },
  { value: 'supreme_pontiff', label: 'Sumo Pontífice (Papa)', defaultRole: 'Sumo Pontífice', defaultTitle: 'Papa' },
  { value: 'vicar', label: 'Vigário Paroquial', defaultRole: 'Vigário Paroquial', defaultTitle: 'Padre' },
  { value: 'other', label: 'Outro Ministério', defaultRole: 'Ministro', defaultTitle: '' },
];

export const ClergyInfoStep = ({ values, onChange, errors }: ClergyInfoStepProps) => {
  const [confirmRemovePhoto, setConfirmRemovePhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePositionChange = (newPos: ClergyPosition) => {
    onChange('position', newPos);
    const found = POSITIONS.find((p) => p.value === newPos);
    if (found) {
      if (!values.roleName || POSITIONS.some((p) => p.defaultRole === values.roleName)) {
        onChange('roleName', found.defaultRole);
      }
      if (!values.title || POSITIONS.some((p) => p.defaultTitle === values.title)) {
        onChange('title', found.defaultTitle);
      }
      if (newPos === 'parish_priest') {
        onChange('isMain', true);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    onChange('photoUrl', objectUrl);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const { attachmentId } = await uploadFileWithProgress(
        file,
        (percent) => setUploadProgress(percent)
      );
      onChange('photoId', attachmentId);
      setUploadProgress(null);
    } catch (err: unknown) {
      setUploadError(
        typeof err === 'string' ? err : 'Falha ao enviar a foto do clérigo.'
      );
      setUploadProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-[#5A463B] font-serif leading-relaxed">
          Preencha os dados e foto do clérigo. No próximo passo, você poderá descrever a biografia completa e revisar antes de salvar.
        </p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Photo and Core Info Row */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Portrait Photo Container */}
          <div className="flex flex-col items-center sm:w-44 shrink-0 mx-auto sm:mx-0">
            <div className="relative w-36 sm:w-40 aspect-3/4 rounded-2xl overflow-hidden border-2 border-[#D6A64A]/50 bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] shadow-xs flex items-center justify-center group">
              {values.photoUrl ? (
                <>
                  <img
                    src={values.photoUrl}
                    alt="Foto do Clérigo"
                    className="w-full h-full object-cover object-top"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-xs"
                    onClick={() => setConfirmRemovePhoto(true)}
                    className="absolute top-2 right-2 rounded-full shadow z-10"
                    title="Remover foto do clérigo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400 p-2 text-center">
                  <User className="w-12 h-12 mb-1 stroke-1 text-[#B8872E]/60" />
                  <span className="text-[11px] text-zinc-500 font-serif">Sem foto</span>
                </div>
              )}

              {/* Upload Overlay */}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-2 text-center">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Trocar Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            {uploadProgress !== null && (
              <span className="text-xs text-[#B8872E] font-medium mt-1">
                Enviando: {uploadProgress}%
              </span>
            )}
            {uploadError && (
              <span className="text-xs text-red-600 mt-1 text-center">
                {uploadError}
              </span>
            )}

            <label className="mt-2 text-xs font-semibold text-[#B8872E] hover:underline cursor-pointer flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>{values.photoUrl ? 'Alterar foto' : 'Enviar foto oficial'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* Form Fields Right */}
          <div className="flex-1 w-full space-y-4">
            {/* Position / Cargo Canônico */}
            <div>
              <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                Cargo / Posição Canônica *
              </label>
              <select
                value={values.position}
                onChange={(e) => handlePositionChange(e.target.value as ClergyPosition)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
              >
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={values.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Ex: Padre Altair Santos, Dom José Carlos..."
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-300'
                } bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]`}
              />
              {errors.name && (
                <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>
              )}
            </div>

            {/* Título e Função Exibida */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Título / Vocativo
                </label>
                <input
                  type="text"
                  value={values.title}
                  onChange={(e) => onChange('title', e.target.value)}
                  placeholder="Ex: Padre, Diácono, Dom, Papa..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Função Exibida no Site
                </label>
                <input
                  type="text"
                  value={values.roleName}
                  onChange={(e) => onChange('roleName', e.target.value)}
                  placeholder="Ex: Pároco, Bispo Diocesano..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Frase de Destaque */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
            Frase de Destaque / Introdução Curta
          </label>
          <input
            type="text"
            value={values.shortIntro}
            onChange={(e) => onChange('shortIntro', e.target.value)}
            placeholder="Ex: À frente da missão pastoral da nossa comunidade."
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
          />
        </div>

        {/* Destaque Principal & Ordem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={values.isMain}
              onChange={(e) => onChange('isMain', e.target.checked)}
              className="size-4.5 rounded text-[#18351E] focus:ring-[#B8872E] accent-[#18351E]"
            />
            <div>
              <span className="text-xs font-semibold text-zinc-900 block">
                Destaque Principal (Pároco)
              </span>
              <span className="text-[11px] text-zinc-500">
                Exibe este membro em destaque panorâmico no topo do clero.
              </span>
            </div>
          </label>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1">
              Ordem de Exibição
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={values.orderIndex}
              onChange={(e) => onChange('orderIndex', Number(e.target.value))}
              className="w-24 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
            />
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={confirmRemovePhoto}
        onOpenChange={setConfirmRemovePhoto}
        title="Remover Foto do Clérigo"
        description="Tem certeza que deseja remover a foto deste membro do clero?"
        confirmText="Remover"
        onConfirm={() => {
          onChange('photoId', null);
          onChange('photoUrl', null);
          setConfirmRemovePhoto(false);
        }}
      />
    </div>
  );
};
