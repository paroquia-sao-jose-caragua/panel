'use client';

import { User } from 'lucide-react';
import { useMemo } from 'react';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { cn } from '@/lib/utils';

export const ImagePreview = ({
  url: initialPreviewURL,
  variant = 'reactangular',
  className = '',
}: {
  url?: string;
  variant?: 'reactangular' | 'circular';
  className?: string;
}) => {
  const { files } = useFileInputStore();

  const previewURL = useMemo(() => {
    if (files.length === 0 && !initialPreviewURL) {
      return null;
    }

    if (files.length > 0) {
      return URL.createObjectURL(files[0].file);
    }

    return initialPreviewURL;
  }, [files, initialPreviewURL]);

  if (previewURL === null) {
    return (
      <div
        className={`${variant === 'reactangular' ? 'h-16 w-24' : 'h-16 w-16'} ${variant === 'circular' ? 'rounded-full' : 'rounded'} flex items-center justify-center bg-brand-50`}
      >
        <User className="h-8 w-8 text-brand-500" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={previewURL}
      alt=""
      className={cn(
        `${variant === 'reactangular' ? 'h-16 w-24' : 'h-16 w-16'} ${variant === 'circular' ? 'rounded-full' : 'rounded'} object-cover`,
        className
      )}
    />
  );
};
