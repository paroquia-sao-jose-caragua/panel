'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  User,
  MapPin,
  Home,
  HeartHandshake,
  MoreHorizontal,
  Eye,
  Pencil,
  MessageCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Appointment } from '@/entities/appointment';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface AppointmentCalendarItemProps {
  appointment: Appointment;
  onCancel: (appointment: Appointment) => void;
  onOpenWhatsApp?: (appointment: Appointment) => void;
  isStaff?: boolean;
}

export const AppointmentCalendarItem = ({
  appointment,
  onCancel,
  onOpenWhatsApp,
  isStaff = true,
}: AppointmentCalendarItemProps) => {
  const isHomeVisit = appointment.service?.category === 'home_visit';
  const serviceTitle = appointment.service?.title || 'Atendimento Pastoral';
  const serviceDescription = appointment.service?.description;
  const requesterName = appointment.requesterName || 'Solicitante';
  const communityName =
    appointment.community?.name || 'Comunidade Matriz / Paróquia';

  const agentTitle = appointment.agent?.title
    ? `${appointment.agent.title} `
    : '';
  const agentName = appointment.agent?.name || 'Agente Pastoral';
  const agentRole = appointment.agent?.actingRole;

  // Dot & badge styling according to service category
  const getAccentColor = (title: string, category?: string) => {
    const lower = `${title} ${category || ''}`.toLowerCase();
    if (lower.includes('confiss')) {
      return {
        dot: 'bg-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      };
    }
    if (lower.includes('aconselhamento') || lower.includes('direção')) {
      return {
        dot: 'bg-amber-500',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      };
    }
    if (lower.includes('visita') || lower.includes('enfermo')) {
      return {
        dot: 'bg-purple-600',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200/80',
      };
    }
    return {
      dot: 'bg-[#11291f]',
      badgeBg: 'bg-brand-50 text-brand-900 border-brand-200/80',
    };
  };

  const accent = getAccentColor(serviceTitle, appointment.service?.category);

  return (
    <li className="group bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Time and Accent Dot */}
        <div className="flex items-center sm:items-start gap-3 shrink-0 sm:min-w-[110px]">
          <div className="flex flex-col">
            <span className="font-mono text-base sm:text-lg font-bold text-zinc-900 tracking-tight leading-none">
              {appointment.startTime}
            </span>
            {appointment.endTime && (
              <span className="text-[11px] font-mono text-zinc-400 mt-1">
                até {appointment.endTime}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center pt-1 shrink-0">
            <span className={cn('w-2.5 h-2.5 rounded-full', accent.dot)} />
          </div>
        </div>

        {/* Center: Service, Requester, Location, Agent */}
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:items-center">
          {/* Service Title & Description */}
          <div className="md:col-span-5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={ROUTES.APPOINTMENTS.DETAILS(appointment.id)}
                className="text-base font-bold text-zinc-900 tracking-tight truncate hover:text-[#11291f] hover:underline"
              >
                {serviceTitle}
              </Link>
              {isHomeVisit && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                  <Home className="w-3 h-3 text-emerald-600" />
                  <span>Visita Domiciliar</span>
                </span>
              )}
            </div>
            {serviceDescription && (
              <p className="text-xs text-zinc-500 font-serif line-clamp-1 mt-0.5">
                {serviceDescription}
              </p>
            )}
          </div>

          {/* Requester & Location */}
          <div className="md:col-span-4 min-w-0 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-800 truncate">
              <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="font-semibold text-zinc-900 truncate">
                {requesterName}
              </span>
              {appointment.requesterRelationship && (
                <span className="text-zinc-400 text-[11px] shrink-0">
                  ({appointment.requesterRelationship})
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-zinc-500 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
              <span className="truncate">
                {isHomeVisit && appointment.patientAddress
                  ? appointment.patientAddress
                  : communityName}
              </span>
            </div>

            {appointment.patientName &&
              appointment.patientName !== appointment.requesterName && (
                <div className="text-[11px] text-zinc-500 truncate pl-5">
                  <span>Enfermo: </span>
                  <span className="font-medium text-zinc-800">
                    {appointment.patientName}
                  </span>
                  {appointment.patientConditions?.isBedridden && (
                    <Badge
                      variant="outline"
                      className="ml-1 text-[9px] py-0 px-1 border-rose-200 text-rose-700 bg-rose-50"
                    >
                      Acamado
                    </Badge>
                  )}
                </div>
              )}
          </div>

          {/* Pastoral Agent */}
          <div className="md:col-span-3 min-w-0 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-700 truncate">
              <HeartHandshake className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
              <span className="font-medium text-zinc-900 truncate">
                {agentTitle}
                {agentName}
              </span>
            </div>
            {agentRole && (
              <span className="text-[11px] text-zinc-400 block truncate pl-5">
                {agentRole}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions menu ⋯ */}
        <div className="flex items-center justify-end sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg cursor-pointer"
                aria-label="Opções do atendimento"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 shadow-lg">
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.APPOINTMENTS.EDIT(appointment.id)}
                  className="cursor-pointer"
                >
                  <Pencil className="w-4 h-4 mr-2 text-zinc-500" />
                  <span>Editar</span>
                </Link>
              </DropdownMenuItem>
              {isStaff && onOpenWhatsApp && (
                <DropdownMenuItem
                  onClick={() => onOpenWhatsApp(appointment)}
                  className="cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>Notificar WhatsApp</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onCancel(appointment)}
                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
              >
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                <span>Cancelar atendimento</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Requester Notes (if present) */}
      {appointment.requesterNotes && (
        <div className="w-full pt-2 border-t border-zinc-100 text-xs text-amber-900 bg-amber-50/50 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5">
          <span className="font-semibold shrink-0">Observação:</span>
          <span className="line-clamp-1 text-zinc-600">
            {appointment.requesterNotes}
          </span>
        </div>
      )}
    </li>
  );
};
