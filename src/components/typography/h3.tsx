import { twMerge } from 'tailwind-merge';

export function TypographyH3({
  className,
  ...props
}: React.ComponentProps<'h3'>) {
  return (
    <h4
      className={twMerge([
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      ])}
      {...props}
    />
  );
}
