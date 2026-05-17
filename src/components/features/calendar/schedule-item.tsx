'use client';

import { createMassScheduleException } from '@/api/mass-schedules/create-exception';
import { Button } from '@/components/ui/button';
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
import { FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CalendarSchedule } from '@/entities/CalendarSchedule';
import useCalendarStore from '@/stores/useCalendarStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { MapPin, X } from 'lucide-react';
import { useState } from 'react';

type Schedule =
  | CalendarSchedule['schedules']['active'][number]
  | CalendarSchedule['schedules']['exceptions'][number];

interface ScheduleItemProps {
  exceptionDate: string;
  schedule: Schedule;
}

export const ScheduleItem = ({
  exceptionDate,
  schedule,
}: ScheduleItemProps) => {
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const { moveScheduleToException } = useCalendarStore();

  const isMass = schedule.type === 'mass' || schedule.eventType === 'mass';

  const { mutate, isPending } = useMutation({
    mutationFn: createMassScheduleException,
    networkMode: 'always',
  });

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    onSubmit: (values) => {
      if (schedule.type !== 'mass') return;

      mutate(
        {
          massScheduleId: schedule.massScheduleId,
          exceptionDate,
          startTime: schedule.startTime,
          reason: values.reason,
        },
        {
          onSuccess: ({
            massScheduleException,
            statusCode,
            errors,
            message,
          }) => {
            if (massScheduleException) {
              moveScheduleToException(massScheduleException);
              setOpenConfirmCancel(false);
              formik.resetForm();
            } else if (statusCode === 400 && errors) {
              for (const error of errors) {
                formik.setFieldError(error.field, error.message);
              }
            } else {
              showAlert(
                message ||
                  'Ocorreu um erro ao tentar desmarcar a missa. Tente novamente mais tarde.'
              );
            }
          },
          onError: (error) => {
            showAlert(
              'Ocorreu um erro ao tentar desmarcar a missa. Tente novamente mais tarde.'
            );
            console.error(error);
          },
        }
      );
    },
  });

  const handleCancel = () => {
    formik.submitForm();
  };

  return (
    <li className="group rounded-xl border border-brand-100 bg-brand-0 p-4 transition sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm tabular-nums text-muted-foreground">
          {schedule.startTime} — {schedule.endTime}
        </p>

        <Dialog open={openConfirmCancel} onOpenChange={setOpenConfirmCancel}>
          <form>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
              >
                Desmarcar
                <X className="h-3 w-3" />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Desmarcar Agendamento</DialogTitle>

                <DialogDescription>
                  Você está prester a desmarcar o agendamento abaixo. Confirme
                  os dados e informe o motivo do cancelamento.
                </DialogDescription>
              </DialogHeader>

              <div className="mx-4 rounded-lg border border-brand-100 bg-brand-0 p-3 mb-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Horário:
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {schedule.startTime} — {schedule.endTime}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tipo:
                  </span>
                  <span className="text-sm font-medium text-foreground text-right">
                    {isMass ? 'Santa Missa' : 'Compromisso Eventual'}
                    {schedule.type === 'mass' &&
                    schedule.massType === 'devotional'
                      ? ' (Devocional)'
                      : ''}
                    {schedule.type === 'mass' &&
                    schedule.massType === 'solemnity'
                      ? ' (Solenidade)'
                      : ''}
                  </span>
                </div>

                {schedule.title && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Título:
                    </span>
                    <span className="text-sm font-medium text-foreground text-right">
                      {schedule.title}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Local:
                  </span>
                  <span className="text-sm font-medium text-foreground text-right">
                    {schedule.community.type === 'parish_church'
                      ? 'Paróquia '
                      : 'Capela '}
                    {schedule.community.name}
                  </span>
                </div>
              </div>

              <FieldGroup className="px-4 pb-4 gap-2">
                <Label
                  htmlFor="reason"
                  className="text-sm text-zinc-700 font-semibold"
                >
                  Motivo do Cancelamento
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Digite o motivo do cancelamento aqui..."
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Desmarcar
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="mt-1 text-base font-semibold text-foreground">
            {isMass ? 'Santa Missa' : schedule.title}
            {schedule.type === 'mass' && schedule.massType === 'devotional'
              ? ' (Devocional)'
              : ''}
            {schedule.type === 'mass' && schedule.massType === 'solemnity'
              ? ' (Solenidade)'
              : ''}
          </p>
          {schedule.orientations && (
            <p className="mt-1 text-sm text-muted-foreground">
              {schedule.orientations}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            {schedule.community.type === 'parish_church'
              ? 'Paróquia '
              : 'Capela '}
            {schedule.community.name}
            <MapPin className="h-3 w-3" />
          </span>
        </div>
      </div>
    </li>
  );
};
