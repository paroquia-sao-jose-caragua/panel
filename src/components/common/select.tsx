'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import * as BaseSelect from '@radix-ui/react-select';
import { Check } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SelectProps extends SelectPrimitive.SelectProps {
  children: ReactNode;
  placeholder: string;
}

function Select({ children, placeholder, ...props }: SelectProps) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger className="flex h-11.5 w-full items-center justify-between gap-2 rounded-lg border border-input px-3 py-2 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100 data-placeholder:text-zinc-600 bg-white">
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

export type SelectItemProps = BaseSelect.SelectItemProps & {
  text: string;
};

function SelectItem({ text, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-highlighted:bg-zinc-50"
      {...props}
    >
      <BaseSelect.ItemText asChild>
        <span className="text-zinc-900">{text}</span>
      </BaseSelect.ItemText>

      <BaseSelect.ItemIndicator>
        <Check className="h-4 w-4 text-brand-500" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export { Select, SelectItem };
