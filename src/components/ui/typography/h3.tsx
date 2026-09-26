import { twMerge } from 'tailwind-merge';

export function TypographyH3({
  className,
  ...props
}: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={twMerge([
        'scroll-m-20 text-lg md:text-xl font-semibold text-zinc-900 leading-snug font-serif',
        className,
      ])}
      {...props}
    />
  );
}
