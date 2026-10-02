'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarOff,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Info,
  Sparkles,
  AlertCircle,
  X,
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
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';
import type { AgentBlockedDate } from '@/entities/pastoral-agent';

export default function MinhaAgendaBloqueiosPage() {
  const { agent: myAgent, isPending: isAgentPending } = useMyPastoralAgent();
  const agentId = myAgent?.id || '';

  const {
    blockedDates,
    isPending: isBlockedPending,
    addBlockedDate,
    isAddingBlockedDate,
    removeBlockedDate,
    isRemovingBlockedDate,
  } = useAgentBlockedDates(agentId);

  const [showNewBlockForm, setShowNewBlockForm] = useState(false);
  const [blockMode, setBlockMode] = useState<'single' | 'period'>('single');
  const [timeMode, setTimeMode] = useState<'full_day' | 'specific'>('full_day');

  // Form values
  const [singleDate, setSingleDate] = useState(() =>
    dayjs().format('YYYY-MM-DD')
  );
  const [startDate, setStartDate] = useState(() =>
    dayjs().format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(() =>
    dayjs().add(3, 'day').format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('18:00');
  const [reason, setReason] = useState('');

  // Deletion state
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  // Filter ONLY future or today's blocks, sorted chronologically
  const futureBlocks = useMemo(() => {
    if (!blockedDates) return [];

    return blockedDates
      .filter((b) => b.blockedDate >= todayStr)
      .sort((a, b) => a.blockedDate.localeCompare(b.blockedDate));
  }, [blockedDates, todayStr]);

  const handleCreateBlock = async (e: React.FormEvent) => {
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

        showAlert('Bloqueio registrado com sucesso!');
      } else {
        // Period (range of dates)
        if (!startDate || !endDate) {
          showAlert('Informe as datas inicial e final do período.');
          return;
        }

        if (startDate > endDate) {
          showAlert('A data inicial não pode ser posterior à data final.');
          return;
        }

        // Iterate through all days in range
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

        showAlert(
          `Período bloqueado com sucesso (${datesToBlock.length} dias)!`
        );
      }

      // Reset form
      setShowNewBlockForm(false);
      setReason('');
    } catch {
      // Handled
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBlockId) return;
    try {
      await removeBlockedDate(deletingBlockId);
      setDeletingBlockId(null);
    } catch {
      // Handled
    }
  };

  const isInitialLoading = isAgentPending || isBlockedPending;

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Bloqueios de Agenda"
        backHref={ROUTES.MY_AGENDA.PROFILE}
      />

      <div className="px-4 pt-4 pb-12 space-y-5">
        {/* Intro */}
        <section className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-serif">
            Exceções e Bloqueios
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Bloqueie datas pontuais ou períodos inteiros (como férias, retiros ou
            imprevistos) para impedir novos atendimentos.
          </p>
        </section>

        {/* CTA to toggle new block form */}
        {!showNewBlockForm && (
          <Button
            type="button"
            onClick={() => setShowNewBlockForm(true)}
            className="w-full h-11 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-xs gap-2"
          >
            <Plus className="w-4 h-4 text-brand-300" />
            <span>Novo bloqueio</span>
          </Button>
        )}

        {/* New Block Form */}
        {showNewBlockForm && (
          <form
            onSubmit={handleCreateBlock}
            className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm space-y-4 animate-in fade-in-50 zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarOff className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-zinc-900">
                  Novo Bloqueio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewBlockForm(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Type Selection */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-700 block">
                Como deseja bloquear?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBlockMode('single')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none',
                    blockMode === 'single'
                      ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  )}
                >
                  Uma data
                </button>

                <button
                  type="button"
                  onClick={() => setBlockMode('period')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none',
                    blockMode === 'period'
                      ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  )}
                >
                  Período
                </button>
              </div>
            </div>

            {/* Step 2: Dates */}
            {blockMode === 'single' ? (
              <div>
                <label
                  htmlFor="block-single-date"
                  className="text-xs font-semibold text-zinc-700 block mb-1"
                >
                  Data *
                </label>
                <Input
                  id="block-single-date"
                  type="date"
                  min={todayStr}
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="block-start-date"
                    className="text-xs font-semibold text-zinc-700 block mb-1"
                  >
                    Data inicial *
                  </label>
                  <Input
                    id="block-start-date"
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="block-end-date"
                    className="text-xs font-semibold text-zinc-700 block mb-1"
                  >
                    Data final *
                  </label>
                  <Input
                    id="block-end-date"
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Time Range */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-zinc-700 block">
                Horário a bloquear
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimeMode('full_day')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none',
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
                    'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none',
                    timeMode === 'specific'
                      ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  )}
                >
                  Horário específico
                </button>
              </div>

              {timeMode === 'specific' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-0.5">
                      Horário inicial
                    </span>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-0.5">
                      Horário final
                    </span>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Reason */}
            <div>
              <label
                htmlFor="block-reason"
                className="text-xs font-semibold text-zinc-700 block mb-1"
              >
                Motivo *
              </label>
              <Input
                id="block-reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Férias, Retiro do Clero, Compromisso pessoal..."
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewBlockForm(false)}
                className="flex-1 h-11 text-xs rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isAddingBlockedDate}
                className="flex-1 h-11 text-xs font-semibold rounded-xl bg-brand-900 text-white hover:bg-brand-800"
              >
                {blockMode === 'period' ? 'Bloquear período' : 'Bloquear data'}
              </Button>
            </div>
          </form>
        )}

        {/* List of Future Blocks */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-zinc-900">
              Bloqueios agendados
            </h3>
            <span className="text-xs font-semibold text-zinc-400">
              {futureBlocks.length}{' '}
              {futureBlocks.length === 1 ? 'bloqueio' : 'bloqueios'}
            </span>
          </div>

          {isInitialLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          ) : futureBlocks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-zinc-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <CalendarOff className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-700">
                Nenhum bloqueio futuro cadastrado
              </p>
              <p className="text-xs text-zinc-400">
                Sua agenda seguirá normalmente a sua disponibilidade semanal recorrente.
              </p>
            </div>
          ) : (
            futureBlocks.map((block) => {
              const d = dayjs(block.blockedDate).locale('pt-br');
              const dateFormatted = d.format('DD [de] MMMM (ddd)');
              const capDate =
                dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
              const isFullDay = !block.startTime || !block.endTime;

              return (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                      <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{capDate}</span>
                    </div>

                    <p className="text-sm font-semibold text-zinc-800 truncate">
                      {block.reason || 'Indisponibilidade pastoral'}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>
                        {isFullDay
                          ? 'Dia inteiro'
                          : `${block.startTime} — ${block.endTime}`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeletingBlockId(block.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Remover bloqueio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={Boolean(deletingBlockId)}
        onOpenChange={(open) => !open && setDeletingBlockId(null)}
        onConfirm={handleConfirmDelete}
        title="Remover bloqueio de data"
        description="Tem certeza de que deseja remover este bloqueio? A data voltará a ficar disponível para novos agendamentos na paróquia."
      />
    </div>
  );
}
