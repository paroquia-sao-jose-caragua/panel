import type { ComponentProps } from 'react';

export type TextareaProps = ComponentProps<'textarea'>;

export function Textarea(props: TextareaProps) {
  return (
    <textarea
      className="bg-white min-h-32 w-full resize-y rounded-lg border border-brand-100 px-3 py-2 shadow-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100 data-placeholder:text-zinc-600"
      {...props}
    />
  );
}
