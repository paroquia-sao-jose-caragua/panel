import { cn } from 'tailwind-variants';

export function TypographyP({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-sm md:text-base text-zinc-600 font-serif leading-relaxed [&:not(:first-child)]:mt-4',
        className
      )}
      {...props}
    />
  );
}
