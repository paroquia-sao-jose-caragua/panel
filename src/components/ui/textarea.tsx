import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export type TextareaProps = ComponentProps<'textarea'>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'bg-white min-h-32 w-full resize-y rounded-lg border border-input px-3 py-2 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100 data-placeholder:text-zinc-600',
        className
      )}
      {...props}
    />
  );
}
