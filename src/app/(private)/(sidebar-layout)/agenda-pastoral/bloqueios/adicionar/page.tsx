'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { CalendarCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { AppHeader } from '@/components/common/header';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/common/select';
import {
  usePastoralAgents,
  useMyPastoralAgent,
} from '@/api/appointments/use-appointments';
import { addAgentBlockedDate } from '@/api/appointments/agents';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';

export default function AdicionarBloqueioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryAgentId = searchParams.get('agentId');
  const queryClient = useQueryClient();

  const { user } = useAuthStore();
  const isPastoralAgent = user?.role === 'pastoral_agent';
  const { agent: myAgent } = useMyPastoralAgent(isPastoralAgent);
  const { agents } = usePastoralAgents();

  const [formAgentId, setFormAgentId] = useState<string>(queryAgentId || '');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [timeMode, setTimeMode] = useState<'all_day' | 'specific_time'>('all_day');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [reason, setReason] = useState('Férias');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isPastoralAgent && myAgent?.id) {
      setFormAgentId(myAgent.id);
    }
  }, [isPastoralAgent, myAgent]);

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
      router.push(ROUTES.APPOINTMENTS.BLOCKS);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar bloqueio';
      showAlert(`Erro ao salvar bloqueio: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:col-start-2">
      <AppHeader
        links={[
          {
            key: 'agendamentos',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agenda Pastoral',
            icon: CalendarCheck,
          },
          {
            key: 'bloqueios',
            href: ROUTES.APPOINTMENTS.BLOCKS,
            title: 'Bloqueios',
          },
          {
            key: 'bloqueios-adicionar',
            href: ROUTES.APPOINTMENTS.BLOCKS_ADD,
            title: 'Novo Bloqueio',
          },
        ]}
      />

      <main className="max-w-220 w-full px-4 pt-4 pb-16 lg:px-8 lg:pt-8 mx-auto space-y-6">
        <div className="space-y-2">
          <BackButton href={ROUTES.APPOINTMENTS.BLOCKS} />
          <div>
            <TypographyH1 size="form">Bloquear Disponibilidade</TypographyH1>
            <p className="text-sm text-zinc-500">
              Selecione o agente pastoral, o intervalo de datas e o motivo para suspender a disponibilidade online na agenda.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCreateBlock}
          className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-5"
        >
          {!isPastoralAgent && (
            <div>
              <label className="text-sm font-semibold text-zinc-700 block mb-1.5">
                Agente Pastoral *
              </label>
              <Select
                name="agentId"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-zinc-700 block mb-1.5">
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
              <label className="text-sm font-semibold text-zinc-700 block mb-1.5">
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

          <div>
            <label className="text-sm font-semibold text-zinc-700 block mb-1.5">
              Horário
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={timeMode === 'all_day' ? 'secondary' : 'outline'}
                size="default"
                onClick={() => setTimeMode('all_day')}
                className={cn(
                  'w-full font-semibold',
                  timeMode === 'all_day'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 hover:bg-emerald-100'
                    : 'text-zinc-600'
                )}
              >
                Dia inteiro
              </Button>

              <Button
                type="button"
                variant={timeMode === 'specific_time' ? 'secondary' : 'outline'}
                size="default"
                onClick={() => setTimeMode('specific_time')}
                className={cn(
                  'w-full font-semibold',
                  timeMode === 'specific_time'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 hover:bg-emerald-100'
                    : 'text-zinc-600'
                )}
              >
                Horário específico
              </Button>
            </div>
          </div>

          {timeMode === 'specific_time' && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">
                  Horário Inicial
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">
                  Horário Final
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-zinc-700 block mb-1.5">
              Motivo *
            </label>
            <Select
              name="reason"
              placeholder="Selecione o motivo"
              value={reason}
              onValueChange={(val) => setReason(val)}
            >
              <SelectItem value="Férias" text="Férias" />
              <SelectItem value="Retiro Espiritual" text="Retiro Espiritual" />
              <SelectItem value="Compromisso Externo" text="Compromisso Externo" />
              <SelectItem value="Recesso Paroquial" text="Recesso Paroquial" />
              <SelectItem value="Outro" text="Outro motivo" />
            </Select>
          </div>

          {reason === 'Outro' && (
            <div>
              <label className="text-sm font-semibold text-zinc-700 block mb-1.5">
                Especifique o motivo
              </label>
              <Input
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Ex: Reunião diocesana, viagem..."
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <Button asChild variant="outline" disabled={isSubmitting}>
              <Link href={ROUTES.APPOINTMENTS.BLOCKS}>Cancelar</Link>
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Salvando..."
            >
              Salvar Bloqueio
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
