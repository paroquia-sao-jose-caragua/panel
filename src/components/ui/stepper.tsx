import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const stepVariants = cva(
  'flex items-center justify-center w-8 h-8 rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-brand-700 text-white',
        active: 'bg-brand-700 text-white',
        completed: 'bg-brand-700 text-white',
        pending: 'bg-zinc-200 text-zinc-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const labelVariants = cva('text-sm font-semibold', {
  variants: {
    variant: {
      default: 'text-zinc-800',
      active: 'text-zinc-800',
      completed: 'text-zinc-800',
      pending: 'text-zinc-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Step({
  className,
  variant = 'default',
  step,
  label,
}: React.ComponentProps<'div'> &
  VariantProps<typeof stepVariants> & {
    label: string;
    step: number;
  }) {
  return (
    <div className="flex flex-col sm:flex-row  items-center justify-center gap-2">
      <div className={cn(stepVariants({ variant, className }))}>
        <span className="font-bold text-sm">{step}</span>
      </div>
      <span className={cn(labelVariants({ variant, className }))}>{label}</span>
    </div>
  );
}

export { Step, stepVariants };
