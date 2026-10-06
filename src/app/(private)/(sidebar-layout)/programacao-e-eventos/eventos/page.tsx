'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  Filter,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  PartyPopper,
  BookOpen,
  Footprints,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectItem } from '@/components/common/select';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { ChurchAvatar } from '@/components/features/churches/church-avatar';
import { useCommunities } from '@/api/communities/use-communities';
import { listCalendarSchedules } from '@/api/calendar/list';
import { deleteEventSchedule } from '@/api/event-schedules/delete';
import type { EventSchedule } from '@/entities/CalendarSchedule';
import useTranslator from '@/hooks/use-translator';
import { ROUTES } from '@/constants/routes';
import { showAlert } from '@/utils/showAlert';
import { cn } from '@/lib/utils';

export default function ParochialEventsPage() {
  const { t } = useTranslator();
  const queryClient = useQueryClient();
  const { communities, isPending: isLoadingCommunities } = useCommunities();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const [eventToDelete, setEventToDelete] = useState<{
    id: string;
    title: string;
    date: string;
  } | null>(null);

  // Fetch calendar for current month and surrounding months to extract all events
  const currentYear = dayjs().year();
  const currentMonthNum = dayjs().month() + 1;

  // We query multiple months around current date for a complete view
  const monthsToQuery = useMemo(() => {
    const list: { month: number; year: number }[] = [];
    for (let offset = -2; offset <= 4; offset++) {
      const d = dayjs().add(offset, 'month');
      list.push({ month: d.month() + 1, year: d.year() });
    }
    return list;
  }, []);

  const { data: allEvents, isPending: isLoadingEvents } = useQuery({
    queryKey: ['parochial-all-events', selectedCommunityId],
    queryFn: async () => {
      const results = await Promise.all(
        monthsToQuery.map(({ month, year }) =>
          listCalendarSchedules({
            month,
            year,
            communityId: selectedCommunityId !== 'all' ? selectedCommunityId : undefined,
          })
        )
      );

      const eventsList: (EventSchedule & { eventDate: string })[] = [];
      const seenIds = new Set<string>();

      results.forEach((res) => {
        res.calendar?.forEach((day) => {
          day.schedules.active.forEach((schedule) => {
            if (schedule.type === 'event' && !seenIds.has(schedule.eventScheduleId)) {
              seenIds.add(schedule.eventScheduleId);
              eventsList.push({
                ...schedule,
                eventDate: day.date,
              });
            }
          });
        });
      });

      return eventsList.sort((a, b) => {
        const dateCompare = a.eventDate.localeCompare(b.eventDate);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
    },
    refetchOnWindowFocus: false,
  });

  // Delete mutation
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteEventSchedule,
    onSuccess: ({ statusCode }) => {
      if (statusCode === 200) {
        queryClient.invalidateQueries({ queryKey: ['parochial-all-events'] });
        queryClient.invalidateQueries({ queryKey: ['calendar-schedules'] });
        setEventToDelete(null);
      } else {
        showAlert('Não foi possível excluir o evento.');
      }
    },
    onError: () => {
      showAlert('Ocorreu um erro ao tentar excluir o evento.');
    },
  });

  // Filter events
  const todayStr = dayjs().format('YYYY-MM-DD');

  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];

    return allEvents.filter((event) => {
      // Period filter
      if (periodFilter === 'upcoming' && event.eventDate < todayStr) {
        return false;
      }
      if (periodFilter === 'past' && event.eventDate >= todayStr) {
        return false;
      }

      // Community filter
      if (selectedCommunityId !== 'all' && event.community.id !== selectedCommunityId) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && event.eventType !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = event.title.toLowerCase().includes(query);
        const locationMatch = event.customLocation?.toLowerCase().includes(query);
        const communityMatch = event.community.name.toLowerCase().includes(query);
        const orientationsMatch = event.orientations?.toLowerCase().includes(query);
        if (!titleMatch && !locationMatch && !communityMatch && !orientationsMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, periodFilter, todayStr, selectedCommunityId, selectedCategory, searchQuery]);

  // Category Icon and styling
  const getCategoryMeta = (type: EventSchedule['eventType']) => {
    switch (type) {
      case 'feast':
        return {
          label: 'Festa / Padroeiro',
          icon: PartyPopper,
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/80',
        };
      case 'liturgical_event':
        return {
          label: 'Celebração Litúrgica',
          icon: Sparkles,
          badgeClass: 'bg-purple-50 text-purple-900 border-purple-200/80',
        };
      case 'pilgrimage':
        return {
          label: 'Peregrinação / Procissão',
          icon: Footprints,
          badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200/80',
        };
      case 'formation':
        return {
          label: 'Formação / Catequese',
          icon: BookOpen,
          badgeClass: 'bg-blue-50 text-blue-900 border-blue-200/80',
        };
      case 'retreat':
        return {
          label: 'Retiro Espiritual',
          icon: Sparkles,
          badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
        };
      case 'service':
        return {
          label: 'Ação Social & Caridade',
          icon: Heart,
          badgeClass: 'bg-rose-50 text-rose-900 border-rose-200/80',
        };
      case 'meeting':
        return {
          label: 'Reunião Pastoral',
          icon: Users,
          badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
        };
      default:
        return {
          label: 'Evento Pontual',
          icon: CalendarDays,
          badgeClass: 'bg-blue-50 text-blue-900 border-blue-200/80',
        };
    }
  };

  const isInitialLoading = isLoadingEvents || isLoadingCommunities;

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
            key: 'eventos',
            href: ROUTES.CALENDAR.EVENTS,
            title: 'Eventos',
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <TypographyH1>Eventos Paroquiais</TypographyH1>
            </div>
            <Describe className="mt-1">
              Gerencie as festas de padroeiros, encontros, procissões, retiros e
              celebrações especiais pontuais das comunidades.
            </Describe>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Button asChild size="sm" className="gap-1.5 h-9 text-xs shadow-xs">
              <Link href={ROUTES.CALENDAR.ADD_EVENT}>
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Evento</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-6 shadow-xs space-y-3">
          {/* Period selector tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mr-2 hidden sm:inline">
              Período:
            </span>
            <div className="inline-flex rounded-xl p-1 bg-zinc-100 border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setPeriodFilter('upcoming')}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                  periodFilter === 'upcoming'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                )}
              >
                Próximos Eventos
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('past')}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                  periodFilter === 'past'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                )}
              >
                Eventos Anteriores
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('all')}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                  periodFilter === 'all'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                )}
              >
                Todos
              </button>
            </div>
          </div>

          {/* Search, Community & Category filter row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Buscar evento por nome ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Community Select */}
            <div className="sm:col-span-4">
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
            </div>

            {/* Category Select */}
            <div className="sm:col-span-3">
              <Select
                name="category"
                placeholder="Todas as categorias"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectItem value="all" text="Todas as categorias" />
                <SelectItem value="feast" text="Festa / Padroeiro" />
                <SelectItem value="liturgical_event" text="Celebração Litúrgica" />
                <SelectItem value="pilgrimage" text="Peregrinação / Procissão" />
                <SelectItem value="formation" text="Formação / Catequese" />
                <SelectItem value="retreat" text="Retiro Espiritual" />
                <SelectItem value="service" text="Ação Social & Caridade" />
                <SelectItem value="meeting" text="Reunião" />
                <SelectItem value="other" text="Outro" />
              </Select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isInitialLoading && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 shadow-xs">
            <Spinner className="text-[#B8872E] w-6 h-6" />
            <p className="text-sm font-medium text-zinc-600">
              Carregando eventos paroquiais...
            </p>
          </div>
        )}

        {!isInitialLoading && filteredEvents.length === 0 && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 mx-auto mb-3">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
              Nenhum evento encontrado
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
              Não foram encontrados eventos pontuais cadastrados para os critérios
              selecionados.
            </p>
            <Button asChild size="sm" className="gap-1.5 text-xs">
              <Link href={ROUTES.CALENDAR.ADD_EVENT}>
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar Novo Evento</span>
              </Link>
            </Button>
          </div>
        )}

        {!isInitialLoading && filteredEvents.length > 0 && (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const meta = getCategoryMeta(event.eventType);
              const CategoryIcon = meta.icon;
              const dateObj = dayjs(event.eventDate).locale('pt-br');
              const isPast = event.eventDate < todayStr;

              return (
                <div
                  key={event.eventScheduleId}
                  className={cn(
                    'bg-white border rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group',
                    isPast
                      ? 'border-zinc-200/60 opacity-70 bg-zinc-50/40'
                      : 'border-zinc-200/80 hover:border-[#D6A64A]/60'
                  )}
                >
                  {/* Left: Date Badge + Event Details */}
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div
                      className={cn(
                        'flex flex-col items-center justify-center rounded-2xl px-3 py-2 min-w-[62px] shrink-0 border shadow-2xs text-center',
                        isPast
                          ? 'bg-zinc-100 border-zinc-200/80 text-zinc-600'
                          : 'bg-white border-[#D6A64A]/50 text-zinc-900'
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase text-[#B8872E] tracking-wider">
                        {dateObj.format('ddd')}
                      </span>
                      <span className="text-2xl font-bold font-mono leading-none my-0.5">
                        {dateObj.format('DD')}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase">
                        {dateObj.format('MMM')}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5">
                      {/* Top Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200/80">
                          <CalendarDays className="w-3 h-3 text-blue-700" />
                          <span>Evento Pontual</span>
                        </span>

                        <span
                          className={cn(
                            'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                            meta.badgeClass
                          )}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          <span>{meta.label}</span>
                        </span>

                        {isPast && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-200/80 text-zinc-600">
                            Realizado
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
                        {event.title}
                      </h3>

                      {/* Time, Community & Location info */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-600">
                        {/* Time */}
                        <div className="flex items-center gap-1 font-mono font-semibold text-zinc-800">
                          <Clock className="w-3.5 h-3.5 text-[#B8872E]" />
                          <span>
                            {event.startTime}
                            {event.endTime ? ` — ${event.endTime}` : ''}
                          </span>
                        </div>

                        {/* Community */}
                        <div className="flex items-center gap-1.5">
                          <ChurchAvatar
                            name={event.community.name}
                            coverUrl={event.community.coverUrl}
                          />
                          <span className="font-medium text-zinc-800">
                            {event.community.name}
                          </span>
                        </div>

                        {/* Custom location */}
                        {event.customLocation && (
                          <div className="flex items-center gap-1 text-zinc-500">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate max-w-xs">
                              {event.customLocation}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pastoral orientations */}
                      {event.orientations && (
                        <p className="text-xs text-zinc-600 italic pt-1 line-clamp-2">
                          &ldquo;{event.orientations}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs h-8"
                    >
                      <Link
                        href={ROUTES.CALENDAR.EDIT_EVENT(event.eventScheduleId)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEventToDelete({
                          id: event.eventScheduleId,
                          title: event.title,
                          date: dateObj.format('D [de] MMMM'),
                        })
                      }
                      className="text-xs h-8 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                      title="Excluir evento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="md:hidden">Excluir</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={Boolean(eventToDelete)}
          onOpenChange={(open) => !open && setEventToDelete(null)}
          title="Excluir Evento Paroquial"
          description={`Tem certeza que deseja excluir o evento "${eventToDelete?.title}" agendado para ${eventToDelete?.date}? Esta ação removerá o evento do calendário paroquial.`}
          onConfirm={() => {
            if (eventToDelete) {
              mutateDelete(eventToDelete.id);
            }
          }}
          isPending={isDeleting}
        />
      </main>
    </>
  );
}
