'use client';

import React from 'react';
import {
  Clock,
  User,
  Phone,
  MapPin,
  Home,
  XCircle,
  HeartHandshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Appointment } from '@/entities/appointment';

interface AppointmentCalendarItemProps {
  appointment: Appointment;
  onCancel: (appointment: Appointment) => void;
}

export const AppointmentCalendarItem = ({
  appointment,
  onCancel,
}: AppointmentCalendarItemProps) => {
  const isHomeVisit = appointment.service?.category === 'home_visit';

  return (
    <li className="group bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs hover:border-[#D6A64A]/50 transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Top Header: Time, Home Visit Badge (if applicable), Agent */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Horário */}
            <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-zinc-900 bg-amber-50/60 border border-amber-200/60 rounded-lg px-2.5 py-1">
              <Clock className="w-4 h-4 text-[#B8872E]" />
              <span>
                {appointment.startTime}
                {appointment.endTime ? ` — ${appointment.endTime}` : ''}
              </span>
            </div>

            {/* Apenas Visita Domiciliar quando for o caso */}
            {isHomeVisit && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                <Home className="w-3 h-3 text-emerald-600" />
                <span>Visita Domiciliar</span>
              </span>
            )}
          </div>

          {/* Agente Pastoral Responsável */}
          <div className="flex items-center gap-2 text-xs self-start sm:self-auto shrink-0 bg-zinc-50 border border-zinc-200/70 rounded-xl px-2.5 py-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
            <div className="text-left">
              <span className="font-semibold text-zinc-900 block truncate max-w-44">
                {appointment.agent?.title ? `${appointment.agent.title} ` : ''}
                {appointment.agent?.name || 'Agente Pastoral'}
              </span>
              <span className="text-[10px] text-zinc-500 block truncate">
                {appointment.agent?.actingRole || 'Pastoral'}
              </span>
            </div>
          </div>
        </div>

        {/* Content: Title & Orientations */}
        <div className="space-y-1">
          <h4
            className="text-lg sm:text-xl font-semibold text-zinc-900 leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {appointment.service?.title || 'Atendimento Pastoral'}
          </h4>

          {appointment.service?.description && (
            <p className="text-xs sm:text-sm text-zinc-600 font-serif leading-relaxed line-clamp-2">
              {appointment.service.description}
            </p>
          )}
        </div>

        {/* Fiel / Solicitante e detalhes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 bg-zinc-50/80 rounded-xl border border-zinc-200/60 text-xs">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-zinc-800 truncate">
              <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="font-semibold truncate">{appointment.requesterName}</span>
              {appointment.requesterRelationship && (
                <span className="text-zinc-500 font-normal shrink-0">
                  ({appointment.requesterRelationship})
                </span>
              )}
            </div>

            {appointment.patientName && appointment.patientName !== appointment.requesterName && (
              <div className="text-zinc-600 pl-5 text-[11px] truncate">
                <span className="text-zinc-400">Enfermo:</span>{' '}
                <span className="font-medium text-zinc-800">{appointment.patientName}</span>
                {appointment.patientConditions?.isBedridden && (
                  <Badge variant="outline" className="ml-1 text-[9px] py-0 px-1 border-rose-200 text-rose-700 bg-rose-50">
                    Acamado
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1 sm:text-right min-w-0 flex flex-col sm:items-end justify-center">
            {appointment.requesterPhone && (
              <div className="flex items-center gap-1.5 text-zinc-600 text-[11px]">
                <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                <span className="font-mono">{appointment.requesterPhone}</span>
              </div>
            )}

            {isHomeVisit && appointment.patientAddress && (
              <div className="flex items-center gap-1 text-zinc-600 text-[11px] truncate max-w-full">
                <MapPin className="w-3 h-3 text-[#B8872E] shrink-0" />
                <span className="truncate" title={appointment.patientAddress}>
                  {appointment.patientAddress}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Private notes or requester notes if present */}
        {appointment.requesterNotes && (
          <div className="text-xs text-zinc-500 bg-amber-50/40 border border-amber-200/50 rounded-lg p-2.5">
            <span className="font-medium text-amber-900 block mb-0.5">Observação do solicitante:</span>
            <p className="line-clamp-2">{appointment.requesterNotes}</p>
          </div>
        )}
      </div>

      {/* Card Footer: Somente o botão de Cancelar */}
      <div className="mt-2 pt-3 border-t border-zinc-100 flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5 text-zinc-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50 text-xs h-8 cursor-pointer shadow-2xs"
          onClick={() => onCancel(appointment)}
        >
          <XCircle className="w-3.5 h-3.5 text-red-500" />
          <span>Cancelar</span>
        </Button>
      </div>
    </li>
  );
};
