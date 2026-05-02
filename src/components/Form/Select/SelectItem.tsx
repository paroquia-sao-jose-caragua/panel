'use client';

import * as Select from '@radix-ui/react-select';
import { Check } from 'lucide-react';

export type SelectItemProps = Select.SelectItemProps & {
  text: string;
};

export const SelectItem = ({ text, ...props }: SelectItemProps) => {
  return (
    <Select.Item
      className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-highlighted:bg-zinc-50"
      {...props}
    >
      <Select.ItemText asChild>
        <span className="text-zinc-900">{text}</span>
      </Select.ItemText>

      <Select.ItemIndicator>
        <Check className="h-4 w-4 text-brand-500" />
      </Select.ItemIndicator>
    </Select.Item>
  );
};
