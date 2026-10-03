'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarOff,
  Calendar,
  Clock,
  Sparkles,
  Info,
  FileText,
  AlertCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  useMyPastoralAgent,
  useAgentBlockedDates,
} from '@/api/appointments/use-appointments';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';

function NovoBloqueioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryDate = searchParams?.get('date');

  const { agent: myAgent, isPending: isAgentPending } = useMyPastoralAgent();
  const agentId = myAgent?.id || '';

  const { addBlockedDate, isAddingBlockedDate } =
    useAgentBlockedDates(agentId);

  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  const initialDate = useMemo(() => {
    if (queryDate && dayjs(queryDate).isValid() && queryDate >= todayStr) {
      return queryDate;
    }
    return todayStr;
  }, [queryDate, todayStr]);

  // Form states
  const [blockMode, setBlockMode] = useState<'single' | 'period'>('single');
  const [timeMode, setTimeMode] = useState<'full_day' | 'specific'>('full_day');
  const [singleDate, setSingleDate] = useState(initialDate);
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(() =>
    dayjs(initialDate).add(3, 'day').format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('18:00');
  const [reason, setReason] = useState('');

  const commonReasons = [
    'Férias',
    'Retiro do Clero',
    'Compromisso pessoal',
    'Enfermaria / Médico',
    'Viagem pastoral',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agentId) {
      showAlert('Agente pastoral não identificado.');
      return;
    }

    const blockStartTime = timeMode === 'specific' ? startTime : null;
    const blockEndTime = timeMode === 'specific' ? endTime : null;
    const blockReason = reason.trim() || 'Indisponibilidade pastoral';

    try {
      if (blockMode === 'single') {
        if (!singleDate) {
          showAlert('Informe a data a ser bloqueada.');
          return;
        }

        await addBlockedDate({
          blockedDate: singleDate,
          startTime: blockStartTime,
          endTime: blockEndTime,
          reason: blockReason,
        });
      } else {
        if (!startDate || !endDate) {
          showAlert('Informe as datas inicial e final do período.');
          return;
        }

        if (startDate > endDate) {
          showAlert('A data inicial não pode ser posterior à data final.');
          return;
        }

        let cur = dayjs(startDate);
        const end = dayjs(endDate);
        const datesToBlock: string[] = [];

        while (cur.isBefore(end) || cur.isSame(end, 'day')) {
          datesToBlock.push(cur.format('YYYY-MM-DD'));
          cur = cur.add(1, 'day');
        }

        for (const dateStr of datesToBlock) {
          await addBlockedDate({
            blockedDate: dateStr,
            startTime: blockStartTime,
            endTime: blockEndTime,
            reason: blockReason,
          });
        }
      }

      router.push(ROUTES.MY_AGENDA.SETTINGS.BLOCKS);
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Novo Bloqueio"
        backHref={ROUTES.MY_AGENDA.SETTINGS.BLOCKS}
      />

      <div className="px-4 pt-4 pb-28">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Card 1: Tipo de Bloqueio */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <CalendarOff className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                1. Tipo de bloqueio
              </h2>
            </div>
            <p className="text-xs text-zinc-500">
              Escolha se deseja bloquear um dia específico ou um intervalo de datas contínuo.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setBlockMode('single')}
                className={cn(
                  'py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none flex flex-col items-center gap-1',
                  blockMode === 'single'
                    ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                )}
              >
                <span>Uma data</span>
                <span
                  className={cn(
                    'text-[10px] font-normal',
                    blockMode === 'single' ? 'text-brand-300' : 'text-zinc-400'
                  )}
                >
                  Bloqueio pontual
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBlockMode('period')}
                className={cn(
                  'py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none flex flex-col items-center gap-1',
                  blockMode === 'period'
                    ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                )}
              >
                <span>Período</span>
                <span
                  className={cn(
                    'text-[10px] font-normal',
                    blockMode === 'period' ? 'text-brand-300' : 'text-zinc-400'
                  )}
                >
                  Férias / Retiro
                </span>
              </button>
            </div>
          </div>

          {/* Card 2: Datas */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                2. Datas a bloquear
              </h2>
            </div>

            {blockMode === 'single' ? (
              <div>
                <label
                  htmlFor="single-date"
                  className="text-xs font-semibold text-zinc-700 block mb-1"
                >
                  Data do bloqueio *
                </label>
                <Input
                  id="single-date"
                  type="date"
                  value={singleDate}
                  min={todayStr}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="h-11 rounded-xl text-sm"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="start-date"
                    className="text-xs font-semibold text-zinc-700 block mb-1"
                  >
                    Data inicial *
                  </label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    min={todayStr}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="text-xs font-semibold text-zinc-700 block mb-1"
                  >
                    Data final *
                  </label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    min={startDate || todayStr}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Horário */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                3. Horário do bloqueio
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTimeMode('full_day')}
                className={cn(
                  'py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none',
                  timeMode === 'full_day'
                    ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                )}
              >
                Dia inteiro
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('specific')}
                className={cn(
                  'py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none',
                  timeMode === 'specific'
                    ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                )}
              >
                Horário específico
              </button>
            </div>

            {timeMode === 'specific' && (
              <div className="grid grid-cols-2 gap-3 pt-1 animate-in fade-in-50 duration-150">
                <div>
                  <span className="text-xs font-medium text-zinc-600 block mb-1">
                    Horário inicial *
                  </span>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-11 text-sm rounded-xl"
                    required
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-zinc-600 block mb-1">
                    Horário final *
                  </span>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-11 text-sm rounded-xl"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Motivo */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-800" />
              <h2 className="text-sm font-bold text-zinc-900">
                4. Motivo do bloqueio
              </h2>
            </div>

            <div>
              <Input
                id="block-reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Férias, Retiro do Clero, Compromisso pessoal..."
                className="h-11 text-sm rounded-xl"
                required
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="pt-1">
              <span className="text-[11px] text-zinc-400 font-medium block mb-1.5">
                Sugestões rápidas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonReasons.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setReason(item)}
                    className={cn(
                      'text-[11px] px-2.5 py-1 rounded-full border transition active:scale-95 cursor-pointer',
                      reason === item
                        ? 'bg-brand-900 text-white border-brand-900 font-semibold'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Informational Note */}
          <div className="p-3.5 rounded-2xl bg-zinc-100/80 border border-zinc-200/80 flex items-start gap-2.5 text-xs text-zinc-600">
            <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Durante o período de bloqueio, os fiéis não conseguirão agendar horários
              com você pelo site da paróquia.
            </p>
          </div>

          {/* Fixed Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 py-3">
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-12 rounded-2xl text-sm font-semibold border-zinc-200 hover:bg-zinc-50 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isAddingBlockedDate}
                className="flex-1 h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-md active:scale-[0.99] cursor-pointer"
              >
                {blockMode === 'period' ? 'Bloquear período' : 'Bloquear data'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MinhaAgendaNovoBloqueioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-1 p-4 space-y-4">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      }
    >
      <NovoBloqueioContent />
    </Suspense>
  );
}
