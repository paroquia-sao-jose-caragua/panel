'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Sparkles,
} from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { useCommunity } from '@/api/communities/use-community';
import useCommunityStore from '@/stores/useCommunityStore';
import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import { updateCommunityPhotos } from '@/api/communities/photos/update';
import { showAlert } from '@/utils/showAlert';

interface GalleryItem {
  id?: string;
  photoId: string;
  photoUrl?: string;
  caption?: string;
  orderIndex?: number;
}

export default function ChurchGalleryPage() {
  const router = useRouter();
  const { community } = useCommunity();
  const { setCommunity } = useCommunityStore();

  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (community?.photos) {
      setPhotos(
        community.photos.map((p, idx) => ({
          id: p.id,
          photoId: p.photoId,
          photoUrl: p.photoUrl,
          caption: p.caption || '',
          orderIndex: p.orderIndex ?? idx,
        }))
      );
    }
  }, [community]);

  const { mutate: savePhotos, isPending: isSaving } = useMutation({
    mutationFn: updateCommunityPhotos,
  });

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      const newItems: GalleryItem[] = [...photos];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileWithProgress(file, (percent) => {
          setUploadProgress(
            Math.round(((i + percent / 100) / files.length) * 100)
          );
        });

        newItems.push({
          photoId: res.attachmentId,
          photoUrl: URL.createObjectURL(file),
          caption: '',
          orderIndex: newItems.length,
        });
      }

      setPhotos(newItems);
    } catch (err: unknown) {
      setUploadError(
        typeof err === 'string'
          ? err
          : 'Erro ao enviar fotos. Tente novamente.'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    setPhotos((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;

      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;
      return newArr;
    });
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setPhotos((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], caption };
      return newArr;
    });
  };

  const handleSaveGallery = () => {
    if (!community?.id) return;

    savePhotos(
      {
        communityId: community.id,
        photos: photos.map((p, idx) => ({
          id: p.id,
          photoId: p.photoId,
          caption: p.caption || null,
          orderIndex: idx,
        })),
      },
      {
        onSuccess: ({ photos: updatedPhotos, statusCode, message }) => {
          if (statusCode === 200 && updatedPhotos) {
            setCommunity({
              ...community,
              photos: updatedPhotos,
            });
            showAlert('Galeria de fotos atualizada com sucesso!');
            router.push(`/${community.slug}`);
          } else {
            showAlert(`Erro ao salvar galeria: ${message || 'Erro no servidor'}`);
          }
        },
        onError: (err) => {
          showAlert(`Erro ao salvar galeria: ${err.message}`);
        },
      }
    );
  };

  const getPhotoSrc = (item: GalleryItem) => {
    if (item.photoUrl) return item.photoUrl;
    if (item.photoId) {
      return `${process.env.NEXT_PUBLIC_BASE_API_URL}/attachments/${item.photoId}`;
    }
    return '';
  };

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0 border-b border-divider">
        <div className="mx-auto w-full max-w-225 px-4 lg:px-8 py-5">
          <BackButton href={`/${community?.slug}`} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-[#fef8ed] border border-[#D6A64A]/30 flex items-center justify-center text-[#B8872E]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <TypographyH1>Galeria de Fotos</TypographyH1>
                <span className="text-sm font-medium text-zinc-500">
                  {community?.name}
                </span>
              </div>
            </div>

            <Button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 shrink-0"
            >
              {isUploading ? (
                <>
                  <Spinner className="w-4 h-4 mr-1" />
                  Enviando {uploadProgress}%
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Fotos</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-225 px-4 pt-8 pb-16 mx-auto lg:px-8">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUploadFiles}
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
        />

        {uploadError && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
            {uploadError}
          </div>
        )}

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 rounded-2xl bg-white text-center shadow-xs">
            <div className="size-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-200/60">
              <ImageIcon className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-base font-semibold text-zinc-800">
              Nenhuma foto na galeria
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md">
              Envie fotos dos altares, fachada, eventos e celebrações da comunidade para compor a galeria pública.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Selecionar fotos do dispositivo</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {photos.length} {photos.length === 1 ? 'foto cadastrada' : 'fotos cadastradas'}
              </span>
              <span className="text-xs text-zinc-400">
                Arraste ou use as setas para reordenar
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {photos.map((item, index) => (
                <div
                  key={item.photoId || index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs hover:border-zinc-300 transition-colors"
                >
                  <div className="relative w-28 sm:w-32 aspect-4/3 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                    <img
                      src={getPhotoSrc(item)}
                      alt={item.caption || `Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-1">
                    <label className="text-xs font-medium text-zinc-600 block">
                      Legenda da foto
                    </label>
                    <InputRoot>
                      <InputControl
                        value={item.caption || ''}
                        onChange={(e) =>
                          handleCaptionChange(index, e.target.value)
                        }
                        placeholder="Ex: Fachada iluminada, Altar Mor, Festa do Padroeiro..."
                      />
                    </InputRoot>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === 0}
                      onClick={() => handleMovePhoto(index, 'up')}
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === photos.length - 1}
                      onClick={() => handleMovePhoto(index, 'down')}
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemovePhoto(index)}
                      title="Remover foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-6 mt-8 justify-between border-t border-divider">
          <Link href={`/${community?.slug}`}>
            <Button variant="outline" size="lg">
              Cancelar
            </Button>
          </Link>
          <Button
            size="lg"
            disabled={isSaving || isUploading}
            onClick={handleSaveGallery}
          >
            {isSaving ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Salvando...
              </>
            ) : (
              'Salvar Galeria'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
