'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  CalendarOff,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Filter,
  User,
  AlertCircle,
  CalendarDays,
  X,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectItem } from '@/components/common/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { BackButton } from '@/components/common/back-button';
import {
  usePastoralAgents,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import {
  getAgentBlockedDates,
  addAgentBlockedDate,
  removeAgentBlockedDate,
} from '@/api/appointments/agents';
import type { AgentBlockedDate, PastoralAgent } from '@/entities/pastoral-agent';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function BloqueiosPage() {
  const searchParams = useSearchParams();
  const shouldOpenNew = searchParams.get('novo') === 'true';
  const queryAgentId = searchParams.get('agentId');

  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';
  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents, isPending: isLoadingAgents } = usePastoralAgents();

  const queryClient = useQueryClient();

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    queryAgentId || (isPastoralAgent && myAgent ? myAgent.id : 'all')
  );

  // Sync myAgent if user is pastoral_agent
  useEffect(() => {
    if (isPastoralAgent && myAgent?.id) {
      setSelectedAgentId(myAgent.id);
    }
  }, [isPastoralAgent, myAgent]);

  // Fetch blocked dates for all agents
  const { data: allBlocks, isPending: isLoadingBlocks } = useQuery({
    queryKey: ['all-blocked-dates', agents?.map((a) => a.id).join(',')],
    queryFn: async () => {
      if (!agents || agents.length === 0) return [];
      const results: Array<AgentBlockedDate & { agentName: string; agentRole: string }> = [];

      await Promise.all(
        agents.map(async (agent) => {
          try {
            const res = await getAgentBlockedDates(agent.id);
            if (res?.blockedDates) {
              res.blockedDates.forEach((b) => {
                results.push({
                  ...b,
                  agentName: `${agent.title ? `${agent.title} ` : ''}${agent.name}`,
                  agentRole: agent.actingRole,
                });
              });
            }
          } catch {
            // Ignore individual agent fetch failures
          }
        })
      );

      // Sort by date ascending
      return results.sort((a, b) => a.blockedDate.localeCompare(b.blockedDate));
    },
    enabled: !!agents && agents.length > 0,
  });

  // Filter blocks by selectedAgentId
  const displayedBlocks = useMemo(() => {
    if (!allBlocks) return [];
    if (selectedAgentId === 'all') return allBlocks;
    return allBlocks.filter((b) => b.agentId === selectedAgentId);
  }, [allBlocks, selectedAgentId]);

  // Modal State for New Block
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(shouldOpenNew);
  const [formAgentId, setFormAgentId] = useState<string>(
    isPastoralAgent && myAgent ? myAgent.id : (queryAgentId || '')
  );
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [timeMode, setTimeMode] = useState<'all_day' | 'specific_time'>('all_day');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [reason, setReason] = useState('Férias');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [blockToDelete, setBlockToDelete] = useState<{
    id: string;
    agentId: string;
    date: string;
    reason: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Group consecutive blocked dates with same agent and reason
  const groupedBlocks = useMemo(() => {
    if (!displayedBlocks || displayedBlocks.length === 0) return [];

    const groups: Array<{
      id: string;
      agentId: string;
      agentName: string;
      agentRole: string;
      startDate: string;
      endDate: string;
      reason: string;
      timeLabel: string;
      dayCount: number;
      blockIds: string[];
    }> = [];

    // Sort by agent and date
    const sorted = [...displayedBlocks].sort((a, b) => {
      if (a.agentId !== b.agentId) return a.agentId.localeCompare(b.agentId);
      return a.blockedDate.localeCompare(b.blockedDate);
    });

    sorted.forEach((block) => {
      const prev = groups[groups.length - 1];
      const isConsecutive =
        prev &&
        prev.agentId === block.agentId &&
        prev.reason === (block.reason || 'Compromisso externo') &&
        dayjs(block.blockedDate).diff(dayjs(prev.endDate), 'day') === 1 &&
        !block.startTime &&
        !prev.timeLabel.includes(':');

      if (isConsecutive) {
        prev.endDate = block.blockedDate;
        prev.dayCount += 1;
        prev.blockIds.push(block.id);
      } else {
        const timeLabel =
          block.startTime && block.endTime
            ? `${block.startTime} às ${block.endTime}`
            : 'Dia inteiro';

        groups.push({
          id: block.id,
          agentId: block.agentId,
          agentName: block.agentName,
          agentRole: block.agentRole,
          startDate: block.blockedDate,
          endDate: block.blockedDate,
          reason: block.reason || 'Compromisso externo',
          timeLabel,
          dayCount: 1,
          blockIds: [block.id],
        });
      }
    });

    return groups;
  }, [displayedBlocks]);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveAgent = isPastoralAgent && myAgent ? myAgent.id : formAgentId;

    if (!effectiveAgent) {
      showAlert('Selecione um agente pastoral.');
      return;
    }
    if (!startDate || !endDate) {
      showAlert('Informe as datas de início e término.');
      return;
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (end.isBefore(start)) {
      showAlert('A data final não pode ser anterior à data inicial.');
      return;
    }

    const finalReason =
      reason === 'Outro'
        ? customReason.trim() || 'Compromisso externo'
        : reason;

    setIsSubmitting(true);
    try {
      // Loop through all dates in range
      const diffDays = end.diff(start, 'day');
      const datesToBlock: string[] = [];

      for (let i = 0; i <= diffDays; i++) {
        datesToBlock.push(start.add(i, 'day').format('YYYY-MM-DD'));
      }

      await Promise.all(
        datesToBlock.map((dateStr) =>
          addAgentBlockedDate(effectiveAgent, {
            blockedDate: dateStr,
            startTime: timeMode === 'specific_time' ? startTime : null,
            endTime: timeMode === 'specific_time' ? endTime : null,
            reason: finalReason,
          })
        )
      );

      await queryClient.invalidateQueries({ queryKey: ['all-blocked-dates'] });
      showAlert('Bloqueio cadastrado com sucesso!');
      setIsNewDialogOpen(false);
      setCustomReason('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar bloqueio';
      showAlert(`Erro ao salvar bloqueio: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!blockToDelete) return;
    setIsDeleting(true);
    try {
      await removeAgentBlockedDate(blockToDelete.agentId, blockToDelete.id);
      await queryClient.invalidateQueries({ queryKey: ['all-blocked-dates'] });
      showAlert('Bloqueio removido com sucesso!');
      setBlockToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao remover';
      showAlert(`Erro ao remover bloqueio: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPeriod = (startStr: string, endStr: string) => {
    const s = dayjs(startStr).locale('pt-br');
    const e = dayjs(endStr).locale('pt-br');

    if (startStr === endStr) {
      return s.format('D [de] MMMM [de] YYYY');
    }

    if (s.month() === e.month() && s.year() === e.year()) {
      return `${s.format('DD')} a ${e.format('DD [de] MMMM [de] YYYY')}`;
    }

    return `${s.format('DD/MM/YYYY')} até ${e.format('DD/MM/YYYY')}`;
  };

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'agenda-pastoral',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agenda Pastoral',
            icon: CalendarDays,
          },
          {
            key: 'bloqueios',
            href: ROUTES.APPOINTMENTS.BLOCKS,
            title: 'Bloqueios',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        <div className="mb-2">
          <BackButton href={ROUTES.APPOINTMENTS.HOME} />
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <TypographyH1>Bloqueios de Agenda</TypographyH1>
            <Describe className="mt-1">
              Controle períodos de férias, compromissos externos e datas em que os agentes pastorais não estarão disponíveis.
            </Describe>
          </div>

          <Button
            onClick={() => {
              if (isPastoralAgent && myAgent) {
                setFormAgentId(myAgent.id);
              }
              setIsNewDialogOpen(true);
            }}
            className="gap-2 bg-[#11291f] text-white hover:bg-[#1a3d2e] shrink-0 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo bloqueio</span>
          </Button>
        </div>

        {/* Filter bar by Agent */}
        {!isPastoralAgent && agents && agents.length > 0 && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Filtrar por agente:
              </span>
            </div>

            <div className="w-full sm:w-72">
              <Select
                name="filterAgent"
                value={selectedAgentId}
                onValueChange={(val) => setSelectedAgentId(val)}
                placeholder="Todos os agentes"
              >
                <SelectItem value="all" text="Todos os agentes pastorais" />
                {agents.map((agent) => (
                  <SelectItem
                    key={agent.id}
                    value={agent.id}
                    text={`${agent.title ? `${agent.title} ` : ''}${agent.name}`}
                  />
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Block List Content */}
        {isLoadingBlocks ? (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 shadow-xs">
            <Spinner className="text-[#B8872E] w-6 h-6" />
            <p className="text-sm font-medium text-zinc-600">
              Carregando períodos de bloqueio...
            </p>
          </div>
        ) : groupedBlocks.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-3">
              <CalendarOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-800">
              Nenhum bloqueio cadastrado
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-md mx-auto mb-5">
              Não há períodos de indisponibilidade ativos para o filtro selecionado. Quando um sacerdote ou ministro precisar se ausentar, adicione um bloqueio.
            </p>
            <Button
              onClick={() => setIsNewDialogOpen(true)}
              className="bg-[#11291f] text-white hover:bg-[#1a3d2e] gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Primeiro Bloqueio</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedBlocks.map((group) => {
              const isFuture = dayjs(group.endDate).isAfter(dayjs().subtract(1, 'day'));

              return (
                <div
                  key={`${group.id}-${group.startDate}`}
                  className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* Header with Agent Name and Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-zinc-900 leading-snug">
                          {group.agentName}
                        </h3>
                        <span className="text-xs text-zinc-500 font-medium">
                          {group.agentRole}
                        </span>
                      </div>

                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0',
                          isFuture
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        )}
                      >
                        {isFuture ? 'Ativo / Futuro' : 'Encerrado'}
                      </Badge>
                    </div>

                    {/* Period and Duration */}
                    <div className="p-3 bg-zinc-50/80 rounded-xl space-y-1.5 border border-zinc-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800">
                        <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>{formatPeriod(group.startDate, group.endDate)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>{group.timeLabel}</span>
                        {group.dayCount > 1 && (
                          <span className="ml-auto font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full text-[11px]">
                            {group.dayCount} dias bloqueados
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
                        Motivo do bloqueio
                      </span>
                      <p className="text-sm font-medium text-zinc-700">
                        {group.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      Indisponível para agendamento
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setBlockToDelete({
                          id: group.id,
                          agentId: group.agentId,
                          date: group.startDate,
                          reason: group.reason,
                        })
                      }
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Dialog: Novo Bloqueio */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif text-xl">
              <CalendarOff className="w-5 h-5 text-purple-600" />
              <span>Bloquear Disponibilidade</span>
            </DialogTitle>
            <DialogDescription>
              Selecione o agente pastoral, o intervalo de datas e o motivo para suspender a disponibilidade na agenda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBlock} className="space-y-4 pt-1">
            {/* Agente Selector */}
            {!isPastoralAgent && (
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Agente Pastoral *
                </label>
                <Select
                  name="modalAgentId"
                  value={formAgentId}
                  onValueChange={(val) => setFormAgentId(val)}
                  placeholder="Selecione o padre ou ministro"
                >
                  {(agents || []).map((agent) => (
                    <SelectItem
                      key={agent.id}
                      value={agent.id}
                      text={`${agent.title ? `${agent.title} ` : ''}${agent.name}`}
                    />
                  ))}
                </Select>
              </div>
            )}

            {/* Date Range: De ... Até */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  A partir de *
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Até *
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Time Mode: Dia inteiro vs Horário Específico */}
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                Horário
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTimeMode('all_day')}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center',
                    timeMode === 'all_day'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  )}
                >
                  ○ Dia inteiro
                </button>

                <button
                  type="button"
                  onClick={() => setTimeMode('specific_time')}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center',
                    timeMode === 'specific_time'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  )}
                >
                  ○ Horário específico
                </button>
              </div>
            </div>

            {/* Specific Times if selected */}
            {timeMode === 'specific_time' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                    Horário Inicial
                  </label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                    Horário Final
                  </label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Motivo do Bloqueio *
              </label>
              <Select
                name="reasonSelect"
                value={reason}
                onValueChange={(val) => setReason(val)}
                placeholder="Selecione o motivo"
              >
                <SelectItem value="Férias" text="Férias" />
                <SelectItem value="Retiro Espiritual" text="Retiro Espiritual" />
                <SelectItem value="Compromisso Externo" text="Compromisso Externo" />
                <SelectItem value="Recesso Paroquial" text="Recesso Paroquial" />
                <SelectItem value="Imprevisto / Saúde" text="Imprevisto / Saúde" />
                <SelectItem value="Outro" text="Outro motivo (digitar)" />
              </Select>

              {reason === 'Outro' && (
                <Input
                  className="mt-2"
                  placeholder="Especifique o motivo do bloqueio..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  required
                />
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#11291f] text-white hover:bg-[#1a3d2e]"
                isLoading={isSubmitting}
                loadingText="Bloqueando período..."
              >
                Bloquear período
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={!!blockToDelete}
        onOpenChange={(isOpen) => !isOpen && setBlockToDelete(null)}
        itemName={`o bloqueio de ${blockToDelete?.date ? dayjs(blockToDelete.date).format('DD/MM/YYYY') : 'data'}`}
        isPending={isDeleting}
        onConfirm={handleDeleteGroup}
      />
    </>
  );
}
