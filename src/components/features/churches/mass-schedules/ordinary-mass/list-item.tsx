import { deleteMassSchedule } from '@/api/mass-schedules/delete';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { MassSchedule } from '@/entities/MassSchedule';
import useTranslator from '@/hooks/use-translator';
import useCommunityStore from '@/stores/useCommunityStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';

interface ListItemProps {
  massSchedule: MassSchedule;
}

export const ListItem = ({ massSchedule }: ListItemProps) => {
  const { t } = useTranslator();
  const { community, removeMassSchedule } = useCommunityStore();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMassSchedule,
    networkMode: 'always',
  });

  const handleDeleteMassSchedule = useCallback(() => {
    mutate(
      { massScheduleId: massSchedule.id },
      {
        onSuccess: ({ statusCode }) => {
          if (statusCode === 200) {
            removeMassSchedule(massSchedule.id);
          } else {
            showAlert(
              'Não foi possível excluir o horário de missa. Tente novamente mais tarde.'
            );
          }
        },
        onError: () => {
          showAlert(
            'Não foi possível excluir o horário de missa. Tente novamente mais tarde.'
          );
        },
      }
    );
  }, [massSchedule, mutate, removeMassSchedule]);

  return (
    <div
      key={massSchedule.id}
      className="cursor:pointer flex flex-row items-center justify-between bg-brand-0 pl-4 pr-2 py-4 rounded-xl border border-brand-50"
    >
      <span className="text-md font-medium text-zinc-700">
        {massSchedule.recurrenceType === 'weekly' &&
        massSchedule.dayOfWeek !== undefined
          ? t(`week-day-${massSchedule.dayOfWeek}`)
          : null}
      </span>
      <div className="flex items-center">
        <span className="text-md font-medium text-brand-800">
          {massSchedule.times.map((time) => time.startTime).join(', ')}
        </span>
        <Link
          href={`/${community?.slug}/ordinary-mass/${massSchedule.id}/edit`}
          className="ml-2"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon-lg">
                <PencilIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Editar</p>
            </TooltipContent>
          </Tooltip>
        </Link>

        <Dialog>
          <DialogTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon-lg">
                  <Trash2Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Excluir</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir horário de missa?</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. Todas as informações
                relacionadas a este horário de missa serão perdidas.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={handleDeleteMassSchedule}
                  disabled={isPending}
                >
                  Excluir
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
