import { Select, SelectItem } from '@/components/common/select';
import { FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { ClockIcon, CalendarIcon } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import type { useCreateMassSchedule } from '../use-create-mass-schedule';

interface InfoStepProps {
  formik: ReturnType<typeof useCreateMassSchedule>['formik'];
}

export const InfoFormStep = ({ formik }: InfoStepProps) => {
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
            value={String(formik.values.dayOfWeek ?? '')}
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
          <FieldLabel htmlFor="is-precept">Missa de Preceito</FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Missas de preceito são aquelas que os fiéis católicos têm obrigação
            de participar (ex: domingos e dias santos).
          </span>
        </div>
        <Switch
          id="is-precept"
          name="isPrecept"
          checked={formik.values.isPrecept}
          onCheckedChange={(newValue) =>
            formik.setFieldValue('isPrecept', newValue)
          }
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 pb-5">
        <div>
          <FieldLabel htmlFor="start-time">
            <ClockIcon className="text-zinc-400" />
            Horário da Missa
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Defina o horário de início da celebração.
          </span>
        </div>
        <div className="w-full">
          <span className="block mb-2 text-sm text-zinc-700 font-semibold">
            Horário de Início
          </span>
          <InputRoot>
            <InputControl
              id="start-time"
              name="startTime"
              type="time"
              value={formik.values.startTime}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 pb-5">
        <div>
          <FieldLabel htmlFor="date-range">Atendimento Automático</FieldLabel>
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
