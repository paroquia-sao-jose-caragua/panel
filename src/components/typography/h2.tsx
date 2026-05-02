import { twMerge } from 'tailwind-merge';

export function TypographyH2({
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={twMerge([
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      ])}
      {...props}
    />
  );
}
