'use client';

import { ImageIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const emptyVariants = cva('flex items-center justify-center bg-zinc-100', {
  variants: {
    variant: {
      rectangular: 'rounded h-16 w-24',
      circular: 'rounded-full h-16 w-16',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    // RECTANGULAR
    { variant: 'rectangular', size: 'sm', class: 'h-12 w-16' },
    { variant: 'rectangular', size: 'md', class: 'h-16 w-24' },
    { variant: 'rectangular', size: 'lg', class: 'h-24 w-36' },
    // CIRCULAR
    { variant: 'circular', size: 'sm', class: 'h-12 w-12' },
    { variant: 'circular', size: 'md', class: 'h-16 w-16' },
    { variant: 'circular', size: 'lg', class: 'h-20 w-20' },
  ],
});

const imageVariants = cva('object-cover', {
  variants: {
    variant: {
      rectangular: 'rounded',
      circular: 'rounded-full',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    // RECTANGULAR
    { variant: 'rectangular', size: 'sm', class: 'h-12 w-16' },
    { variant: 'rectangular', size: 'md', class: 'h-16 w-24' },
    { variant: 'rectangular', size: 'lg', class: 'h-24 w-36' },
    // CIRCULAR
    { variant: 'circular', size: 'sm', class: 'h-12 w-12' },
    { variant: 'circular', size: 'md', class: 'h-16 w-16' },
    { variant: 'circular', size: 'lg', class: 'h-20 w-20' },
  ],
});

export const ImagePreview = ({
  url: initialPreviewURL,
  variant = 'rectangular',
  size = 'md',
  className = '',
}: {
  url?: string | null;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'rectangular' | 'circular';
  className?: string;
}) => {
  const { files } = useFileInputStore();

  const previewURL = useMemo(() => {
    const fileCompleted = files.find((f) => f.state === 'complete');

    if (!fileCompleted && !initialPreviewURL) {
      return null;
    }

    if (fileCompleted) {
      return URL.createObjectURL(fileCompleted.file);
    }

    return initialPreviewURL;
  }, [files, initialPreviewURL]);

  if (previewURL === null) {
    return (
      <div className={cn(emptyVariants({ variant, size }), className)}>
        <ImageIcon className="h-8 w-8 text-zinc-400" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={previewURL}
      alt=""
      className={cn(imageVariants({ variant, size }), className)}
    />
  );
};
