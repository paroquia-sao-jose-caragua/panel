'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ImageLightboxProps {
  src: string;
  alt?: string;
  label?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  size?: 'sm' | 'md' | 'lg';
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  src,
  alt = 'Visualização da imagem',
  label,
  className,
  aspectRatio = 'auto',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!src) return null;

  const sizeClasses = {
    sm: 'h-16 w-24',
    md: 'h-24 w-40',
    lg: 'h-32 w-56',
  };

  return (
    <>
      {/* Thumbnail Trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm transition-all hover:border-brand-500 hover:shadow-md',
          sizeClasses[size],
          className
        )}
        title="Clique para visualizar em tela cheia"
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay with Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Expandir
          </span>
        </div>

        {label && (
          <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
            {label}
          </span>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          {/* Header Controls */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 px-2 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-white/90">
              <Maximize2 className="h-5 w-5 text-brand-400" />
              {label && <span className="font-semibold text-sm sm:text-base">{label}</span>}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-white/10 hover:bg-white/25 text-white hover:text-white px-3 py-1.5 text-xs font-semibold gap-1.5"
            >
              <X className="h-4 w-4" /> Fechar (ESC)
            </Button>
          </div>

          {/* Centered Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
