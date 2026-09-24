import { twMerge } from 'tailwind-merge';

export function TypographyH1({
  className,
  ...props
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={twMerge([
        'scroll-m-20 pb-2 text-3xl md:text-5xl font-semibold text-zinc-900 leading-tight first:mt-0 font-serif',
        className,
      ])}
      style={{ fontFamily: "Cormorant Garamond, serif" }}
      {...props}
    />
  );
}
