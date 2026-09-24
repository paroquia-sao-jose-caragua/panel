'use client';

import { deleteMassScheduleException } from '@/api/mass-schedules/delete-exception';
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
import {
  AlertCircle,
  Clock,
  CornerRightUpIcon,
  MapPin,
  RepeatIcon,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    <li className="group bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between opacity-85 hover:opacity-100 hover:border-zinc-400">
      <div>
        {/* Top Header: Time, Badges, Church Avatar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Horário (sem parecer botão) */}
            <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-medium text-zinc-400 line-through">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>
                {schedule.startTime}
                {schedule.endTime ? ` — ${schedule.endTime}` : ''}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center text-zinc-400 cursor-help ml-0.5 no-underline">
                    <RepeatIcon className="w-3.5 h-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Missa recorrente cancelada nesta data</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Cancelled Badge */}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
              <XCircle className="w-3 h-3 text-rose-600" />
              <span>Cancelada nesta data</span>
            </span>
          </div>

          <div className="grayscale opacity-70">
            <ChurchAvatar
              name={schedule.community.name}
              coverUrl={schedule.community.coverUrl}
            />
          </div>
        </div>

        {/* Content: Title & Orientations / Reason */}
        <div className="space-y-1.5">
          <h4
            className="text-base sm:text-lg font-semibold text-zinc-500 line-through leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Santa Missa
            {schedule.massType === 'devotional' && schedule.title
              ? ` Devocional — ${schedule.title}`
              : ''}
            {schedule.massType === 'solemnity' && schedule.title
              ? ` Solene — ${schedule.title}`
              : ''}
          </h4>

          {schedule.exception?.reason && (
            <div className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50/80 border border-rose-200/70 rounded-lg px-2.5 py-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Motivo do cancelamento:</strong>{' '}
                {schedule.exception.reason}
              </span>
            </div>
          )}

          {schedule.orientations && (
            <p className="text-xs text-zinc-500 font-serif leading-relaxed">
              {schedule.orientations}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Location & Reschedule Action */}
      <div className="mt-4 pt-3.5 border-t border-zinc-200/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="font-medium text-zinc-500">
            {schedule.community.type === 'parish_church'
              ? 'Paróquia '
              : 'Capela '}
            {schedule.community.name}
          </span>
        </div>

        <Dialog open={openConfirmCancel} onOpenChange={setOpenConfirmCancel}>
          <form>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                className="gap-1.5 text-xs h-8 shadow-xs"
              >
                <CornerRightUpIcon className="w-3.5 h-3.5" />
                <span>Remarcar</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Remarcar Agendamento</DialogTitle>
                <DialogDescription>
                  Você está prestes a reativar o agendamento recorrente abaixo
                  para esta data. Confirme os dados.
                </DialogDescription>
              </DialogHeader>

              <div className="mx-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 mb-5 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Horário:</span>
                  <span className="font-mono font-semibold text-zinc-900">
                    {schedule.startTime}
                    {schedule.endTime ? ` — ${schedule.endTime}` : ''}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-zinc-500 font-medium">Tipo:</span>
                  <span className="font-semibold text-zinc-900 text-right">
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
                    <span className="text-zinc-500 font-medium">Título:</span>
                    <span className="font-semibold text-zinc-900 text-right">
                      {schedule.title}
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-zinc-500 font-medium">Local:</span>
                  <span className="font-semibold text-zinc-900 text-right">
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
