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
import type { MassSchedule } from '@/entities/CalendarSchedule';
import useCalendarStore from '@/stores/useCalendarStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Clock, MapPin, RepeatIcon, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Select, SelectItem } from '@/components/common/select';
import useTranslator from '@/hooks/use-translator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChurchAvatar } from '../churches/church-avatar';

interface ScheduleItemProps {
  exceptionDate: string;
  schedule: MassSchedule;
}

export const MassScheduleItem = ({
  exceptionDate,
  schedule,
}: ScheduleItemProps) => {
  const { t } = useTranslator();

  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const { moveScheduleToException } = useCalendarStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createMassScheduleException,
    networkMode: 'always',
  });

  const formik = useFormik({
    initialValues: {
      reason: '' as `mass-schedule-cancel-reason-${1 | 2 | 3}`,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(
        {
          massScheduleId: schedule.massScheduleId,
          exceptionDate,
          startTime: schedule.startTime,
          reason: t(values.reason),
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
    <li className="group bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#D6A64A]/50 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Time, Badges, Church Avatar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Horário (sem parecer botão) */}
            <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-zinc-900">
              <Clock className="w-4 h-4 text-[#B8872E]" />
              <span>
                {schedule.startTime}
                {schedule.endTime ? ` — ${schedule.endTime}` : ''}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center text-zinc-400 hover:text-[#B8872E] cursor-help ml-0.5">
                    <RepeatIcon className="w-3.5 h-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Missa recorrente semanal</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Devotional Badge */}
            {schedule.massType === 'devotional' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Devocional</span>
              </span>
            )}

            {/* Solemnity Badge */}
            {schedule.massType === 'solemnity' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Solenidade</span>
              </span>
            )}

            {/* Precept Badge */}
            {schedule.isPrecept && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80">
                Preceito
              </span>
            )}
          </div>

          <ChurchAvatar
            name={schedule.community.name}
            coverUrl={schedule.community.coverUrl}
          />
        </div>

        {/* Content: Title & Orientations */}
        <div className="space-y-1">
          <h4
            className="text-lg sm:text-xl font-semibold text-zinc-900 leading-snug"
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

          {schedule.orientations && (
            <p className="text-xs sm:text-sm text-zinc-600 font-serif leading-relaxed">
              {schedule.orientations}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Location & Cancel Action */}
      <div className="mt-4 pt-3.5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
          <span className="font-medium text-zinc-700">
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
                variant="outline"
                size="sm"
                className="gap-1.5 text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs h-8"
              >
                <X className="w-3.5 h-3.5" />
                <span>Desmarcar</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Desmarcar Agendamento</DialogTitle>
                <DialogDescription>
                  Você está prestes a desmarcar um agendamento recorrente.
                  Confirme os dados abaixo.
                </DialogDescription>
              </DialogHeader>

              <div className="mx-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 mb-5 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Data:</span>
                  <span className="font-mono font-semibold text-zinc-900">
                    {dayjs(exceptionDate).locale('pt-br').format('D [de] MMMM')}
                  </span>
                </div>
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

              <FieldGroup className="px-4 pb-4 gap-2">
                <span className="block text-zinc-800 text-xs font-semibold">
                  Motivo do cancelamento
                </span>
                <Select
                  name="reason"
                  placeholder="Selecione o motivo do cancelamento"
                  value={formik.values.reason}
                  defaultValue="mass-schedule-cancel-reason-2"
                  onValueChange={(newValue) =>
                    formik.setFieldValue('reason', newValue)
                  }
                >
                  <SelectItem
                    value="mass-schedule-cancel-reason-1"
                    text={t('mass-schedule-cancel-reason-1')}
                  />
                  <SelectItem
                    value="mass-schedule-cancel-reason-2"
                    text={t('mass-schedule-cancel-reason-2')}
                  />
                  <SelectItem
                    value="mass-schedule-cancel-reason-3"
                    text={t('mass-schedule-cancel-reason-3')}
                  />
                </Select>
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
    </li>
  );
};
