'use client';

import { deleteMassScheduleException } from '@/api/mass-schedules/delete-exception';
import { Badge } from '@/components/ui/badge';
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
import type { ExceptionSchedule } from '@/entities/CalendarSchedule';
import useCalendarStore from '@/stores/useCalendarStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { CornerRightUpIcon, MapPin, RepeatIcon } from 'lucide-react';
import { useState } from 'react';
import { ChurchAvatar } from '../churches/church-avatar';

interface ScheduleExceptionItemProps {
  schedule: ExceptionSchedule;
}

export const MassScheduleExceptionItem = ({
  schedule,
}: ScheduleExceptionItemProps) => {
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const { moveExceptionToSchedule } = useCalendarStore();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMassScheduleException,
    networkMode: 'always',
  });

  const handleCancel = () => {
    mutate(
      {
        exceptionId: schedule.exception.id,
      },
      {
        onSuccess: ({ statusCode, message }) => {
          if (statusCode === 200) {
            moveExceptionToSchedule(schedule.exception);
            setOpenConfirmCancel(false);
          } else {
            showAlert(
              message ||
                'Ocorreu um erro ao tentar remarcar a missa. Tente novamente mais tarde.'
            );
          }
        },
        onError: (error) => {
          showAlert(
            'Ocorreu um erro ao tentar remarcar a missa. Tente novamente mais tarde.'
          );
          console.error(error);
        },
      }
    );
  };

  return (
    <li className="group rounded-xl border border-zinc-200/60 bg-zinc-100/60 p-4 transition sm:p-5 -z-10">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-4">
          <p className="font-mono text-sm tabular-nums text-muted-foreground/80">
            {schedule.startTime} — {schedule.endTime}
          </p>

          <Badge>
            <RepeatIcon />
            Recorrente
          </Badge>
        </div>

        <ChurchAvatar
          name={schedule.community.name}
          coverUrl={schedule.community.coverUrl}
        />
      </div>

      <div className="flex flex-col items-start gap-2 flex-wrap">
        <p className="text-base font-semibold text-foreground">
          Santa Missa
          {schedule.massType === 'devotional'
            ? ` Devocional - ${schedule.title}`
            : ''}
          {schedule.massType === 'solemnity'
            ? ` Solene - ${schedule.title}`
            : ''}
        </p>
        {schedule.orientations && (
          <p className="text-sm text-muted-foreground">
            {schedule.orientations}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-100/50 pt-3">
        <span className="text-xs font-medium text-primary">
          <MapPin className="h-3 w-3 inline mb-0.5" />{' '}
          {schedule.community.type === 'parish_church'
            ? 'Paróquia '
            : 'Capela '}
          {schedule.community.name}
        </span>

        <Dialog open={openConfirmCancel} onOpenChange={setOpenConfirmCancel}>
          <form>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-brand-700 px-2.5 py-1 text-xs font-medium text-white transition hover:opacity-80"
              >
                Remarcar
                <CornerRightUpIcon className="h-3 w-3" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Remarcar Agendamento</DialogTitle>
                <DialogDescription>
                  Você está prestes a remarcar o agendamento abaixo. Confirme os
                  dados.
                </DialogDescription>
              </DialogHeader>

              <div className="mx-4 rounded-lg border border-brand-500/30 bg-brand-0/50 p-3 mb-5 space-y-2">
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
                    Santa Missa
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Remarcar
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </li>
  );
};
