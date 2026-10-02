'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  CalendarPlus,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useAppointments } from '@/api/appointments/use-appointments';
import useAuthStore from '@/stores/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { MinhaAgendaHeader } from '@/components/features/minha-agenda/top-header';
import { AppointmentCard } from '@/components/features/minha-agenda/appointment-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function MinhaAgendaHomePage() {
  const { user } = useAuthStore();
  const { appointments, isPending } = useAppointments();

  const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  // Filter ONLY confirmed appointments from today onwards, sorted chronologically
  const upcomingConfirmed = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((app) => app.status === 'confirmed' && app.appointmentDate >= todayStr)
      .sort((a, b) => {
        if (a.appointmentDate !== b.appointmentDate) {
          return a.appointmentDate.localeCompare(b.appointmentDate);
        }
        return a.startTime.localeCompare(b.startTime);
      });
  }, [appointments, todayStr]);

  const firstName = useMemo(() => {
    if (!user?.name) return 'Agente Pastoral';
    return user.name.trim().split(/\s+/)[0];
  }, [user?.name]);

  return (
    <div className="flex flex-col flex-1">
      {/* Top Header with Parish Crest & Initials */}
      <MinhaAgendaHeader isHome />

      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Welcome Greeting */}
        <section className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-serif">
            Olá, {firstName}!
          </h1>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Aqui estão seus próximos atendimentos e a sua agenda.
          </p>
        </section>

        {/* Section: Próximos Atendimentos */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href={ROUTES.MY_AGENDA.SCHEDULE}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-zinc-900 group-hover:text-brand-800 transition-colors">
                Próximos atendimentos
              </h2>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Cards List or Skeleton */}
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : upcomingConfirmed.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-zinc-300 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-800">
                  Nenhum atendimento agendado
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Você não possui atendimentos confirmados nos próximos dias.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingConfirmed.slice(0, 4).map((item) => (
                <AppointmentCard
                  key={item.id}
                  appointment={item}
                  showDate
                />
              ))}
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <section className="space-y-3 pt-2">
          {/* Main CTA: Agendar atendimento */}
          <Button
            asChild
            className="w-full h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-sm active:scale-[0.99] gap-2"
          >
            <Link href={ROUTES.MY_AGENDA.NEW}>
              <CalendarPlus className="w-5 h-5 text-brand-300" />
              <span>Agendar atendimento</span>
            </Link>
          </Button>

          {/* Secondary CTA: Ver toda a agenda */}
          <Link
            href={ROUTES.MY_AGENDA.SCHEDULE}
            className="w-full h-12 rounded-2xl bg-white border border-zinc-200/90 hover:bg-zinc-50 text-zinc-800 font-medium text-sm flex items-center justify-between px-4 shadow-2xs active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-zinc-500 group-hover:text-brand-800 transition-colors" />
              <span>Ver toda a agenda</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </section>
      </div>
    </div>
  );
}
