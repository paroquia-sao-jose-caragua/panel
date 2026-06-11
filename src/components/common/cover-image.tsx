// src/components/ui/cover-image.tsx
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const coverVariants = cva('object-cover', {
  variants: {
    variant: {
      rectangular: 'rounded',
      circular: 'rounded-full',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { variant: 'rectangular', size: 'xs', class: 'h-8 w-12' },
    { variant: 'rectangular', size: 'sm', class: 'h-12 w-16' },
    { variant: 'rectangular', size: 'md', class: 'h-16 w-24' },
    { variant: 'rectangular', size: 'lg', class: 'h-24 w-36' },
    { variant: 'circular', size: 'xs', class: 'h-8 w-8' },
    { variant: 'circular', size: 'sm', class: 'h-12 w-12' },
    { variant: 'circular', size: 'md', class: 'h-16 w-16' },
    { variant: 'circular', size: 'lg', class: 'h-20 w-20' },
  ],
});

const emptyVariants = cva('flex items-center justify-center bg-zinc-100', {
  variants: {
    variant: {
      rectangular: 'rounded',
      circular: 'rounded-full',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { variant: 'rectangular', size: 'xs', class: 'h-8 w-12' },
    { variant: 'rectangular', size: 'sm', class: 'h-12 w-16' },
    { variant: 'rectangular', size: 'md', class: 'h-16 w-24' },
    { variant: 'rectangular', size: 'lg', class: 'h-24 w-36' },
    { variant: 'circular', size: 'xs', class: 'h-8 w-8' },
    { variant: 'circular', size: 'sm', class: 'h-12 w-12' },
    { variant: 'circular', size: 'md', class: 'h-16 w-16' },
    { variant: 'circular', size: 'lg', class: 'h-20 w-20' },
  ],
});

const iconVariants = cva('text-zinc-400', {
  variants: {
    size: {
      xs: 'h-4 w-4',
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    },
  },
});

export const CoverImage = ({
  url,
  variant = 'rectangular',
  size = 'md',
  className = '',
}: {
  url?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'rectangular' | 'circular';
  className?: string;
}) => {
  if (!url) {
    return (
      <div className={cn(emptyVariants({ variant, size }), className)}>
        <ImageIcon className={iconVariants({ size })} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      className={cn(coverVariants({ variant, size }), className)}
    />
  );
};
