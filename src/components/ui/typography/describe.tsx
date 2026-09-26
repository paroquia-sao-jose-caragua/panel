import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export type DescribeProps = ComponentProps<'p'>;

export function Describe({ className, ...props }: DescribeProps) {
  return (
    <p
      className={twMerge([
        'mt-2 text-sm md:text-base text-zinc-600 font-serif leading-relaxed',
        className,
      ])}
      {...props}
    />
  );
}
