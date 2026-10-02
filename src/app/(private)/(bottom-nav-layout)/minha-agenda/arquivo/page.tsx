'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Archive,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useAppointments } from '@/api/appointments/use-appointments';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { ROUTES } from '@/constants/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Appointment, AppointmentStatus } from '@/entities/appointment';

type ArchiveFilter = 'all' | 'completed' | 'cancelled';

export default function MinhaAgendaArchivePage() {
  const { appointments, isPending } = useAppointments();
  const [filter, setFilter] = useState<ArchiveFilter>('all');

  // Filter ONLY completed and cancelled appointments, sorted most recent first
  const archiveAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((app) => {
        const isArchived =
          app.status === 'completed' || app.status === 'cancelled';
        if (!isArchived) return false;

        if (filter === 'completed') return app.status === 'completed';
        if (filter === 'cancelled') return app.status === 'cancelled';
        return true;
      })
      .sort((a, b) => {
        if (a.appointmentDate !== b.appointmentDate) {
          return b.appointmentDate.localeCompare(a.appointmentDate);
        }
        return b.startTime.localeCompare(a.startTime);
      });
  }, [appointments, filter]);

  return (
    <div className="flex flex-col flex-1">
      <MinhaAgendaHeader
        title="Arquivo de Atendimentos"
        backHref={ROUTES.MY_AGENDA.SCHEDULE}
      />

      <div className="px-4 pt-4 pb-8 space-y-5">
        {/* Intro */}
        <section className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-serif">
            Histórico de Atendimentos
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Atendimentos anteriores realizados ou cancelados para simples consulta.
          </p>
        </section>

        {/* Filter Chips */}
        <section className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none',
              filter === 'all'
                ? 'bg-brand-900 text-white shadow-xs'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            )}
          >
            Todos
          </button>

          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none',
              filter === 'completed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            )}
          >
            Realizados
          </button>

          <button
            type="button"
            onClick={() => setFilter('cancelled')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none',
              filter === 'cancelled'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            )}
          >
            Cancelados
          </button>
        </section>

        {/* Items List */}
        <section className="space-y-3">
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          ) : archiveAppointments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-zinc-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <Archive className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-700">
                Nenhum registro encontrado
              </p>
              <p className="text-xs text-zinc-400">
                Não há atendimentos no arquivo com os filtros selecionados.
              </p>
            </div>
          ) : (
            archiveAppointments.map((app) => {
              const d = dayjs(app.appointmentDate).locale('pt-br');
              const dayStr = d.format('DD');
              const monthStr = d.format('MMM').toUpperCase();
              const isCompleted = app.status === 'completed';

              return (
                <Link
                  key={app.id}
                  href={ROUTES.MY_AGENDA.DETAILS(app.id)}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all active:scale-[0.99] group select-none"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Date Block */}
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/80 flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm font-black text-zinc-800 leading-none">
                        {dayStr}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500 tracking-wider mt-0.5">
                        {monthStr}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col min-w-0 flex-1 pr-1">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mb-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{app.startTime}</span>
                      </div>

                      <h3 className="text-sm font-bold text-zinc-900 truncate">
                        {app.service?.title || 'Atendimento Pastoral'}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-1 truncate">
                        <User className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">{app.requesterName}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {app.community?.name || 'Comunidade Matriz'}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="mt-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Realizado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                            <XCircle className="w-3 h-3 text-red-500" />
                            Cancelado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
