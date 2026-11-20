'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  CalendarIcon,
  Clock,
  Sparkles,
  Repeat,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectItem } from '@/components/common/select';
import { ChurchAvatar } from '@/components/features/churches/church-avatar';
import { useCommunities } from '@/api/communities/use-communities';
import { listCommunityMassSchedules } from '@/api/communities/mass-schedules/list';
import type { MassSchedule } from '@/entities/MassSchedule';
import type { Community } from '@/entities/Community';
import { ROUTES } from '@/constants/routes';

type ScheduleWithCommunity = MassSchedule & {
  community: Community;
};

// Chronological order: Segunda-feira to Domingo with gender-agreed prefix
const WEEKDAY_ORDER = [
  { day: 1, label: 'Toda segunda-feira', short: 'SEG' },
  { day: 2, label: 'Toda terça-feira', short: 'TER' },
  { day: 3, label: 'Toda quarta-feira', short: 'QUA' },
  { day: 4, label: 'Toda quinta-feira', short: 'QUI' },
  { day: 5, label: 'Toda sexta-feira', short: 'SEX' },
  { day: 6, label: 'Todo sábado', short: 'SÁB' },
  { day: 0, label: 'Todo domingo', short: 'DOM' },
] as const;

type MonthlyRuleInfo = {
  key: string;
  ruleTitle: string;
  badge: string;
  orderWeight: number;
};

/**
 * Computes recurrence rule metadata for monthly schedules.
 * Supports:
 * - Specific day of month (e.g. Dia 13 de cada mês)
 * - Week of month + day of week (e.g. 1º Sábado do mês, 3ª Sexta-feira do mês, Último Domingo do mês)
 */
function getMonthlyRuleInfo(schedule: MassSchedule): MonthlyRuleInfo {
  if (schedule.dayOfMonth !== undefined && schedule.dayOfMonth !== null) {
    return {
      key: `day-${schedule.dayOfMonth}`,
      ruleTitle: `Todo dia ${schedule.dayOfMonth} de cada mês`,
      badge: `Dia ${schedule.dayOfMonth}`,
      orderWeight: schedule.dayOfMonth,
    };
  }

  if (
    schedule.weekOfMonth !== undefined &&
    schedule.weekOfMonth !== null &&
    typeof schedule.dayOfWeek === 'number'
  ) {
    // In PT-BR, Segunda to Sexta are feminine; Sábado and Domingo are masculine
    const isFeminine = schedule.dayOfWeek >= 1 && schedule.dayOfWeek <= 5;
    const weekdayNames: Record<number, string> = {
      0: 'domingo',
      1: 'segunda-feira',
      2: 'terça-feira',
      3: 'quarta-feira',
      4: 'quinta-feira',
      5: 'sexta-feira',
      6: 'sábado',
    };
    const weekdayShort: Record<number, string> = {
      0: 'Dom',
      1: 'Seg',
      2: 'Ter',
      3: 'Qua',
      4: 'Qui',
      5: 'Sex',
      6: 'Sáb',
    };

    const weekday = weekdayNames[schedule.dayOfWeek] || 'Dia';
    const shortDay = weekdayShort[schedule.dayOfWeek] || '';

    const prefixWord = isFeminine ? 'Toda' : 'Todo';
    let prefix = '';
    let shortPrefix = '';

    if (schedule.weekOfMonth === 5) {
      prefix = isFeminine ? 'Última' : 'Último';
      shortPrefix = 'Últ.';
    } else {
      prefix = isFeminine ? `${schedule.weekOfMonth}ª` : `${schedule.weekOfMonth}º`;
      shortPrefix = prefix;
    }

    return {
      key: `week-${schedule.weekOfMonth}-day-${schedule.dayOfWeek}`,
      ruleTitle: `${prefixWord} ${prefix} ${weekday} do mês`,
      badge: `${shortPrefix} ${shortDay}`,
      orderWeight: 100 + schedule.weekOfMonth * 10 + schedule.dayOfWeek,
    };
  }

  return {
    key: 'monthly-general',
    ruleTitle: 'Toda celebração mensal',
    badge: 'Mensal',
    orderWeight: 999,
  };
}

export default function RecurringProgrammingPage() {
  const { communities, isPending: isLoadingCommunities } = useCommunities();
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  // Fetch mass schedules across all communities
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

  // Filter schedules by community (applies to both categories)
  const allSchedulesWithCommunity = useMemo<ScheduleWithCommunity[]>(() => {
    if (!communitiesWithSchedules) return [];

    const list: ScheduleWithCommunity[] = [];
    for (const item of communitiesWithSchedules) {
      if (selectedCommunityId !== 'all' && item.community.id !== selectedCommunityId) {
        continue;
      }

      for (const schedule of item.massSchedules) {
        list.push({
          ...schedule,
          community: item.community,
        });
      }
    }

    return list;
  }, [communitiesWithSchedules, selectedCommunityId]);

  // 1. Weekly Celebrations: Grouped strictly chronologically by weekday (Segunda -> Domingo)
  // Days without programming are excluded
  const weeklyGroups = useMemo(() => {
    return WEEKDAY_ORDER.map((weekday) => {
      const schedules = allSchedulesWithCommunity
        .filter((s) => s.recurrenceType === 'weekly' && s.dayOfWeek === weekday.day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      return {
        id: `weekday-${weekday.day}`,
        day: weekday.day,
        label: weekday.label,
        short: weekday.short,
        schedules,
      };
    }).filter((group) => group.schedules.length > 0);
  }, [allSchedulesWithCommunity]);

  const totalWeeklySchedules = useMemo(() => {
    return weeklyGroups.reduce((acc, curr) => acc + curr.schedules.length, 0);
  }, [weeklyGroups]);

  // 2. Monthly Celebrations: Grouped by recurrence rule and ordered logically
  const monthlyGroups = useMemo(() => {
    type GroupMapValue = MonthlyRuleInfo & {
      schedules: ScheduleWithCommunity[];
    };

    const map = new Map<string, GroupMapValue>();

    const monthlySchedules = allSchedulesWithCommunity.filter(
      (s) => s.recurrenceType === 'monthly'
    );

    for (const schedule of monthlySchedules) {
      const ruleInfo = getMonthlyRuleInfo(schedule);

      if (!map.has(ruleInfo.key)) {
        map.set(ruleInfo.key, {
          ...ruleInfo,
          schedules: [],
        });
      }

      map.get(ruleInfo.key)?.schedules.push(schedule);
    }

    // Sort groups by rule order weight (e.g. Day 1..31 first, then 1st Sáb, 3ª Sex, Últ. Dom)
    const groups = Array.from(map.values()).sort((a, b) => a.orderWeight - b.orderWeight);

    // Sort schedules within each group by start time
    for (const group of groups) {
      group.schedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return groups;
  }, [allSchedulesWithCommunity]);

  const totalMonthlySchedules = useMemo(() => {
    return monthlyGroups.reduce((acc, curr) => acc + curr.schedules.length, 0);
  }, [monthlyGroups]);

  const isLoading = isLoadingCommunities || isLoadingSchedules;

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'programacao-e-eventos',
            href: ROUTES.CALENDAR.HOME,
            title: 'Programação & Eventos',
            icon: CalendarIcon,
          },
          {
            key: 'programacao-recorrente',
            href: ROUTES.CALENDAR.RECURRING,
            title: 'Programação Recorrente',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
        {/* Page Title & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <TypographyH1>Programação Recorrente</TypographyH1>
            <Describe>
              Consulta dos horários habituais e celebrações periódicas das comunidades paroquiais.
            </Describe>
          </div>
        </div>

        {/* Navigation & Controls: Tabs and Community Filter */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'weekly' | 'monthly')}
          className="w-full space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
            {/* Category Tabs: Weekly & Monthly */}
            <TabsList className="bg-zinc-100 p-1 rounded-xl h-11 border border-zinc-200/60 self-start sm:self-auto">
              <TabsTrigger
                value="weekly"
                className="rounded-lg px-4 py-2 text-sm sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-2xs gap-2 cursor-pointer transition-all"
              >
                <Repeat className="w-3.5 h-3.5 text-[#B8872E]" />
                <span>Semanais</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 font-mono font-semibold">
                  {totalWeeklySchedules}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="monthly"
                className="rounded-lg px-4 py-2 text-sm sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-2xs gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
                <span>Mensais</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 font-mono font-semibold">
                  {totalMonthlySchedules}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Community Filter Select (applies across both tabs) */}
            <div className="w-full sm:w-80 space-y-1">
              <Select
                placeholder="Todas as Comunidades"
                value={selectedCommunityId}
                onValueChange={setSelectedCommunityId}
              >
                <SelectItem value="all" text="Todas as Comunidades" />
                {communities.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                    text={`${c.type === 'parish_church' ? 'Matriz ' : 'Capela '}${c.name}`}
                  />
                ))}
              </Select>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white border border-zinc-200/80 rounded-3xl space-y-3">
              <Spinner className="size-8 text-[#B8872E]" />
              <span className="text-sm text-zinc-500">
                Carregando celebrações das comunidades...
              </span>
            </div>
          ) : (
            <>
              {/* TAB 1: MISSAIS SEMANAIS */}
              <TabsContent value="weekly" className="space-y-10 outline-none">
                {totalWeeklySchedules === 0 ? (
                  <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center shadow-xs">
                    <div className="size-16 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] mx-auto mb-4">
                      <CalendarDays className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                      Nenhuma missa semanal encontrada
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
                      Não há horários semanais cadastrados para a comunidade selecionada.
                    </p>
                    {selectedCommunityId !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCommunityId('all')}
                        className="rounded-full text-sm"
                      >
                        Ver todas as comunidades
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-12">
                    {weeklyGroups.map((group) => {
                      const uniqueCommunities = new Set(
                        group.schedules.map((s) => s.community.id)
                      ).size;

                      return (
                        <section key={group.id} className="space-y-4">
                          {/* Day Header - Styled like CalendarView */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 capitalize">
                                  {group.label}
                                </h3>
                                <span className="text-sm text-zinc-500 font-medium">
                                  {group.schedules.length}{' '}
                                  {group.schedules.length === 1 ? 'celebração' : 'celebrações'} em{' '}
                                  {uniqueCommunities}{' '}
                                  {uniqueCommunities === 1 ? 'comunidade' : 'comunidades'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Independent celebration cards */}
                          <ul className="space-y-4 flex-1 w-full">
                            {group.schedules.map((schedule) => (
                              <li
                                key={`${schedule.id}-${schedule.community.id}`}
                                className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs hover:border-[#D6A64A]/60 transition-all space-y-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  {/* Left Details */}
                                  <div className="space-y-2 flex-1 min-w-0">
                                    {/* Badges row */}
                                    <div className="flex flex-wrap items-center gap-2">
                                      {/* Highlighted Time */}
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm sm:text-sm font-bold bg-[#fef8ed] text-[#B8872E] border border-[#D6A64A]/40 font-mono shadow-2xs">
                                        <Clock className="w-3.5 h-3.5 text-[#B8872E]" />
                                        {schedule.startTime}
                                      </span>

                                      {/* Mass Type Badges */}
                                      {schedule.type === 'devotional' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200/80">
                                          <Sparkles className="w-3 h-3 text-purple-600" />
                                          Devocional
                                        </span>
                                      )}
                                      {schedule.type === 'solemnity' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
                                          <Sparkles className="w-3 h-3 text-amber-600" />
                                          Solenidade
                                        </span>
                                      )}
                                      {schedule.type === 'ordinary' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
                                          <Repeat className="w-3 h-3 text-blue-600" />
                                          Semanal
                                        </span>
                                      )}

                                      {/* Precept Badge */}
                                      {schedule.isPrecept && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                          Preceito
                                        </span>
                                      )}

                                      {!schedule.active && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                                          Inativo
                                        </span>
                                      )}
                                    </div>

                                    {/* Celebration Title */}
                                    <div className="space-y-1">
                                      <h4 className="text-base sm:text-lg font-semibold text-zinc-900 leading-snug">
                                        Santa Missa
                                        {schedule.type === 'devotional' && schedule.title
                                          ? ` Devocional — ${schedule.title}`
                                          : ''}
                                        {schedule.type === 'solemnity' && schedule.title
                                          ? ` Solene — ${schedule.title}`
                                          : ''}
                                        {schedule.type === 'ordinary' && schedule.title
                                          ? ` — ${schedule.title}`
                                          : ''}
                                      </h4>

                                      {schedule.orientations && (
                                        <p className="text-sm sm:text-sm text-zinc-600 font-serif leading-relaxed">
                                          {schedule.orientations}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Circular Community Avatar (40-48px aligned to right) */}
                                  <ChurchAvatar
                                    name={schedule.community.name}
                                    coverUrl={schedule.community.coverUrl}
                                  />
                                </div>

                                {/* Card Footer: Textual Community Name & Link */}
                                <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-sm">
                                  <div className="flex items-center gap-1.5 text-zinc-600">
                                    <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                                    <span className="font-medium text-zinc-800">
                                      {schedule.community.type === 'parish_church'
                                        ? 'Matriz '
                                        : 'Capela '}
                                      {schedule.community.name}
                                    </span>
                                    {schedule.community.address && (
                                      <span className="hidden md:inline text-zinc-400">
                                        • {schedule.community.address}
                                      </span>
                                    )}
                                  </div>

                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm h-7 px-2.5 text-zinc-500 hover:text-[#B8872E] hover:bg-[#fef8ed]/50 gap-1"
                                  >
                                    <Link href={ROUTES.COMMUNITIES.DETAILS(schedule.community.slug)}>
                                      <span>Ver comunidade</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* TAB 2: MISSAS E DEVOÇÕES MENSAIS */}
              <TabsContent value="monthly" className="space-y-10 outline-none">
                {totalMonthlySchedules === 0 ? (
                  <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center shadow-xs">
                    <div className="size-16 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] mx-auto mb-4">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                      Nenhuma devoção ou missa mensal encontrada
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
                      Não há celebrações mensais ou regras de recorrência cadastradas para a comunidade selecionada.
                    </p>
                    {selectedCommunityId !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCommunityId('all')}
                        className="rounded-full text-sm"
                      >
                        Ver todas as comunidades
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-12">
                    {monthlyGroups.map((group) => {
                      const uniqueCommunities = new Set(
                        group.schedules.map((s) => s.community.id)
                      ).size;

                      return (
                        <section key={group.key} className="space-y-4">
                          {/* Monthly Rule Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900">
                                  {group.ruleTitle}
                                </h3>
                                <span className="text-sm text-zinc-500 font-medium">
                                  {group.schedules.length}{' '}
                                  {group.schedules.length === 1
                                    ? 'celebração'
                                    : 'celebrações'}{' '}
                                  em {uniqueCommunities}{' '}
                                  {uniqueCommunities === 1 ? 'comunidade' : 'comunidades'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Independent celebration cards */}
                          <ul className="space-y-4 flex-1 w-full">
                            {group.schedules.map((schedule) => (
                              <li
                                key={`${schedule.id}-${schedule.community.id}`}
                                className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs hover:border-[#D6A64A]/60 transition-all space-y-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  {/* Left Details */}
                                  <div className="space-y-2 flex-1 min-w-0">
                                    {/* Badges row: Prominent Recurrence Rule + Time */}
                                    <div className="flex flex-wrap items-center gap-2">
                                      {/* Highlighted Time */}
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm sm:text-sm font-bold bg-[#fef8ed] text-[#B8872E] border border-[#D6A64A]/40 font-mono shadow-2xs">
                                        <Clock className="w-3.5 h-3.5 text-[#B8872E]" />
                                        {schedule.startTime}
                                      </span>

                                      {/* Mass Type Badges */}
                                      {schedule.type === 'devotional' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200/80">
                                          <Sparkles className="w-3 h-3 text-purple-600" />
                                          Devocional
                                        </span>
                                      )}
                                      {schedule.type === 'solemnity' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
                                          <Sparkles className="w-3 h-3 text-amber-600" />
                                          Solenidade
                                        </span>
                                      )}
                                      {schedule.type === 'ordinary' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
                                          Missa Regular
                                        </span>
                                      )}

                                      {/* Precept Badge */}
                                      {schedule.isPrecept && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                          Preceito
                                        </span>
                                      )}

                                      {!schedule.active && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                                          Inativo
                                        </span>
                                      )}
                                    </div>

                                    {/* Celebration Title */}
                                    <div className="space-y-1">
                                      <h4 className="text-base sm:text-lg font-semibold text-zinc-900 leading-snug">
                                        Santa Missa
                                        {schedule.type === 'devotional' && schedule.title
                                          ? ` Devocional — ${schedule.title}`
                                          : ''}
                                        {schedule.type === 'solemnity' && schedule.title
                                          ? ` Solene — ${schedule.title}`
                                          : ''}
                                        {schedule.type === 'ordinary' && schedule.title
                                          ? ` — ${schedule.title}`
                                          : ''}
                                      </h4>

                                      {schedule.orientations && (
                                        <p className="text-sm sm:text-sm text-zinc-600 font-serif leading-relaxed">
                                          {schedule.orientations}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Circular Community Avatar (40-48px aligned to right) */}
                                  <ChurchAvatar
                                    name={schedule.community.name}
                                    coverUrl={schedule.community.coverUrl}
                                  />
                                </div>

                                {/* Card Footer: Textual Community Name & Link */}
                                <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-sm">
                                  <div className="flex items-center gap-1.5 text-zinc-600">
                                    <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                                    <span className="font-medium text-zinc-800">
                                      {schedule.community.type === 'parish_church'
                                        ? 'Matriz '
                                        : 'Capela '}
                                      {schedule.community.name}
                                    </span>
                                    {schedule.community.address && (
                                      <span className="hidden md:inline text-zinc-400">
                                        • {schedule.community.address}
                                      </span>
                                    )}
                                  </div>

                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm h-7 px-2.5 text-zinc-500 hover:text-[#B8872E] hover:bg-[#fef8ed]/50 gap-1"
                                  >
                                    <Link href={ROUTES.COMMUNITIES.DETAILS(schedule.community.slug)}>
                                      <span>Ver comunidade</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </>
  );
}
