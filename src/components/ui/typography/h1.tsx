import { twMerge } from 'tailwind-merge';

interface TypographyH1Props extends React.ComponentProps<'h1'> {
  size?: 'page' | 'form';
}

export function TypographyH1({
  className,
  size = 'page',
  ...props
}: TypographyH1Props) {
  return (
    <h1
      className={twMerge([
        'scroll-m-20 pb-2 font-semibold text-zinc-900 leading-tight first:mt-0 font-serif',
        size === 'form' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl',
        className,
      ])}
      {...props}
    />
  );
}
