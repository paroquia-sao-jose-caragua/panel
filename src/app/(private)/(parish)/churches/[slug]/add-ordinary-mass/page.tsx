'use client';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/Form/Input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormik } from 'formik';
import { Calendar, Clock, PlusIcon, Trash2 } from 'lucide-react';
import React from 'react';
import { useCommunity } from '@/api/communities/use-community';
import { Spinner } from '@/components/Loadings/Spinner';
import { ImagePreview } from '@/components/Form/FileInput/ImagePreview';
import { createMassSchedule } from '@/api/communities/mass-schedules/create';
import { useMutation } from '@tanstack/react-query';
import { Select } from '@/components/Form/Select';
import { SelectItem } from '@/components/Form/Select/SelectItem';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { TypographyH2 } from '@/components/typography/h2';
import { Separator } from '@/components/ui/separator';
import { Step } from '@/components/ui/stepper';

export default function AddRegularMassPage() {
  const startTimeRef = React.useRef<HTMLInputElement>(null);
  const endTimeRef = React.useRef<HTMLInputElement>(null);

  const [steps, setSteps] = React.useState([
    {
      id: 'info',
      title: 'Informações',
      description:
        'Defina as informações básicas dessa missa regular, como os horários e o tipo de recorrência.',
      completed: false,
      isActive: true,
    },
    {
      id: 'confirmation',
      title: 'Confirmação',
      description:
        'Revise as informações dessa missa regular e confirme a criação.',
      completed: false,
      isActive: false,
    },
  ]);

  const { community } = useCommunity();

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: createMassSchedule,
  });

  const formik = useFormik({
    initialValues: {
      isPrecept: false,
      recurrenceType: 'weekly',
      times: [],
    } as {
      isPrecept: boolean;
      recurrenceType: 'weekly' | 'monthly';
      dayOfWeek?: number;
      dayOfMonth?: number;
      times: { startTime: string; endTime: string }[];
    },
    onSubmit: (values) => {
      mutate({
        communityId: community?.id as string,
        type: 'ordinary',
        isPrecept: values.isPrecept,
        recurrenceType: values.recurrenceType,
        dayOfWeek: values.dayOfWeek,
        dayOfMonth: values.dayOfMonth,
        times: values.times,
      });
    },
  });

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-16.25 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href={`/churches/${community?.slug}`} />

          <div className="flex flex-row items-center gap-4">
            <ImagePreview url={community?.coverUrl} className="h-20 w-24" />

            <div>
              <TypographyH2 className="pb-1">
                Adicionar Missa Regular
              </TypographyH2>
              <span className="text-md font-medium">{community?.name}</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-row items-center justify-center sm:justify-start gap-8 mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <Step step={1} label="Informações" />
          <Separator className="flex-1 max-w-20" />
          <Step variant="pending" step={2} label="Confirmação" />
        </div>
      </header>

      <main className="w-full max-w-200 px-4 pt-8 pb-12 mx-auto lg:px-8">
        <form
          id="add-ordinary-mass"
          className="flex w-full flex-col gap-5 divide-y divide-divider"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
            <div className="flex-1">
              <FieldLabel htmlFor="recurrence-type">
                Tipo de Recorrência
              </FieldLabel>
              <span className="block text-zinc-600 mt-2">
                Escolha se essa missa acontece toda semana no mesmo dia ou todo
                mês no mesmo dia.
              </span>
            </div>

            <RadioGroup
              name="recurrenceType"
              defaultValue="monthly"
              value={formik.values.recurrenceType}
              className="w-full"
              onValueChange={(newValue) =>
                formik.setFieldValue('recurrenceType', newValue)
              }
            >
              <div
                className={`flex items-center gap-4 border-2 ${formik.values.recurrenceType === 'weekly' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
              >
                <RadioGroupItem value="weekly" id="r1" />

                <Label
                  htmlFor="r1"
                  className="flex flex-col items-start text-zinc-700 text-md font-semibold gap-0"
                >
                  Dia da semana
                  <span className="block text-sm text-zinc-500 font-normal">
                    Toda semana no mesmo dia (ex: todo domingo)
                  </span>
                </Label>
              </div>

              <div
                className={`flex items-center gap-3 border-2 ${formik.values.recurrenceType === 'monthly' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
              >
                <RadioGroupItem value="monthly" id="r2" />

                <Label
                  htmlFor="r2"
                  className="flex flex-col items-start text-zinc-700 text-md font-medium gap-0"
                >
                  Dia do mês
                  <span className="block text-sm text-zinc-500 font-normal">
                    Todo mês no mesmo dia (ex: dia 19 de cada mês)
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formik.values.recurrenceType === 'weekly' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
              <FieldLabel htmlFor="day-of-week">
                <Calendar className="text-zinc-400" />
                Quando
              </FieldLabel>
              <div className="flex flex-col gap-3">
                <Label className="text-md text-zinc-600 font-medium">
                  Dia da semana
                </Label>
                <Select
                  name="type"
                  placeholder="Selecione o dia"
                  defaultValue="chapel"
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
          )}

          {formik.values.recurrenceType === 'monthly' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
              <FieldLabel htmlFor="day-of-month">
                <Calendar className="text-zinc-400" />
                Quando
              </FieldLabel>
              <div className="flex flex-col gap-3">
                <Label className="text-md text-zinc-600 font-medium">
                  Dia do mês
                </Label>
                <InputRoot helperText='Exemplo: Digite 19 para "todo dia 19 do mês"'>
                  <InputControl
                    id="day-of-month"
                    name="dayOfMonth"
                    type="number"
                    inputMode="numeric"
                    max={31}
                    min={1}
                    value={formik.values.dayOfMonth}
                    onChange={formik.handleChange}
                  />
                </InputRoot>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-row gap-4 pb-5">
            <div className="flex-1">
              <FieldLabel htmlFor="day-of-month">Missa de Preceito</FieldLabel>
              <span className="block text-zinc-600 mt-2">
                Missas de preceito são aquelas que os fiéis católicos têm
                obrigação de participar (ex: domingos e dias santos).
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
            <div>
              <FieldLabel htmlFor="day-of-month">
                <Clock className="text-zinc-400" />
                Horários
              </FieldLabel>
              <span className="block text-zinc-600 mt-2">
                Você pode adicionar quantos horários quiser para esse
                agendamento (ex: 8h às 9h, 18h às 19h, etc).
              </span>
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-full flex flex-wrap gap-4 items-end">
                <div className="flex-1">
                  <span className="block text-sm mb-2">Início</span>
                  <InputRoot>
                    <InputControl ref={startTimeRef} type="time" />
                  </InputRoot>
                </div>
                <div className="flex-1">
                  <span className="block mb-2 text-sm">Fim</span>
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
                      <Clock className="h-10 w-10" />
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
                  <div className="divide-y divide-divider space-y-2">
                    {formik.values.times.map((time) => (
                      <div
                        key={time.startTime}
                        className="flex flex-row items-center justify-between pb-2 last:pb-0"
                      >
                        <span className="flex-1 text-md font-normal text-zinc-700">
                          {time.startTime} - {time.endTime}
                        </span>
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
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
          <Link href={`/churches/${community?.slug}`}>
            <Button variant="outline" size="lg" disabled={isPending}>
              Cancelar
            </Button>
          </Link>
          <Button size="lg" disabled={isPending} onClick={formik.submitForm}>
            {isPending ? (
              <Spinner className="border-brand-300 border-2 w-5 h-5" />
            ) : (
              'Continuar'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
