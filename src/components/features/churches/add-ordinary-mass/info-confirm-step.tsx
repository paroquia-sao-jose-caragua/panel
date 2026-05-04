import { TypographyH2 } from '@/components/ui/typography/h2';
import { Check } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { formatTimeDifference } from '@/utils/formatTime';
import { useCommunity } from '@/api/communities/use-community';

dayjs.locale('pt-br');

interface ConfirmStepProps {
  recurrenceType: 'weekly' | 'monthly';
  isPrecept: boolean;
  startDate: string;
  endDate?: string;
  times: { startTime: string; endTime: string }[];
}

export const InfoConfirmStep = ({
  recurrenceType,
  isPrecept,
  startDate,
  endDate,
  times,
}: ConfirmStepProps) => {
  const { community } = useCommunity();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 sm:py-8 flex flex-col gap-4 pb-5">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-0 text-brand-700">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <TypographyH2 className="text-center">Confirmação</TypographyH2>
          <p className="text-center text-zinc-600 mt-3">
            Revise as informações antes de adicionar
          </p>
        </div>
        <div className="w-full max-w-100 divide-y divide-divider">
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Igreja</span>
            <span className="text-right font-medium">{community?.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Tipo</span>
            <span className="text-right font-medium">Missa Regular</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Recorrência</span>
            <span className="text-right font-medium">
              {recurrenceType === 'weekly' ? 'Semanal' : 'Mensal'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Missa de Preceito</span>
            <span
              className={`text-right font-medium ${isPrecept ? 'text-green-600' : ''}`}
            >
              {isPrecept ? 'Sim' : 'Não'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Data de Publicação</span>
            <span className="text-right font-medium">
              {dayjs(startDate).format('DD/MM/YYYY')}
            </span>
          </div>
          {endDate && (
            <div className="grid grid-cols-2 gap-4 pt-6 py-3">
              <span className="text-zinc-600">Data de Despublicação</span>
              <span className="text-right font-medium">
                {dayjs(endDate).format('DD/MM/YYYY')}
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">
              Horários {`(${times.length})`}
            </span>
            <span />
            <div className="space-y-3 col-span-2">
              {times.map((time) => (
                <div
                  key={time.startTime}
                  className="flex flex-row items-center justify-between bg-brand-0 px-3 py-3 rounded-lg border border-brand-50"
                >
                  <span className="flex-1 text-md font-medium text-brand-800">
                    {time.startTime} - {time.endTime}
                  </span>
                  <span className="text-xs text-brand-700 bg-brand-50 py-1 px-2 rounded">
                    {formatTimeDifference(time.startTime, time.endTime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
