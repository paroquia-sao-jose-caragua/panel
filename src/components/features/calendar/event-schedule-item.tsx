'use client';

import { deleteEventSchedule } from '@/api/event-schedules/delete';
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
import {
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ChurchAvatar } from '../churches/church-avatar';

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
            </div>

            {/* Event Type Badge */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80">
              <CalendarDays className="w-3 h-3 text-blue-600" />
              <span>{isMass ? 'Missa Pontual' : 'Evento Pontual'}</span>
            </span>

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
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
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
            {isMass ? 'Santa Missa' : schedule.title}
            {schedule.massType === 'devotional' && schedule.title && isMass
              ? ` Devocional — ${schedule.title}`
              : ''}
            {schedule.massType === 'solemnity' && schedule.title && isMass
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

      {/* Card Footer: Location & Actions */}
      <div className="mt-4 pt-3.5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
          <span className="font-medium text-zinc-700">
            {schedule.customLocation
              ? schedule.customLocation
              : `${schedule.community.type === 'parish_church' ? 'Paróquia ' : 'Capela '} ${schedule.community.name}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={openConfirmCancel} onOpenChange={setOpenConfirmCancel}>
            <form>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs h-8"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Excluir Agendamento</DialogTitle>

                  <DialogDescription>
                    Por favor, confirme os dados abaixo para garantir que está
                    excluindo o compromisso correto.
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
                      <span className="text-zinc-500 font-medium">Título:</span>
                      <span className="font-semibold text-zinc-900 text-right">
                        {schedule.title}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-zinc-500 font-medium">Local:</span>
                    <span className="font-semibold text-zinc-900 text-right">
                      {schedule.customLocation
                        ? schedule.customLocation
                        : `${schedule.community.type === 'parish_church' ? 'Paróquia ' : 'Capela '} ${schedule.community.name}`}
                    </span>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isPending}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Excluir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8"
          >
            <Link
              href={`/agenda/evento/${schedule.eventScheduleId}/editar`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar</span>
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
};
