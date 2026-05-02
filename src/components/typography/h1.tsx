import { twMerge } from 'tailwind-merge';

export function TypographyH1({
  className,
  ...props
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={twMerge([
        'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      ])}
      {...props}
    />
  );
}
