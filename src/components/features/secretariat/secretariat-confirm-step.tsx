'use client';

import React from 'react';
import { TypographyH2 } from '@/components/ui/typography/h2';
import {
  Check,
  Phone,
  Clock,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';
import type { SecretariatFormValues } from './secretariat-form-step';

interface SecretariatConfirmStepProps {
  values: SecretariatFormValues;
}

export const SecretariatConfirmStep = ({
  values,
}: SecretariatConfirmStepProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 sm:py-8 flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-700">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <TypographyH2 className="text-center">Confirmação</TypographyH2>
          <p className="text-center text-zinc-600 mt-2 text-sm">
            Revise as alterações dos canais de contato, horários e redes sociais antes de salvar.
          </p>
        </div>

        <div className="w-full max-w-2xl divide-y divide-divider mt-2">
          {/* 1. Canais de Contato */}
          <div className="py-4 space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Canais de Contato Direto
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Phone className="w-4 h-4 text-[#B8872E] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Telefone Fixo</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.phone || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">WhatsApp de Atendimento</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.whatsapp || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Mail className="w-4 h-4 text-[#B8872E] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">E-mail Oficial</span>
                  <span className="font-semibold text-zinc-900 truncate block">
                    {values.email || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Horário de Funcionamento */}
          <div className="py-4 space-y-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Horário de Atendimento da Secretaria
            </span>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <Clock className="w-4 h-4 text-[#B8872E] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                {values.officeHours ? (
                  <p className="text-sm text-zinc-800 whitespace-pre-line leading-relaxed font-medium">
                    {values.officeHours}
                  </p>
                ) : (
                  <span className="text-sm text-zinc-400 italic">Não informado</span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Endereço */}
          <div className="py-4 space-y-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Endereço Físico
            </span>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <MapPin className="w-4 h-4 text-[#B8872E] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-zinc-900 block">
                  {values.address || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Redes Sociais */}
          <div className="py-4 space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Redes Sociais e Mensageiros
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Instagram</span>
                  <span className="font-medium text-xs text-zinc-800 truncate block">
                    {values.instagramUrl || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">YouTube</span>
                  <span className="font-medium text-xs text-zinc-800 truncate block">
                    {values.youtubeUrl || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Facebook</span>
                  <span className="font-medium text-xs text-zinc-800 truncate block">
                    {values.facebookUrl || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-zinc-400 block font-medium">Link WhatsApp</span>
                  <span className="font-medium text-xs text-zinc-800 truncate block">
                    {values.whatsappUrl || <span className="text-zinc-400 font-normal italic">Não informado</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
