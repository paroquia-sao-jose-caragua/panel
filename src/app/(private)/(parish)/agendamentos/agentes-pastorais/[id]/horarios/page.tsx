'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle2 } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePastoralAgents,
  useAgentAvailabilities,
} from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Domingo' },
  { id: 1, label: 'Segunda-feira' },
  { id: 2, label: 'Terça-feira' },
  { id: 3, label: 'Quarta-feira' },
  { id: 4, label: 'Quinta-feira' },
  { id: 5, label: 'Sexta-feira' },
  { id: 6, label: 'Sábado' },
];

export default function AgentSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { agents } = usePastoralAgents();
  const agent = agents.find((a) => a.id === id);

  const { availabilities, isPending, saveAvailabilities, isSavingAvailabilities } =
    useAgentAvailabilities(id);

  const [scheduleState, setScheduleState] = useState<
    Record<
      number,
      {
        active: boolean;
        startTime: string;
        endTime: string;
        slotDurationMinutes: number;
      }
    >
  >(() => {
    const initial: Record<number, any> = {};
    DAYS_OF_WEEK.forEach((d) => {
      initial[d.id] = {
        active: false,
        startTime: '14:00',
        endTime: '17:00',
        slotDurationMinutes: 30,
      };
    });
    return initial;
  });

  useEffect(() => {
    if (availabilities && availabilities.length > 0) {
      const updated: Record<number, any> = {};
      DAYS_OF_WEEK.forEach((d) => {
        const existing = availabilities.find((a) => a.dayOfWeek === d.id);
        updated[d.id] = {
          active: existing ? !!existing.active : false,
          startTime: existing?.startTime || '14:00',
          endTime: existing?.endTime || '17:00',
          slotDurationMinutes: existing?.slotDurationMinutes || 30,
        };
      });
      setScheduleState(updated);
    }
  }, [availabilities]);

  const handleSave = async () => {
    const payload = Object.entries(scheduleState)
      .filter(([_, conf]) => conf.active)
      .map(([dayOfWeekStr, conf]) => ({
        dayOfWeek: Number(dayOfWeekStr),
        startTime: conf.startTime,
        endTime: conf.endTime,
        slotDurationMinutes: Number(conf.slotDurationMinutes) || 30,
        active: true,
      }));

    await saveAvailabilities(payload);
    router.replace(ROUTES.PASTORAL_AGENTS.HOME);
  };

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.PASTORAL_AGENTS.HOME} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <div>
              <TypographyH1>Grade de Horários</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {agent?.name
                  ? `${agent.title ? `${agent.title} ` : ''}${agent.name} — ${agent.actingRole}`
                  : 'Configuração da agenda semanal de atendimento'}
              </span>
            </div>
          </div>
        </div>

        <Separator />
      </header>

      <main className="mx-auto w-full max-w-220 px-4 lg:px-8 py-8 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-700" />
              <span>Disponibilidade Semanal para Atendimentos</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Ative os dias da semana em que este agente estará na igreja ou disponível para visitas e defina os intervalos e a duração de cada slot.
            </p>
          </div>

          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {DAYS_OF_WEEK.map((d) => {
                const conf = scheduleState[d.id] || {
                  active: false,
                  startTime: '14:00',
                  endTime: '17:00',
                  slotDurationMinutes: 30,
                };

                return (
                  <div
                    key={d.id}
                    className={`p-4 rounded-xl border transition-all ${
                      conf.active
                        ? 'bg-white border-brand-300 shadow-xs ring-1 ring-brand-500/20'
                        : 'bg-zinc-50 border-zinc-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={conf.active}
                          onCheckedChange={(checked) =>
                            setScheduleState((prev) => ({
                              ...prev,
                              [d.id]: { ...conf, active: checked },
                            }))
                          }
                        />
                        <div>
                          <span className="font-semibold text-sm text-zinc-900 block">
                            {d.label}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {conf.active ? 'Dia com atendimento ativo' : 'Sem atendimentos'}
                          </span>
                        </div>
                      </div>

                      {conf.active && (
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
                            <span>Das</span>
                            <Input
                              type="time"
                              value={conf.startTime}
                              onChange={(e) =>
                                setScheduleState((prev) => ({
                                  ...prev,
                                  [d.id]: { ...conf, startTime: e.target.value },
                                }))
                              }
                              className="w-24 h-7 text-xs px-2 bg-white"
                            />
                            <span>às</span>
                            <Input
                              type="time"
                              value={conf.endTime}
                              onChange={(e) =>
                                setScheduleState((prev) => ({
                                  ...prev,
                                  [d.id]: { ...conf, endTime: e.target.value },
                                }))
                              }
                              className="w-24 h-7 text-xs px-2 bg-white"
                            />
                          </div>

                          <div className="flex items-center gap-1 text-xs text-zinc-600">
                            <select
                              value={conf.slotDurationMinutes}
                              onChange={(e) =>
                                setScheduleState((prev) => ({
                                  ...prev,
                                  [d.id]: {
                                    ...conf,
                                    slotDurationMinutes: Number(e.target.value),
                                  },
                                }))
                              }
                              className="h-9 rounded-lg border border-zinc-300 text-xs px-2 bg-white"
                            >
                              <option value={15}>15 minutos / slot</option>
                              <option value={20}>20 minutos / slot</option>
                              <option value={30}>30 minutos / slot</option>
                              <option value={45}>45 minutos / slot</option>
                              <option value={60}>1 hora / slot</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-3 pt-6 mt-6 justify-between border-t border-divider">
            <Link href={ROUTES.PASTORAL_AGENTS.HOME}>
              <Button variant="outline" size="lg">
                Cancelar
              </Button>
            </Link>
            <Button
              size="lg"
              isLoading={isSavingAvailabilities}
              loadingText="Salvando grade..."
              onClick={handleSave}
            >
              Salvar Grade Semanal
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
