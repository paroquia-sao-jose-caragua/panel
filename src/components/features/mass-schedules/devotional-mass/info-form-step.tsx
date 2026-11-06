import { Select, SelectItem } from '@/components/common/select';
import { FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { ClockIcon, CalendarIcon } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import type { useCreateMassSchedule } from '../use-create-mass-schedule';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface InfoStepProps {
  formik: ReturnType<typeof useCreateMassSchedule>['formik'];
}

export const InfoFormStep = ({ formik }: InfoStepProps) => {
  return (
    <form
      id="add-devotional-mass"
      className="flex w-full flex-col gap-8 divide-y divide-divider"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <FieldLabel htmlFor="title">Título da Devoção</FieldLabel>
        <div className="flex flex-col gap-2">
          <InputRoot helperText='Exemplo: "Sagrado Coração de Jesus"'>
            <InputControl
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="recurrence-type">
            <CalendarIcon className="text-zinc-400" />
            Quando Acontece
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Escolha como a devoção se repete ao longo do mês.
          </span>
        </div>

        <RadioGroup
          name="recurrenceType"
          value={formik.values.recurrenceType}
          onValueChange={(value) => formik.setFieldValue('recurrenceType', value)}
          className="flex flex-col gap-4"
        >
          <div className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 cursor-pointer">
            <RadioGroupItem value="weekly" id="rec-weekly" className="mt-1" />
            <label htmlFor="rec-weekly" className="flex-1 cursor-pointer">
              <span className="block font-semibold text-zinc-800 text-sm">
                Semanalmente (em dias específicos)
              </span>
              <span className="block text-zinc-500 text-sm mt-0.5">
                Exemplo: Todas as terças-feiras ou todas as sextas-feiras
              </span>
            </label>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 cursor-pointer">
            <RadioGroupItem value="week-of-month" id="rec-week-of-month" className="mt-1" />
            <label htmlFor="rec-week-of-month" className="flex-1 cursor-pointer">
              <span className="block font-semibold text-zinc-800 text-sm">
                Em uma semana específica do mês
              </span>
              <span className="block text-zinc-500 text-sm mt-0.5">
                Exemplo: 1ª sexta-feira do mês, 1º sábado do mês
              </span>
            </label>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 cursor-pointer">
            <RadioGroupItem value="monthly" id="rec-monthly" className="mt-1" />
            <label htmlFor="rec-monthly" className="flex-1 cursor-pointer">
              <span className="block font-semibold text-zinc-800 text-sm">
                Em um dia fixo do mês
              </span>
              <span className="block text-zinc-500 text-sm mt-0.5">
                Exemplo: Todo dia 19 de cada mês
              </span>
            </label>
          </div>
        </RadioGroup>

        {formik.values.recurrenceType === 'weekly' && (
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-100">
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
        )}

        {formik.values.recurrenceType === 'week-of-month' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-100">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-zinc-700 font-semibold">
                Semana do mês
              </Label>
              <Select
                name="weekOfMonth"
                placeholder="Selecione a semana"
                value={String(formik.values.weekOfMonth ?? '')}
                onValueChange={(newValue: string) => {
                  formik.setFieldValue('weekOfMonth', Number(newValue));
                }}
              >
                <SelectItem value="1" text="1ª Semana" />
                <SelectItem value="2" text="2ª Semana" />
                <SelectItem value="3" text="3ª Semana" />
                <SelectItem value="4" text="4ª Semana" />
                <SelectItem value="5" text="Última Semana" />
              </Select>
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
        )}

        {formik.values.recurrenceType === 'monthly' && (
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-100">
            <Label className="text-sm text-zinc-700 font-semibold">
              Dia do mês (1 a 31)
            </Label>
            <InputRoot>
              <InputControl
                name="dayOfMonth"
                type="number"
                min={1}
                max={31}
                value={formik.values.dayOfMonth || ''}
                onChange={formik.handleChange}
                placeholder="Exemplo: 19"
              />
            </InputRoot>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-row gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="is-precept">Missa de Preceito</FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Missas de preceito são aquelas que os fiéis católicos têm obrigação
            de participar.
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 pb-5">
        <div>
          <FieldLabel className="flex items-center gap-2">
            Orientações <Badge variant="secondary">Opcional</Badge>
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Essas orientações aparecerão na página de detalhes da devoção.
          </span>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Textarea
            name="orientations"
            value={formik.values.orientations || ''}
            onChange={formik.handleChange}
            placeholder="Exemplo: 'Trazer o terço, chegar 15 minutos antes, etc...'"
            maxLength={255}
            className="h-30 max-h-30"
          />
        </div>
      </div>
    </form>
  );
};
