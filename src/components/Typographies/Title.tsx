import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export type TitleProps = ComponentProps<'h1'>;

export const Title = ({ className, ...props }: TitleProps) => {
  return (
    <h1
      className={twMerge(['text-3xl font-medium text-zinc-900', className])}
      {...props}
    />
  );
};
