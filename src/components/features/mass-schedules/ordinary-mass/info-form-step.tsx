import { Select } from '@/components/common/select';
import { SelectItem } from '@/components/common/select';
import { FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import {
  ClockIcon,
  PlusIcon,
  Trash2 as TrashIcon,
  CalendarIcon,
} from 'lucide-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { formatTimeDifference } from '@/utils/formatTime';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import type { useCreateMassSchedule } from '../use-create-mass-schedule';

interface InfoStepProps {
  formik: ReturnType<typeof useCreateMassSchedule>['formik'];
}

export const InfoFormStep = ({ formik }: InfoStepProps) => {
  const startTimeRef = React.useRef<HTMLInputElement>(null);
  const endTimeRef = React.useRef<HTMLInputElement>(null);

  return (
    <form
      id="add-ordinary-mass"
      className="flex w-full flex-col gap-8 divide-y divide-divider"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="day-of-week">
            <CalendarIcon className="text-zinc-400" />
            Quando
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Escolha o dia da semana em que essa missa acontece (ex: todas as
            quartas-feiras)
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-zinc-700 font-semibold">
            Dia da semana
          </Label>
          <Select
            name="dayOfWeek"
            placeholder="Selecione o dia"
            value={String(formik.values.dayOfWeek)}
            onValueChange={(newValue: string) => {
              formik.setFieldValue('dayOfWeek', Number(newValue));
            }}
          >
            <SelectItem value="0" text="Domingo" />
            <SelectItem value="1" text="Segunda-feira" />
            <SelectItem value="2" text="Terça-feira" />
            <SelectItem value="3" text="Quarta-feira" />
            <SelectItem value="4" text="Quinta-feira" />
            <SelectItem value="5" text="Sexta-feira" />
            <SelectItem value="6" text="Sábado" />
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-row gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="day-of-month">Missa de Preceito</FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Missas de preceito são aquelas que os fiéis católicos têm obrigação
            de participar (ex: domingos e dias santos).
          </span>
        </div>
        <Switch
          name="isPrecept"
          checked={formik.values.isPrecept}
          onCheckedChange={(newValue) =>
            formik.setFieldValue('isPrecept', newValue)
          }
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 pb-5">
        <div>
          <FieldLabel htmlFor="day-of-month">
            <ClockIcon className="text-zinc-400" />
            Horários
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Você pode adicionar quantos horários quiser para esse agendamento
            (ex: 8h às 9h, 18h às 19h, etc).
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-wrap gap-4 items-end">
            <div className="flex-1">
              <span className="block mb-2 text-sm text-zinc-700 font-semibold">
                Início
              </span>
              <InputRoot>
                <InputControl ref={startTimeRef} type="time" />
              </InputRoot>
            </div>
            <div className="flex-1">
              <span className="block mb-2 text-sm text-zinc-700 font-semibold">
                Fim
              </span>
              <InputRoot>
                <InputControl ref={endTimeRef} type="time" />
              </InputRoot>
            </div>
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-fit"
              onClick={() => {
                const startTime = startTimeRef.current?.value;
                const endTime = endTimeRef.current?.value;

                if (
                  startTime &&
                  endTime &&
                  startTimeRef.current?.value &&
                  endTimeRef.current?.value
                ) {
                  formik.setFieldValue('times', [
                    ...formik.values.times,
                    { startTime, endTime },
                  ]);

                  startTimeRef.current.value = '';
                  endTimeRef.current.value = '';
                }
              }}
            >
              <PlusIcon /> Adicionar
            </Button>
          </div>

          {formik.values.times.length === 0 && (
            <Empty className="border-2 border-dashed">
              <EmptyHeader>
                <EmptyMedia className="text-zinc-300">
                  <ClockIcon className="h-10 w-10" />
                </EmptyMedia>
                <EmptyTitle className="text-zinc-500 text-md">
                  Nenhum horário adicionado ainda
                </EmptyTitle>
                <EmptyDescription>
                  Adicione pelo menos um horário (início e fim)
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {formik.values.times.length > 0 && (
            <div className="flex flex-col gap-4">
              <span className="block mt-2 text-zinc-700 text-md font-semibold">
                Horários Adicionados {`(${formik.values.times.length})`}
              </span>
              <div className="divide-y divide-divider space-y-4">
                {formik.values.times.map((time) => (
                  <div
                    key={time.startTime}
                    className="flex flex-row items-center justify-between bg-brand-0/30 pl-4 pr-2 py-1 rounded-lg border border-brand-500/50"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <span className="flex-1 text-md font-medium text-brand-800">
                        {time.startTime} - {time.endTime}
                      </span>
                      <span className="text-xs text-brand-700 bg-brand-200 py-1 px-2 rounded">
                        {formatTimeDifference(time.startTime, time.endTime)}
                      </span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-lg"
                          onClick={() => {
                            formik.setFieldValue(
                              'times',
                              formik.values.times.filter((t) => t !== time)
                            );
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Remover horário</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 pb-5">
        <div>
          <FieldLabel htmlFor="day-of-month">Agendamento Automático</FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Defina datas para publicar e/ou despublicar este horário
            automaticamente
          </span>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <DatePicker
            label="Publicar a partir de"
            value={formik.values.startDate}
            onChange={(newValue) => formik.setFieldValue('startDate', newValue)}
          />
          <DatePicker
            label="Despublicar a partir de"
            value={formik.values.endDate}
            onChange={(newValue) => formik.setFieldValue('endDate', newValue)}
          />
        </div>
      </div>
    </form>
  );
};
