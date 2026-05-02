import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type ControlProps = ComponentProps<'input'>;

export const Control = (props: ControlProps) => {
  return (
    <input
      className={twMerge([
        'flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none',
      ])}
      {...props}
    />
  );
};
