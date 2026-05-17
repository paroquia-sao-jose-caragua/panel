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
          <SelectPrimitive.Viewport className="max-h-60 overflow-y-auto">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export type SelectItemProps = BaseSelect.SelectItemProps & {
  text: string;
  description?: string;
};

function SelectItem({ text, description, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      className="flex flex-col items-start gap-0.5 px-3 py-2.5 outline-none data-highlighted:bg-zinc-50"
      {...props}
    >
      <div className="flex items-center w-full justify-between">
        <BaseSelect.ItemText asChild>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-900">{text}</span>
          </div>
        </BaseSelect.ItemText>

        <BaseSelect.ItemIndicator>
          <Check className="h-4 w-4 text-brand-500" />
        </BaseSelect.ItemIndicator>
      </div>

      {description && (
        <span className="text-sm text-zinc-500">{description}</span>
      )}
    </BaseSelect.Item>
  );
}

export { Select, SelectItem };
