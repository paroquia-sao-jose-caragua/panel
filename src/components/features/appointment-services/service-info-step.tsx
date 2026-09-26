'use client';

import React from 'react';
import { Tag, Clock, MapPin, Sparkles, Cross, Home, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { AppointmentServiceFormValues } from './types';
import type { AppointmentServiceCategory } from '@/entities/appointment-service';

interface ServiceInfoStepProps {
  values: AppointmentServiceFormValues;
  onChange: <K extends keyof AppointmentServiceFormValues>(
    field: K,
    value: AppointmentServiceFormValues[K]
  ) => void;
  errors: Record<string, string>;
}

const CATEGORY_OPTIONS: {
  value: AppointmentServiceCategory;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  borderColor: string;
  badgeColor: string;
}[] = [
  {
    value: 'clergy_sacramental',
    title: 'Sacramental (Exclusivo Clérigos)',
    badge: 'Padres / Sacerdotes',
    description:
      'Reservado estritamente para sacramentos ministeriais católicos (ex: Sacramento da Reconciliação / Confissão).',
    icon: Cross,
    borderColor: 'border-purple-300 peer-checked:border-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    value: 'home_visit',
    title: 'Visita Domiciliar',
    badge: 'Em Domicílio / Hospital',
    description:
      'Atendimento realizado na residência ou leito hospitalar do fiel (ex: Comunhão aos Enfermos, Unção).',
    icon: Home,
    borderColor: 'border-amber-300 peer-checked:border-amber-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    value: 'pastoral',
    title: 'Pastoral & Acolhimento',
    badge: 'Geral / Aberto',
    description:
      'Escuta fraterna, orientação e bênçãos realizadas por padres, diáconos ou agentes pastorais autorizados.',
    icon: HeartHandshake,
    borderColor: 'border-sky-300 peer-checked:border-sky-600',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
];

const PRESET_DURATIONS = [15, 20, 30, 45, 60, 90];

export const ServiceInfoStep = ({ values, onChange, errors }: ServiceInfoStepProps) => {
  return (
    <div className="space-y-8">
      {/* Identificação da Categoria */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-700" />
            <span>Identificação da Categoria</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Defina o nome e os parâmetros essenciais deste tipo de atendimento pastoral.
          </p>
        </div>

        {/* Título */}
        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Nome do Atendimento / Categoria <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Ex: Confissão, Direção Espiritual, Visita aos Enfermos"
            className={`h-10 ${errors.title ? 'border-red-500 focus-error' : ''}`}
          />
          {errors.title && (
            <span className="text-xs text-red-500 mt-1 block">{errors.title}</span>
          )}
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Nome exibido aos fiéis no momento da escolha do serviço no site.
          </span>
        </div>

        {/* Tipo Canônico / Natureza */}
        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-2">
            Natureza da Categoria <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CATEGORY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = values.category === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    onChange('category', opt.value);
                    if (opt.value === 'home_visit') {
                      onChange('requiresAddress', true);
                    }
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-50/70 border-brand-600 shadow-xs ring-2 ring-brand-500/20'
                      : 'bg-zinc-50/50 border-zinc-200 hover:bg-zinc-100/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-white border border-zinc-200 shadow-2xs">
                        <Icon className="w-4 h-4 text-brand-700" />
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-zinc-900 block mb-1">
                      {opt.title}
                    </span>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-600">
                      {isSelected ? 'Selecionado' : 'Selecionar'}
                    </span>
                    <div
                      className={`size-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-brand-700 bg-brand-700 text-white'
                          : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.category && (
            <span className="text-xs text-red-500 mt-1 block">{errors.category}</span>
          )}
        </div>

        {/* Duração Padrão */}
        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Duração Estimada por Atendimento <span className="text-red-500">*</span></span>
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {PRESET_DURATIONS.map((mins) => {
              const isSelected = Number(values.defaultDurationMinutes) === mins;
              return (
                <button
                  type="button"
                  key={mins}
                  onClick={() => onChange('defaultDurationMinutes', mins)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-700 text-white border-brand-700 shadow-2xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {mins} min
                </button>
              );
            })}
          </div>

          <div className="max-w-xs flex items-center gap-2">
            <Input
              type="number"
              min={5}
              max={480}
              value={values.defaultDurationMinutes || ''}
              onChange={(e) => onChange('defaultDurationMinutes', Number(e.target.value))}
              className="h-9 w-32"
            />
            <span className="text-xs text-zinc-500">minutos por vaga/sessão</span>
          </div>
          {errors.defaultDurationMinutes && (
            <span className="text-xs text-red-500 mt-1 block">{errors.defaultDurationMinutes}</span>
          )}
        </div>

        {/* Descrição e Orientações */}
        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Descrição e Orientações para os Fiéis (Opcional)
          </label>
          <Textarea
            value={values.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Ex: Sacramento da Penitência e Reconciliação com o sacerdote. O fiel deve fazer previamente seu exame de consciência..."
            className="min-h-24 resize-y"
          />
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Este texto é exibido no card de seleção do site para informar adequadamente a comunidade sobre o atendimento.
          </span>
        </div>
      </div>

      {/* Regras Operacionais */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-5">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-700" />
            <span>Configurações Operacionais</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Defina requisitos de endereço e a visibilidade imediata no sistema.
          </p>
        </div>

        {/* Exigência de Endereço */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-700" />
              <span className="font-semibold text-sm text-zinc-900">
                Exigir Endereço Residencial no Agendamento
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Se ativado, o fiel ou familiar precisará obrigatoriamente preencher rua, número, bairro e condições do paciente (essencial para visitas a enfermos).
            </p>
          </div>
          <Switch
            checked={values.requiresAddress}
            onCheckedChange={(checked) => onChange('requiresAddress', checked)}
          />
        </div>

        {/* Status Ativo */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-700" />
              <span className="font-semibold text-sm text-zinc-900">
                Categoria Ativa para Agendamentos
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Categorias desativadas não aparecerão para agendamento pelos fiéis nem na vinculação de novos agentes.
            </p>
          </div>
          <Switch
            checked={values.active}
            onCheckedChange={(checked) => onChange('active', checked)}
          />
        </div>
      </div>
    </div>
  );
};
