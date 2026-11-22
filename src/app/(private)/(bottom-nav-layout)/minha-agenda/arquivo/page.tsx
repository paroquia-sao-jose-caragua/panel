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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isAppointmentExpired } from '@/utils/appointment';
import type { Appointment, AppointmentStatus } from '@/entities/appointment';

type ArchiveFilter = 'all' | 'completed' | 'cancelled' | 'expired';

export default function MinhaAgendaArchivePage() {
  const { appointments, isPending } = useAppointments();
  const [filter, setFilter] = useState<ArchiveFilter>('all');

  // Filter completed, cancelled and expired pending appointments, sorted most recent first
  const archiveAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((app) => {
        const isCompleted = app.status === 'completed';
        const isCancelled = app.status === 'cancelled';
        const isExpired = app.status === 'pending' && isAppointmentExpired(app);
        const isArchived = isCompleted || isCancelled || isExpired;
        if (!isArchived) return false;

        if (filter === 'completed') return isCompleted;
        if (filter === 'cancelled') return isCancelled;
        if (filter === 'expired') return isExpired;
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
      <MinhaAgendaHeader title="Arquivo de Agendamentos" />

      <div className="px-4 pt-4 pb-8 space-y-5">
        {/* Intro */}
        <section className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-serif">
            Histórico de Agendamentos
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Agendamentos anteriores realizados, cancelados ou solicitações expiradas para simples consulta.
          </p>
        </section>

        {/* Filter Chips */}
        <section className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            type="button"
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={cn(
              'shrink-0',
              filter === 'all' ? 'bg-brand-900 hover:bg-brand-800 text-white' : 'text-zinc-600'
            )}
          >
            Todos
          </Button>

          <Button
            type="button"
            size="sm"
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={cn(
              'shrink-0',
              filter === 'completed'
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'text-zinc-600'
            )}
          >
            Realizados
          </Button>

          <Button
            type="button"
            size="sm"
            variant={filter === 'cancelled' ? 'destructive' : 'outline'}
            onClick={() => setFilter('cancelled')}
            className={cn(
              'shrink-0',
              filter === 'cancelled' ? 'bg-red-700 hover:bg-red-800' : 'text-zinc-600'
            )}
          >
            Cancelados
          </Button>

          <Button
            type="button"
            size="sm"
            variant={filter === 'expired' ? 'default' : 'outline'}
            onClick={() => setFilter('expired')}
            className={cn(
              'shrink-0',
              filter === 'expired'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'text-zinc-600'
            )}
          >
            Expirados
          </Button>
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
              <p className="text-sm text-zinc-400">
                Não há atendimentos no arquivo com os filtros selecionados.
              </p>
            </div>
          ) : (
            archiveAppointments.map((app) => {
              const d = dayjs(app.appointmentDate).locale('pt-br');
              const dayStr = d.format('DD');
              const monthStr = d.format('MMM').toUpperCase();
              const isCompleted = app.status === 'completed';
              const isExpired = app.status === 'pending' && isAppointmentExpired(app);

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
                      <div className="flex items-center gap-1.5 text-sm text-zinc-500 font-semibold mb-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{app.startTime}</span>
                      </div>

                      <h3 className="text-sm font-bold text-zinc-900 truncate">
                        {app.service?.title || 'Atendimento Pastoral'}
                      </h3>

                      <div className="flex items-center gap-1.5 text-sm text-zinc-600 mt-1 truncate">
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
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Expirado
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
