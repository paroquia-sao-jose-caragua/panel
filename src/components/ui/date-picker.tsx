'use client';

import * as React from 'react';
import { ptBR } from 'react-day-picker/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { FieldDescription } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

dayjs.locale('pt-br');

interface DatePickerProps {
  label?: string;
  value?: string;
  helperText?: string;
  error?: string;
  className?: string;
  onChange?: (newDate: string) => void;
}

export function DatePicker({
  label,
  value,
  helperText,
  error,
  className,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ? dayjs(value).toDate() : undefined
  );

  const handleChange = React.useCallback(
    (newDate: Date | undefined) => {
      setDate(newDate);
      if (newDate && onChange) {
        onChange(dayjs(newDate).format('YYYY-MM-DD'));
      }
    },
    [onChange]
  );

  return (
    <div className={cn('flex flex-col flex-1 gap-0', className)}>
      {label && (
        <span className="block mb-2 text-sm text-zinc-700 font-semibold">
          {label}
        </span>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            id="date"
            className="justify-between font-normal px-3 text-md shadow-none"
          >
            {date ? (
              <span className="flex-1 text-left">
                {dayjs(date).format('DD/MM/YYYY')}
              </span>
            ) : (
              <span className="flex-1 text-left text-zinc-600">
                Selecione a data
              </span>
            )}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            lang="pt-BR"
            locale={ptBR}
            onSelect={(date) => {
              handleChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {!error && helperText ? (
        <div className="mt-2">
          <FieldDescription>{helperText}</FieldDescription>
        </div>
      ) : null}
      {error && <p className="mt-2 ml-4 text-xs text-red-700">{error}</p>}
    </div>
  );
}
