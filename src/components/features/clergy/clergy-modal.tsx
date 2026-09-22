'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Sparkles, User, Cross, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import type { Clergy, ClergyPosition } from '@/entities/Clergy';

interface ClergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  clergyToEdit?: Clergy | null;
  onSave: (data: {
    id?: string;
    name: string;
    title?: string | null;
    position: ClergyPosition;
    roleName?: string | null;
    shortIntro?: string | null;
    bio?: string | null;
    orderIndex?: number;
    isMain?: boolean;
    photoId?: string | null;
  }) => Promise<void>;
  isSaving: boolean;
}

const POSITIONS: { value: ClergyPosition; label: string; defaultRole: string; defaultTitle: string }[] = [
  { value: 'parish_priest', label: 'Pároco', defaultRole: 'Pároco', defaultTitle: 'Padre' },
  { value: 'permanent_deacon', label: 'Diácono Permanente', defaultRole: 'Diácono Permanente', defaultTitle: 'Diácono' },
  { value: 'diocesan_bishop', label: 'Bispo Diocesano', defaultRole: 'Bispo Diocesano', defaultTitle: 'Dom' },
  { value: 'supreme_pontiff', label: 'Sumo Pontífice (Papa)', defaultRole: 'Sumo Pontífice', defaultTitle: 'Papa' },
  { value: 'vicar', label: 'Vigário Paroquial', defaultRole: 'Vigário Paroquial', defaultTitle: 'Padre' },
  { value: 'other', label: 'Outro Ministério', defaultRole: 'Ministro', defaultTitle: '' },
];

export const ClergyModal = ({
  isOpen,
  onClose,
  clergyToEdit,
  onSave,
  isSaving,
}: ClergyModalProps) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState<ClergyPosition>('parish_priest');
  const [roleName, setRoleName] = useState('');
  const [shortIntro, setShortIntro] = useState('');
  const [bio, setBio] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [isMain, setIsMain] = useState(false);
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (clergyToEdit) {
      setName(clergyToEdit.name || '');
      setTitle(clergyToEdit.title || '');
      setPosition(clergyToEdit.position || 'parish_priest');
      setRoleName(clergyToEdit.roleName || '');
      setShortIntro(clergyToEdit.shortIntro || '');
      setBio(clergyToEdit.bio || '');
      setOrderIndex(clergyToEdit.orderIndex ?? 1);
      setIsMain(Boolean(clergyToEdit.isMain));
      setPhotoId(clergyToEdit.photoId || null);
      setPreviewUrl(clergyToEdit.photoUrl || null);
    } else {
      setName('');
      setTitle('Padre');
      setPosition('parish_priest');
      setRoleName('Pároco');
      setShortIntro('');
      setBio('');
      setOrderIndex(1);
      setIsMain(false);
      setPhotoId(null);
      setPreviewUrl(null);
    }
    setUploadProgress(null);
    setUploadError(null);
  }, [clergyToEdit, isOpen]);

  if (!isOpen) return null;

  const handlePositionChange = (newPos: ClergyPosition) => {
    setPosition(newPos);
    const found = POSITIONS.find((p) => p.value === newPos);
    if (found) {
      if (!roleName || POSITIONS.some((p) => p.defaultRole === roleName)) {
        setRoleName(found.defaultRole);
      }
      if (!title || POSITIONS.some((p) => p.defaultTitle === title)) {
        setTitle(found.defaultTitle);
      }
      if (newPos === 'parish_priest') {
        setIsMain(true);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const { attachmentId } = await uploadFileWithProgress(
        file,
        (percent) => setUploadProgress(percent)
      );
      setPhotoId(attachmentId);
      setUploadProgress(null);
    } catch (err: unknown) {
      setUploadError(
        typeof err === 'string' ? err : 'Falha ao enviar a imagem.'
      );
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSave({
      id: clergyToEdit?.id,
      name: name.trim(),
      title: title.trim() || null,
      position,
      roleName: roleName.trim() || null,
      shortIntro: shortIntro.trim() || null,
      bio: bio.trim() || null,
      orderIndex: Number(orderIndex) || 0,
      isMain,
      photoId,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#FBF8F3] border border-[#D6A64A]/50 shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Border */}
        <div className="h-2 bg-[#B8872E] w-full" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#D6A64A]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3
                className="text-xl sm:text-2xl font-semibold text-zinc-900"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {clergyToEdit ? 'Editar Dados do Clérigo' : 'Adicionar Membro do Clero'}
              </h3>
              <p className="text-xs text-zinc-500 font-serif">
                Preencha as informações que serão exibidas na seção do Clero no site público.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Photo and Basic Info Row */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Portrait Photo Upload */}
            <div className="flex flex-col items-center sm:w-44 shrink-0 mx-auto sm:mx-0">
              <div className="relative w-36 sm:w-40 aspect-3/4 rounded-2xl overflow-hidden border-2 border-[#D6A64A]/50 bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] shadow-xs flex items-center justify-center group">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400 p-2 text-center">
                    <User className="w-12 h-12 mb-1 stroke-1 text-[#B8872E]/60" />
                    <span className="text-[11px] text-zinc-500 font-serif">Sem foto</span>
                  </div>
                )}

                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-2 text-center">
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
                <span>{previewUrl ? 'Alterar foto' : 'Enviar foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            {/* Inputs Right */}
            <div className="flex-1 w-full space-y-4">
              {/* Position / Cargo Canônico */}
              <div>
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Cargo / Posição Canônica *
                </label>
                <select
                  value={position}
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

              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Padre Altair Santos, Dom José Carlos..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
                />
              </div>

              {/* Título e Função Exibida */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Título / Vocativo
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Padre, Diácono, Dom..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Função Exibida no Site
                  </label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Ex: Pároco, Bispo Diocesano..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Frase Curta / Introdução */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
              Frase de Destaque / Introdução Curta
            </label>
            <input
              type="text"
              value={shortIntro}
              onChange={(e) => setShortIntro(e.target.value)}
              placeholder="Ex: À frente da missão pastoral da nossa comunidade."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
            />
          </div>

          {/* Biografia Completa */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
              Biografia e Trajetória Vocacional
            </label>
            <textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Descreva a história, nascimento, ordenação, estudos e missão do clérigo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 font-serif focus:outline-hidden focus:ring-2 focus:ring-[#B8872E] leading-relaxed"
            />
          </div>

          {/* Opções extras: Destaque Principal & Ordem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/70 border border-[#D6A64A]/30">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isMain}
                onChange={(e) => setIsMain(e.target.checked)}
                className="size-4.5 rounded text-[#18351E] focus:ring-[#B8872E] accent-[#18351E]"
              />
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">
                  Destaque Principal (Pároco)
                </span>
                <span className="text-[11px] text-zinc-500">
                  Exibe este membro em destaque no topo da seção do clero.
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
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#B8872E]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#D6A64A]/20 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="rounded-full bg-[#18351E] hover:bg-[#27442A] text-white text-xs font-semibold px-6 shadow-md"
            >
              {isSaving ? 'Salvando...' : clergyToEdit ? 'Salvar Alterações' : 'Cadastrar Clérigo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
