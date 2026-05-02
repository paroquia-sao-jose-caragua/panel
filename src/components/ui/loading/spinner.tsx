import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type SpinnerProps = ComponentProps<"div">;

export const Spinner = ({ className, ...props }: SpinnerProps) => (
  <div className="flex items-center justify-center">
    <div
      className={`border-t-transparent ${twMerge([
        "animate-spin rounded-full border-4 border-brand-700 w-10 h-10",
        className,
      ])}`}
      {...props}
    />
  </div>
);
