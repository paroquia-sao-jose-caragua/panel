'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Plus,
  Trash2,
  Save,
  Info,
  Check,
} from 'lucide-react';
import {
  useMyPastoralAgent,
  useAgentAvailabilities,
} from '@/api/appointments/use-appointments';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';

interface TimeInterval {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayConfig {
  dayOfWeek: number;
  label: string;
  active: boolean;
  intervals: TimeInterval[];
}

const DAYS = [
  { dayOfWeek: 1, label: 'Segunda-feira' },
  { dayOfWeek: 2, label: 'Terça-feira' },
  { dayOfWeek: 3, label: 'Quarta-feira' },
  { dayOfWeek: 4, label: 'Quinta-feira' },
  { dayOfWeek: 5, label: 'Sexta-feira' },
  { dayOfWeek: 6, label: 'Sábado' },
  { dayOfWeek: 0, label: 'Domingo' },
];

export default function MinhaDisponibilidadePage() {
  const router = useRouter();
  const { agent: myAgent, isPending: isAgentPending } = useMyPastoralAgent();
  const agentId = myAgent?.id || '';

  const {
    availabilities,
    isPending: isAvailabilitiesPending,
    saveAvailabilities,
    isSavingAvailabilities,
  } = useAgentAvailabilities(agentId);

  // Local state for all days
  const [daysState, setDaysState] = useState<DayConfig[]>(() => {
    return DAYS.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      label: d.label,
      active: false,
      intervals: [
        {
          id: Math.random().toString(),
          startTime: '08:00',
          endTime: '12:00',
        },
      ],
    }));
  });

  // Populate from fetched availabilities
  useEffect(() => {
    if (!availabilities) return;

    setDaysState(
      DAYS.map((d) => {
        const matching = availabilities.filter(
          (a) => a.dayOfWeek === d.dayOfWeek && a.active !== false
        );

        if (matching.length > 0) {
          return {
            dayOfWeek: d.dayOfWeek,
            label: d.label,
            active: true,
            intervals: matching.map((m) => ({
              id: m.id || Math.random().toString(),
              startTime: m.startTime,
              endTime: m.endTime,
            })),
          };
        }

        return {
          dayOfWeek: d.dayOfWeek,
          label: d.label,
          active: false,
          intervals: [
            {
              id: Math.random().toString(),
              startTime: '08:00',
              endTime: '12:00',
            },
          ],
        };
      })
    );
  }, [availabilities]);

  // Toggle active for a day
  const handleToggleDay = (dayOfWeek: number, checked: boolean) => {
    setDaysState((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, active: checked } : d))
    );
  };

  // Add interval to a day
  const handleAddInterval = (dayOfWeek: number) => {
    setDaysState((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        return {
          ...d,
          intervals: [
            ...d.intervals,
            {
              id: Math.random().toString(),
              startTime: '14:00',
              endTime: '18:00',
            },
          ],
        };
      })
    );
  };

  // Remove interval from a day
  const handleRemoveInterval = (dayOfWeek: number, intervalId: string) => {
    setDaysState((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        const remaining = d.intervals.filter((i) => i.id !== intervalId);
        return {
          ...d,
          intervals:
            remaining.length > 0
              ? remaining
              : [
                  {
                    id: Math.random().toString(),
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
          active: remaining.length > 0 ? d.active : false,
        };
      })
    );
  };

  // Change interval times
  const handleTimeChange = (
    dayOfWeek: number,
    intervalId: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setDaysState((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        return {
          ...d,
          intervals: d.intervals.map((i) =>
            i.id === intervalId ? { ...i, [field]: value } : i
          ),
        };
      })
    );
  };

  const handleSave = async () => {
    if (!agentId) {
      showAlert('Agente pastoral não identificado.');
      return;
    }

    const payload: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      slotDurationMinutes: number;
      active: boolean;
    }> = [];

    daysState.forEach((d) => {
      if (d.active) {
        d.intervals.forEach((interval) => {
          if (interval.startTime && interval.endTime) {
            payload.push({
              dayOfWeek: d.dayOfWeek,
              startTime: interval.startTime,
              endTime: interval.endTime,
              slotDurationMinutes: 30,
              active: true,
            });
          }
        });
      }
    });

    try {
      await saveAvailabilities(payload);
      showAlert('Grade de disponibilidade salva com sucesso!');
      router.push(ROUTES.MY_AGENDA.PROFILE);
    } catch {
      // Handled
    }
  };

  const isInitialLoading = isAgentPending || isAvailabilitiesPending;

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Minha Disponibilidade"
        backHref={ROUTES.MY_AGENDA.PROFILE}
      />

      <div className="px-4 pt-4 pb-12 space-y-5">
        {/* Intro */}
        <section className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-serif">
            Grade Semanal Recorrente
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Configure os dias e horários fixos em que você normalmente está disponível
            para atender os fiéis na paróquia.
          </p>
        </section>

        {/* Informational Box */}
        <section className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 leading-relaxed">
            Esta é a sua disponibilidade normal. Para imprevistos, férias ou retiros,
            utilize a seção de <strong>Bloqueios</strong> no seu perfil.
          </p>
        </section>

        {/* Days List */}
        {isInitialLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : (
          <section className="space-y-3">
            {daysState.map((day) => (
              <div
                key={day.dayOfWeek}
                className={cn(
                  'rounded-2xl border transition-all p-4 space-y-3 bg-white shadow-2xs',
                  day.active
                    ? 'border-emerald-200'
                    : 'border-zinc-200/80 opacity-80'
                )}
              >
                {/* Day Header with Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      {day.label}
                    </h3>
                    <span
                      className={cn(
                        'text-[11px] font-semibold',
                        day.active ? 'text-emerald-700' : 'text-zinc-400'
                      )}
                    >
                      {day.active ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>

                  <Switch
                    checked={day.active}
                    onCheckedChange={(checked) =>
                      handleToggleDay(day.dayOfWeek, checked)
                    }
                  />
                </div>

                {/* Day Intervals if Active */}
                {day.active && (
                  <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                    {day.intervals.map((interval, idx) => (
                      <div
                        key={interval.id}
                        className="flex items-center gap-2"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-zinc-400 block mb-0.5">
                              Início
                            </span>
                            <Input
                              type="time"
                              value={interval.startTime}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.dayOfWeek,
                                  interval.id,
                                  'startTime',
                                  e.target.value
                                )
                              }
                              className="h-10 text-xs font-semibold rounded-xl"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-zinc-400 block mb-0.5">
                              Término
                            </span>
                            <Input
                              type="time"
                              value={interval.endTime}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.dayOfWeek,
                                  interval.id,
                                  'endTime',
                                  e.target.value
                                )
                              }
                              className="h-10 text-xs font-semibold rounded-xl"
                            />
                          </div>
                        </div>

                        {day.intervals.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveInterval(day.dayOfWeek, interval.id)
                            }
                            className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer mt-4"
                            title="Remover intervalo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add Interval Button */}
                    <button
                      type="button"
                      onClick={() => handleAddInterval(day.dayOfWeek)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar outro intervalo neste dia</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Save Button */}
        <section className="pt-2">
          <Button
            type="button"
            onClick={handleSave}
            isLoading={isSavingAvailabilities}
            className="w-full h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-md active:scale-[0.99] gap-2"
          >
            <Save className="w-4 h-4 text-brand-300" />
            <span>Salvar disponibilidade</span>
          </Button>
        </section>
      </div>
    </div>
  );
}
