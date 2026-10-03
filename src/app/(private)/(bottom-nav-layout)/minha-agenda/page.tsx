'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CalendarPlus,
  CalendarX,
  ChevronRight,
  ArrowRight,
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

  // Filter ONLY confirmed appointments for TODAY
  const todayAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter(
        (app) =>
          app.status === 'confirmed' && app.appointmentDate === todayStr
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, todayStr]);

  // Formatted date string for today, e.g. "Sexta-feira, 2 de outubro"
  const todayFormatted = useMemo(() => {
    const raw = dayjs().locale('pt-br').format('dddd, D [de] MMMM');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, []);

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
            Aqui está a sua programação pastoral para o dia de hoje.
          </p>
        </section>

        {/* Section: Atendimentos de Hoje */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-[36px] h-[36px] rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Atendimentos de hoje
                </h2>
                <p className="text-[11px] text-zinc-500 font-medium">
                  {todayFormatted}
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.MY_AGENDA.SCHEDULE}
              className="text-xs font-semibold text-brand-800 hover:text-brand-900 transition flex items-center gap-1 group py-1 px-2 rounded-lg hover:bg-brand-50 cursor-pointer"
            >
              <span>Ver agenda</span>
              <ChevronRight className="w-3.5 h-3.5 text-brand-700 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Cards List or Skeleton */}
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="p-7 text-center bg-white rounded-3xl border border-dashed border-zinc-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200/80 text-zinc-500 flex items-center justify-center mx-auto shadow-2xs">
                <CalendarX className="w-6 h-6 text-zinc-500" />
              </div>

              <div className="space-y-1.5">
                <p className="text-base font-bold text-zinc-900 font-serif">
                  Nenhum atendimento para hoje
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Você não possui atendimentos agendados para a data de hoje.
                  Aproveite para conferir os próximos dias na sua agenda completa.
                </p>
              </div>

              <div className="pt-1">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-zinc-300 hover:bg-zinc-50 text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Link href={ROUTES.MY_AGENDA.SCHEDULE}>
                    <Calendar className="w-4 h-4 text-brand-800" />
                    <span>Abrir agenda completa</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((item) => (
                <AppointmentCard
                  key={item.id}
                  appointment={item}
                  showDate={false}
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
            className="w-full h-12 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-sm active:scale-[0.99] gap-2 cursor-pointer"
          >
            <Link href={ROUTES.MY_AGENDA.NEW}>
              <CalendarPlus className="w-5 h-5 text-brand-300" />
              <span>Agendar atendimento</span>
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
