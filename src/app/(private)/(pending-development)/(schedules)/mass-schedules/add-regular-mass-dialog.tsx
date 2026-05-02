import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormik } from 'formik';
import { PlusIcon, Trash2 } from 'lucide-react';
import React from 'react';

export interface AddRegularMassDialogProps {
  community: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    type: 'parish_church' | 'chapel';
    address: string;
    coverId: string;
    coverUrl: string;
  };
}

export default function AddRegularMassDialog({
  community,
}: AddRegularMassDialogProps) {
  const timeRef = React.useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      recurrenceType: 'monthly',
      dayOfWeek: 0,
      times: [] as string[],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adicionar Missa Regular</DialogTitle>
          <DialogDescription>
            Configure uma nova missa regular para a comunidade selecionada.
          </DialogDescription>
        </DialogHeader>
        <form className="p-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                Comunidade
              </FieldLabel>
              <Select defaultValue={community.id} disabled>
                <SelectTrigger id="checkout-exp-month-ts6">
                  <SelectValue placeholder={community.name} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={community.id} disabled>
                      {community.name}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="recurrence-type">
                Tipo de Recorrência
              </FieldLabel>
              <RadioGroup
                name="recurrenceType"
                defaultValue="monthly"
                value={formik.values.recurrenceType}
                className="w-fit"
                onValueChange={(newValue) =>
                  formik.setFieldValue('recurrenceType', newValue)
                }
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="weekly" id="r1" />
                  <Label htmlFor="r1">Dia da semana</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="monthly" id="r2" />
                  <Label htmlFor="r2">Dia do mês</Label>
                </div>
              </RadioGroup>
            </Field>
            {formik.values.recurrenceType === 'weekly' && (
              <Field>
                <FieldLabel htmlFor="day-of-week">Dia da Semana</FieldLabel>
                <FieldGroup className="grid grid-cols-3 gap-3">
                  <Field orientation="horizontal">
                    <Checkbox id="sunday" name="sunday" value={0} />
                    <Label htmlFor="sunday">Domingo</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="monday" name="monday" value={1} />
                    <Label htmlFor="monday">Segunda</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="tuesday" name="tuesday" value={2} />
                    <Label htmlFor="tuesday">Terça</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="wednesday" name="wednesday" value={3} />
                    <Label htmlFor="wednesday">Quarta</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="thursday" name="thursday" value={4} />
                    <Label htmlFor="thursday">Quinta</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="friday" name="friday" value={5} />
                    <Label htmlFor="friday">Sexta</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="saturday" name="saturday" value={6} />
                    <Label htmlFor="saturday">Sábado</Label>
                  </Field>
                </FieldGroup>
              </Field>
            )}
            {formik.values.recurrenceType === 'monthly' && (
              <Field>
                <FieldLabel htmlFor="day-of-month">Dia do Mês</FieldLabel>
                <Input
                  id="day-of-month"
                  name="dayOfMonth"
                  type="number"
                  inputMode="numeric"
                  placeholder="Digite o dia do mês"
                />
                <FieldDescription>Exemplo: Todo dia 19 do mês</FieldDescription>
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="time">Horários</FieldLabel>
              {formik.values.times.length > 0 && (
                <div>
                  {formik.values.times.map((time) => (
                    <div
                      key={time}
                      className="flex items-center justify-between gap-2"
                    >
                      <span>{time}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
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
              )}
              <Input
                ref={timeRef}
                type="time"
                id="time-picker-optional"
                className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    const time = (e.target as HTMLInputElement).value;
                    if (time && !formik.values.times.includes(time)) {
                      formik.setFieldValue('times', [
                        ...formik.values.times,
                        time,
                      ]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => {
                  const time = timeRef.current?.value;

                  if (
                    time &&
                    timeRef.current?.value &&
                    !formik.values.times.includes(time)
                  ) {
                    formik.setFieldValue('times', [
                      ...formik.values.times,
                      time,
                    ]);

                    timeRef.current.value = '';
                  }
                }}
              >
                <PlusIcon />
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
