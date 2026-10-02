'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, User } from 'lucide-react';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

interface AppointmentCardProps {
  appointment: Appointment;
  showDate?: boolean;
}

export function AppointmentCard({
  appointment,
  showDate = false,
}: AppointmentCardProps) {
  // Service category or title styling
  const serviceTitle =
    appointment.service?.title || 'Atendimento Pastoral';
  const requesterName = appointment.requesterName || 'Solicitante';
  const communityName =
    appointment.community?.name || 'Comunidade Matriz / Paróquia';

  // Format date if needed
  const dateFormatted = React.useMemo(() => {
    if (!appointment.appointmentDate) return '';
    const d = dayjs(appointment.appointmentDate).locale('pt-br');
    const dayWeek = d.format('ddd'); // Qui
    const dayMonth = d.format('DD MMM'); // 01 Out
    const capDayWeek = dayWeek.charAt(0).toUpperCase() + dayWeek.slice(1);
    return `${capDayWeek}, ${dayMonth}`;
  }, [appointment.appointmentDate]);

  // Color accents based on service or default
  const getAccentColor = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('confiss')) {
      return {
        dot: 'bg-emerald-600',
        line: 'border-emerald-200',
        badgeBg: 'bg-emerald-50 text-emerald-800',
      };
    }
    if (lower.includes('aconselhamento') || lower.includes('direção')) {
      return {
        dot: 'bg-amber-500',
        line: 'border-amber-200',
        badgeBg: 'bg-amber-50 text-amber-800',
      };
    }
    if (lower.includes('visita') || lower.includes('enfermo')) {
      return {
        dot: 'bg-purple-600',
        line: 'border-purple-200',
        badgeBg: 'bg-purple-50 text-purple-800',
      };
    }
    return {
      dot: 'bg-brand-700',
      line: 'border-zinc-200',
      badgeBg: 'bg-zinc-100 text-zinc-800',
    };
  };

  const accent = getAccentColor(serviceTitle);

  return (
    <Link
      href={ROUTES.MY_AGENDA.DETAILS(appointment.id)}
      className="group relative flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all active:scale-[0.99] select-none"
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Timeline accent dot */}
        <div className="flex flex-col items-center pt-1 shrink-0">
          <span className={cn('w-2.5 h-2.5 rounded-full', accent.dot)} />
        </div>

        {/* Info Content */}
        <div className="flex flex-col min-w-0 flex-1 pr-2">
          {/* Date & Time pill/header */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 mb-0.5">
            {showDate && (
              <>
                <span>{dateFormatted}</span>
                <span>•</span>
              </>
            )}
            <span className="text-zinc-900 font-bold tracking-tight">
              {appointment.startTime}
            </span>
          </div>

          {/* Service Title */}
          <h3 className="text-base font-bold text-zinc-900 tracking-tight leading-snug truncate">
            {serviceTitle}
          </h3>

          {/* Requester & Location */}
          <div className="flex flex-col gap-0.5 mt-1 text-xs text-zinc-600">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="font-medium text-zinc-800 truncate">
                {requesterName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="text-zinc-500 truncate">{communityName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Chevron */}
      <div className="pl-1 shrink-0 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all">
        <ChevronRight className="w-5 h-5" />
      </div>
    </Link>
  );
}
