'use client';

import { deleteEventSchedule } from '@/api/event-schedules/delete';
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
import type { EventSchedule } from '@/entities/CalendarSchedule';
import useCalendarStore from '@/stores/useCalendarStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { CircleDotIcon, MapPin, PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ScheduleItemProps {
  schedule: EventSchedule;
}

export const EventScheduleItem = ({ schedule }: ScheduleItemProps) => {
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const { removeEventSchedule } = useCalendarStore();

  const isMass = schedule.eventType === 'mass';

  const { mutate, isPending } = useMutation({
    mutationFn: deleteEventSchedule,
    networkMode: 'always',
  });

  const handleDelete = () => {
    mutate(schedule.eventScheduleId, {
      onSuccess: ({ statusCode, message }) => {
        if (statusCode === 200) {
          removeEventSchedule(schedule.eventScheduleId);
          setOpenConfirmCancel(false);
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
    });
  };

  return (
    <li className="group rounded-xl border border-brand-100 bg-brand-0 p-4 transition sm:p-5">
      <div className="flex items-start gap-4">
        <p className="font-mono text-sm tabular-nums text-muted-foreground">
          {schedule.startTime} — {schedule.endTime}
        </p>

        <Badge>
          <CircleDotIcon /> Evento Único
        </Badge>
      </div>

      <div className="mt-2 flex items-end justify-between gap-4 flex-wrap">
        <p className="text-base font-semibold text-foreground">
          {isMass ? 'Santa Missa' : schedule.title}
          {schedule.massType === 'devotional'
            ? ` Devocional - ${schedule.title}`
            : ''}
          {schedule.massType === 'solemnity'
            ? ` Solene - ${schedule.title}`
            : ''}
        </p>
        {schedule.orientations && (
          <p className="mt-1 text-sm text-muted-foreground">
            {schedule.orientations}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-brand-100/50 pt-3">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
          {schedule.community.type === 'parish_church'
            ? 'Paróquia '
            : 'Capela '}
          {schedule.community.name}
          <MapPin className="h-3 w-3" />
        </span>

        <div className="flex flex-row gap-4">
          <Dialog open={openConfirmCancel} onOpenChange={setOpenConfirmCancel}>
            <form>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
                >
                  Excluir
                  <Trash2Icon className="h-3 w-3" />
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Excluir Agendamento</DialogTitle>

                  <DialogDescription>
                    Por favor, confirme os dados abaixo para garantir que está
                    excluindo o compromisso correto.
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
                      {isMass && schedule?.massType === 'devotional'
                        ? ' (Devocional)'
                        : ''}
                      {schedule?.massType === 'solemnity'
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
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Excluir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <Link
            href={`/calendar/event-schedule/${schedule.eventScheduleId}/edit`}
          >
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              Editar
              <PencilIcon className="h-3 w-3" />
            </button>
          </Link>
        </div>
      </div>
    </li>
  );
};
