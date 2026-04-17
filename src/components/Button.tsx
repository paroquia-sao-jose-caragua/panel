import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "cursor-pointer rounded-lg h-9 px-4 py-2 text-sm font-semibold outline-none shadow-sm",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500",
    "active:opacity-80",
  ],

  variants: {
    variant: {
      primary:
        "bg-brand-800 text-white hover:bg-brand-900 focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:ring-offset-1",
      ghost:
        "rounded-md px-2 hover:bg-brand-50 text-zinc-500 shadow-none hover:text-brand-600 focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:ring-offset-1",
      outline:
        "bg-white border border-brand-300 text-zinc-700 hover:bg-brand-0 hover:border-brand-300 focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:ring-offset-1",
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof button>;

export default function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={button({
        variant,
        className: [
          className,
          props.disabled ? "opacity-50 cursor-not-allowed" : "",
        ]
          .filter(Boolean)
          .join(" "),
      })}
    />
  );
}
