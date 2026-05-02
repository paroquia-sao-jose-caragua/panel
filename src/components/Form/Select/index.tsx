'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SelectProps extends SelectPrimitive.SelectProps {
  children: ReactNode;
  placeholder: string;
}

export function Select({ children, placeholder, ...props }: SelectProps) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input px-3 py-2 shadow-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100 data-placeholder:text-zinc-600 bg-white">
        <SelectPrimitive.Value
          className="text-zinc-900"
          placeholder={placeholder}
        />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-5 w-5 text-zinc-400" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          side="bottom"
          position="popper"
          sideOffset={8}
          className="animate-slide-down-and-fade z-10 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-input bg-white shadow-sm"
        >
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
