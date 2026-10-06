'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  Clock,
  Filter,
  Plus,
  Repeat,
  Sparkles,
  CalendarCheck2,
  Pencil,
  Trash2,
  Church as ChurchIcon,
  Info,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectItem } from '@/components/common/select';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { ChurchAvatar } from '@/components/features/churches/church-avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCommunities } from '@/api/communities/use-communities';
import { listCommunityMassSchedules } from '@/api/communities/mass-schedules/list';
import { deleteMassSchedule } from '@/api/mass-schedules/delete';
import { updateMassSchedule } from '@/api/mass-schedules/update';
import { formatMassScheduleDescription } from '@/components/features/mass-schedules/utils/format-mass-schedule-description';
import type { MassSchedule } from '@/entities/MassSchedule';
import type { Community } from '@/entities/Community';
import useTranslator from '@/hooks/use-translator';
import { ROUTES } from '@/constants/routes';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';

export default function RecurringProgrammingPage() {
  const { t } = useTranslator();
  const queryClient = useQueryClient();
  const { communities, isPending: isLoadingCommunities } = useCommunities();

  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<string>('all');

  // Deletion modal state
  const [scheduleToDelete, setScheduleToDelete] = useState<{
    id: string;
    title?: string;
    communityName: string;
  } | null>(null);

  // New programming modal state
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newDialogCommunitySlug, setNewDialogCommunitySlug] = useState<string>('');

  // Fetch mass schedules for all communities
  const { data: communitiesWithSchedules, isPending: isLoadingSchedules } = useQuery({
    queryKey: ['all-communities-recurring-schedules', communities.map((c) => c.id)],
    queryFn: async () => {
      const results = await Promise.all(
        communities.map(async (c) => {
          try {
            const { massSchedules } = await listCommunityMassSchedules({
              communityId: c.id,
            });
            return {
              community: c,
              massSchedules: massSchedules || [],
            };
          } catch {
            return {
              community: c,
              massSchedules: [] as MassSchedule[],
            };
          }
        })
      );
      return results;
    },
    enabled: communities.length > 0,
    refetchOnWindowFocus: false,
  });

  // Delete mutation
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteMassSchedule,
    onSuccess: ({ statusCode }) => {
      if (statusCode === 200) {
        queryClient.invalidateQueries({
          queryKey: ['all-communities-recurring-schedules'],
        });
        setScheduleToDelete(null);
      } else {
        showAlert('Não foi possível excluir o horário de celebração.');
      }
    },
    onError: () => {
      showAlert('Ocorreu um erro ao excluir o horário. Tente novamente.');
    },
  });

  // Toggle active mutation
  const { mutate: mutateToggleActive, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateMassSchedule,
    onSuccess: ({ statusCode }) => {
      if (statusCode === 200) {
        queryClient.invalidateQueries({
          queryKey: ['all-communities-recurring-schedules'],
        });
      } else {
        showAlert('Não foi possível atualizar o status da celebração.');
      }
    },
    onError: () => {
      showAlert('Ocorreu um erro ao atualizar o status.');
    },
  });

  const handleToggleActive = (schedule: MassSchedule) => {
    mutateToggleActive({
      massScheduleId: schedule.id,
      title: schedule.title,
      type: schedule.type,
      orientations: schedule.orientations,
      isPrecept: schedule.isPrecept,
      recurrenceType: schedule.recurrenceType,
      dayOfWeek: schedule.dayOfWeek,
      dayOfMonth: schedule.dayOfMonth,
      weekOfMonth: schedule.weekOfMonth,
      monthOfYear: schedule.monthOfYear,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      active: !schedule.active,
      times: schedule.times.map((t) => ({
        startTime: t.startTime,
        endTime: t.endTime,
      })),
    });
  };

  // Filter schedules
  const filteredData = useMemo(() => {
    if (!communitiesWithSchedules) return [];

    return communitiesWithSchedules
      .filter(({ community }) => {
        if (selectedCommunityId !== 'all') {
          return community.id === selectedCommunityId;
        }
        return true;
      })
      .map(({ community, massSchedules }) => {
        const filteredSchedules = massSchedules.filter((s) => {
          if (selectedType !== 'all' && s.type !== selectedType) {
            return false;
          }
          if (selectedDayOfWeek !== 'all') {
            const dayNum = Number.parseInt(selectedDayOfWeek, 10);
            if (s.dayOfWeek !== dayNum) {
              return false;
            }
          }
          return true;
        });

        return {
          community,
          massSchedules: filteredSchedules,
        };
      })
      .filter(({ massSchedules }) => massSchedules.length > 0);
  }, [communitiesWithSchedules, selectedCommunityId, selectedType, selectedDayOfWeek]);

  // Group schedules within a community by day of the week
  const groupSchedulesByDay = (schedules: MassSchedule[]) => {
    const daysOrder = [0, 1, 2, 3, 4, 5, 6];
    const grouped: { dayOfWeek?: number; label: string; items: MassSchedule[] }[] = [];

    // Weekly by day
    daysOrder.forEach((day) => {
      const items = schedules.filter(
        (s) => s.recurrenceType === 'weekly' && s.dayOfWeek === day
      );
      if (items.length > 0) {
        grouped.push({
          dayOfWeek: day,
          label: t(`week-day-${day}` as `week-day-${0 | 1 | 2 | 3 | 4 | 5 | 6}`),
          items,
        });
      }
    });

    // Monthly devotions
    const monthlyItems = schedules.filter((s) => s.recurrenceType === 'monthly');
    if (monthlyItems.length > 0) {
      grouped.push({
        label: 'Devoções Mensais',
        items: monthlyItems,
      });
    }

    // Yearly solemnities
    const yearlyItems = schedules.filter((s) => s.recurrenceType === 'yearly');
    if (yearlyItems.length > 0) {
      grouped.push({
        label: 'Celebrações & Solenidades Anuais',
        items: yearlyItems,
      });
    }

    return grouped;
  };

  const getEditLink = (communitySlug: string, schedule: MassSchedule) => {
    if (schedule.type === 'devotional') {
      return ROUTES.COMMUNITIES.MASS_SCHEDULES.EDIT_DEVOTIONAL(
        communitySlug,
        schedule.id
      );
    }
    if (schedule.type === 'solemnity') {
      return ROUTES.COMMUNITIES.MASS_SCHEDULES.EDIT_ANNUAL(
        communitySlug,
        schedule.id
      );
    }
    return ROUTES.COMMUNITIES.MASS_SCHEDULES.EDIT_ORDINARY(
      communitySlug,
      schedule.id
    );
  };

  const isInitialLoading = isLoadingCommunities || isLoadingSchedules;

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'programacao-e-eventos',
            href: ROUTES.CALENDAR.HOME,
            title: 'Programação & Eventos',
            icon: CalendarDays,
          },
          {
            key: 'recorrente',
            href: ROUTES.CALENDAR.RECURRING,
            title: 'Programação Recorrente',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#B8872E]">
                <Repeat className="w-5 h-5" />
              </div>
              <TypographyH1>Programação Recorrente</TypographyH1>
            </div>
            <Describe className="mt-1">
              Atividades e horários habituais de missas, terços e celebrações das
              comunidades da Paróquia São José.
            </Describe>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {/* New Recurring Schedule Action */}
            <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 h-9 text-xs shadow-xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Programação</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Horário Recorrente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  <p className="text-sm text-zinc-600">
                    Selecione a comunidade para a qual deseja cadastrar o novo
                    horário recorrente:
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Comunidade
                    </label>
                    <Select
                      name="communitySlug"
                      placeholder="Selecione uma comunidade"
                      value={newDialogCommunitySlug}
                      onValueChange={setNewDialogCommunitySlug}
                    >
                      {communities.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.slug}
                          text={
                            c.type === 'parish_church'
                              ? `Paróquia ${c.name}`
                              : `Capela ${c.name}`
                          }
                        />
                      ))}
                    </Select>
                  </div>

                  {newDialogCommunitySlug && (
                    <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
                      <p className="text-xs font-medium text-zinc-500">
                        Escolha o tipo de celebração:
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="justify-between text-xs h-9"
                      >
                        <Link
                          href={ROUTES.COMMUNITIES.MASS_SCHEDULES.ADD_ORDINARY(
                            newDialogCommunitySlug
                          )}
                          onClick={() => setOpenNewDialog(false)}
                        >
                          <span>Missa Regular (Semanal)</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="justify-between text-xs h-9"
                      >
                        <Link
                          href={ROUTES.COMMUNITIES.MASS_SCHEDULES.ADD_DEVOTIONAL(
                            newDialogCommunitySlug
                          )}
                          onClick={() => setOpenNewDialog(false)}
                        >
                          <span>Missa Devocional (1º Sábado, etc.)</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="justify-between text-xs h-9"
                      >
                        <Link
                          href={ROUTES.COMMUNITIES.MASS_SCHEDULES.ADD_ANNUAL(
                            newDialogCommunitySlug
                          )}
                          onClick={() => setOpenNewDialog(false)}
                        >
                          <span>Missa Anual / Solenidade</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpenNewDialog(false)}
                  >
                    Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Informative Pastoral Context Box */}
        <div className="mb-6 rounded-2xl bg-[#fefbf6] border border-[#D6A64A]/30 p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-700 leading-relaxed">
            <span className="font-semibold text-zinc-900">
              Programação Habitual da Paróquia:{' '}
            </span>
            Estes horários configuram as celebrações fixas das comunidades (missas de
            preceito, terços, novenas e solenidades). Eles se repetem
            automaticamente no calendário paroquial e no site público.
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {/* Community Filter */}
            <Select
              name="communityId"
              placeholder="Todas as comunidades"
              value={selectedCommunityId}
              onValueChange={setSelectedCommunityId}
            >
              <SelectItem value="all" text="Todas as comunidades" />
              {communities.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  text={
                    c.type === 'parish_church'
                      ? `Paróquia ${c.name}`
                      : `Capela ${c.name}`
                  }
                />
              ))}
            </Select>

            {/* Type Filter */}
            <Select
              name="type"
              placeholder="Todos os tipos"
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectItem value="all" text="Todos os tipos" />
              <SelectItem value="ordinary" text="Ordinária (Semanal)" />
              <SelectItem value="devotional" text="Devocional" />
              <SelectItem value="solemnity" text="Solenidade / Anual" />
            </Select>

            {/* Day of Week Filter */}
            <Select
              name="dayOfWeek"
              placeholder="Todos os dias"
              value={selectedDayOfWeek}
              onValueChange={setSelectedDayOfWeek}
            >
              <SelectItem value="all" text="Todos os dias" />
              <SelectItem value="0" text="Domingo" />
              <SelectItem value="1" text="Segunda-feira" />
              <SelectItem value="2" text="Terça-feira" />
              <SelectItem value="3" text="Quarta-feira" />
              <SelectItem value="4" text="Quinta-feira" />
              <SelectItem value="5" text="Sexta-feira" />
              <SelectItem value="6" text="Sábado" />
            </Select>
          </div>

          {(selectedCommunityId !== 'all' ||
            selectedType !== 'all' ||
            selectedDayOfWeek !== 'all') && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCommunityId('all');
                setSelectedType('all');
                setSelectedDayOfWeek('all');
              }}
              className="text-xs text-zinc-500 hover:text-zinc-900 shrink-0"
            >
              Limpar
            </Button>
          )}
        </div>

        {/* Content Area */}
        {isInitialLoading && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 shadow-xs">
            <Spinner className="text-[#B8872E] w-6 h-6" />
            <p className="text-sm font-medium text-zinc-600">
              Carregando programação habitual das comunidades...
            </p>
          </div>
        )}

        {!isInitialLoading && filteredData.length === 0 && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#B8872E] mx-auto mb-3">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
              Nenhuma programação recorrente encontrada
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
              Não há celebrações recorrentes cadastradas com os filtros atuais.
            </p>
            <Button
              type="button"
              size="sm"
              onClick={() => setOpenNewDialog(true)}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Nova Programação</span>
            </Button>
          </div>
        )}

        {!isInitialLoading && filteredData.length > 0 && (
          <div className="space-y-8">
            {filteredData.map(({ community, massSchedules }) => {
              const groupedDays = groupSchedulesByDay(massSchedules);

              return (
                <section
                  key={community.id}
                  className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-6"
                >
                  {/* Community Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <ChurchAvatar
                        name={community.name}
                        coverUrl={community.coverUrl || ''}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                            {community.type === 'parish_church'
                              ? 'Matriz'
                              : 'Capela'}
                          </span>
                          <h2 className="text-lg font-bold text-zinc-900">
                            {community.name}
                          </h2>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {community.address}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 gap-1.5 self-start sm:self-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar Horário</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-xs text-zinc-500">
                          {community.name}
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.COMMUNITIES.MASS_SCHEDULES.ADD_ORDINARY(
                              community.slug
                            )}
                          >
                            Missa Regular (Semanal)
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.COMMUNITIES.MASS_SCHEDULES.ADD_DEVOTIONAL(
                              community.slug
                            )}
                          >
                            Missa Devocional (Mensal)
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.COMMUNITIES.MASS_SCHEDULES.ADD_ANNUAL(
                              community.slug
                            )}
                          >
                            Missa Anual (Solenidade)
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Days & Schedules Listing */}
                  <div className="space-y-6">
                    {groupedDays.map(({ label, items }, dayIdx) => (
                      <div key={`${community.id}-day-${dayIdx}`} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#B8872E]">
                            {label}
                          </span>
                          <div className="h-px bg-zinc-200 flex-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {items.map((schedule) => {
                            const description = formatMassScheduleDescription({
                              massSchedule: schedule,
                              type:
                                schedule.type === 'solemnity'
                                  ? 'annual'
                                  : schedule.type,
                              t,
                            });

                            return (
                              <div
                                key={schedule.id}
                                className={cn(
                                  'group rounded-xl border p-4 transition-all flex flex-col justify-between gap-3',
                                  schedule.active
                                    ? 'bg-zinc-50/50 border-zinc-200/80 hover:border-[#D6A64A]/60 hover:bg-white'
                                    : 'bg-zinc-100/60 border-zinc-200/50 opacity-60'
                                )}
                              >
                                <div className="space-y-2">
                                  {/* Top Badges & Times */}
                                  <div className="flex items-start justify-between gap-2 flex-wrap">
                                    {/* Horários */}
                                    <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-zinc-900">
                                      <Clock className="w-4 h-4 text-[#B8872E]" />
                                      <span>
                                        {schedule.times
                                          .map((t) => t.startTime)
                                          .join(', ')}
                                      </span>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60">
                                        Recorrente
                                      </span>

                                      {schedule.isPrecept && (
                                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/60">
                                          Preceito
                                        </span>
                                      )}

                                      {schedule.type === 'devotional' && (
                                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200/60">
                                          Devocional
                                        </span>
                                      )}

                                      {schedule.type === 'solemnity' && (
                                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200/60">
                                          Solenidade
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Title & Description */}
                                  <div>
                                    <h4 className="text-sm font-bold text-zinc-900">
                                      {schedule.title || 'Missa'}
                                    </h4>
                                    {description && (
                                      <p className="text-xs text-zinc-500 mt-0.5">
                                        {description}
                                      </p>
                                    )}
                                    {schedule.orientations && (
                                      <p className="text-xs text-zinc-600 italic mt-1 bg-white/80 p-2 rounded-lg border border-zinc-200/50">
                                        &ldquo;{schedule.orientations}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Actions Bar */}
                                <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                                  {/* Active toggle */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleActive(schedule)}
                                    disabled={isUpdatingStatus}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                                  >
                                    {schedule.active ? (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Ativa</span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                                        <span>Desativada</span>
                                      </>
                                    )}
                                  </button>

                                  <div className="flex items-center gap-1">
                                    <Button
                                      asChild
                                      variant="ghost"
                                      size="icon-xs"
                                      className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
                                      title="Editar programação"
                                    >
                                      <Link
                                        href={getEditLink(
                                          community.slug,
                                          schedule
                                        )}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </Link>
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon-xs"
                                      className="h-7 w-7 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                                      title="Excluir programação"
                                      onClick={() =>
                                        setScheduleToDelete({
                                          id: schedule.id,
                                          title: schedule.title || 'Missa',
                                          communityName: community.name,
                                        })
                                      }
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={Boolean(scheduleToDelete)}
          onOpenChange={(open) => !open && setScheduleToDelete(null)}
          title="Excluir Horário Recorrente"
          description={`Tem certeza que deseja excluir o horário "${scheduleToDelete?.title}" de ${scheduleToDelete?.communityName}? Esta ação removerá a recorrência das futuras celebrações.`}
          onConfirm={() => {
            if (scheduleToDelete) {
              mutateDelete({ massScheduleId: scheduleToDelete.id });
            }
          }}
          isPending={isDeleting}
        />
      </main>
    </>
  );
}
