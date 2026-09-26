'use client';

import React from 'react';
import { Tag, Clock, MapPin, CheckCircle2, XCircle, Cross, Home, HeartHandshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AppointmentServiceFormValues } from './types';

interface ServiceConfirmStepProps {
  values: AppointmentServiceFormValues;
  mode: 'create' | 'edit';
}

export const ServiceConfirmStep = ({ values, mode }: ServiceConfirmStepProps) => {
  const getCategoryMeta = () => {
    switch (values.category) {
      case 'clergy_sacramental':
        return {
          title: 'Sacramental (Exclusivo Clérigos / Padres)',
          badge: 'Sacramental',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Cross,
        };
      case 'home_visit':
        return {
          title: 'Visita Domiciliar',
          badge: 'Visita Domiciliar',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Home,
        };
      case 'pastoral':
      default:
        return {
          title: 'Pastoral & Acolhimento',
          badge: 'Pastoral / Geral',
          badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
          icon: HeartHandshake,
        };
    }
  };

  const meta = getCategoryMeta();
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-4">
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider block mb-1">
            {mode === 'create' ? 'Revisão da Nova Categoria' : 'Revisão das Alterações'}
          </span>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-700" />
            <span>{values.title || 'Sem título'}</span>
          </h2>
        </div>

        {/* Badges de Status e Categoria */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={meta.badgeColor}>
            <Icon className="w-3 h-3 mr-1" />
            {meta.badge}
          </Badge>

          {values.active ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ativa para Agendamentos
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-zinc-100 text-zinc-600 border-zinc-300">
              <XCircle className="w-3 h-3 mr-1" />
              Inativa
            </Badge>
          )}

          {values.requiresAddress ? (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
              <MapPin className="w-3 h-3 mr-1" />
              Requer Endereço do Fiel
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-200">
              Atendimento no Local Paroquial
            </Badge>
          )}
        </div>

        {/* Grid de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-zinc-400" />
              Natureza Canônica
            </span>
            <span className="font-semibold text-sm text-zinc-900 block">
              {meta.title}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Duração Estimada
            </span>
            <span className="font-semibold text-sm text-zinc-900 block">
              {values.defaultDurationMinutes} minutos
            </span>
          </div>
        </div>

        {/* Descrição */}
        {values.description && (
          <div className="p-4 rounded-xl bg-zinc-50/50 border border-zinc-200/60 space-y-1.5">
            <span className="text-xs font-medium text-zinc-500 block">
              Descrição e Orientações aos Fiéis:
            </span>
            <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
              {values.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
