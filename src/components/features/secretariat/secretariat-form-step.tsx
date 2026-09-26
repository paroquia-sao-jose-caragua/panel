'use client';

import React from 'react';
import type { FormikProps } from 'formik';
import {
  Phone,
  Clock,
  MapPin,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  Sparkles,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';

export interface SecretariatFormValues {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  officeHours: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
}

interface SecretariatFormStepProps {
  formik: FormikProps<SecretariatFormValues>;
}

export const SecretariatFormStep = ({ formik }: SecretariatFormStepProps) => {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Canais de Contato Direto */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <Phone className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Canais de Contato Direto
            </h2>
            <p className="text-xs text-zinc-500">
              Telefone fixo, WhatsApp de atendimento e e-mail institucional
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              Telefone Fixo
            </label>
            <InputRoot
              error={formik.errors.phone}
              touched={formik.touched.phone}
            >
              <InputControl
                name="phone"
                value={formik.values.phone || ''}
                onChange={formik.handleChange}
                placeholder="Ex: (12) 3882-0000"
              />
            </InputRoot>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              WhatsApp de Atendimento
            </label>
            <InputRoot
              error={formik.errors.whatsapp}
              touched={formik.touched.whatsapp}
            >
              <InputControl
                name="whatsapp"
                value={formik.values.whatsapp || ''}
                onChange={formik.handleChange}
                placeholder="Ex: (12) 99999-0000"
              />
            </InputRoot>
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
              E-mail Oficial da Secretaria
            </label>
            <InputRoot
              error={formik.errors.email}
              touched={formik.touched.email}
            >
              <InputControl
                name="email"
                type="email"
                value={formik.values.email || ''}
                onChange={formik.handleChange}
                placeholder="Ex: secretaria@paroquiasaojosecaragua.com.br"
              />
            </InputRoot>
          </div>
        </div>
      </div>

      {/* 2. Horário de Atendimento da Secretaria */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <Clock className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Horário de Atendimento da Secretaria
            </h2>
            <p className="text-xs text-zinc-500">
              Informe os dias da semana, turnos matutinos e vespertinos (permite múltiplas linhas)
            </p>
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
            Horários de Funcionamento (Multilinha)
          </label>
          <Textarea
            name="officeHours"
            value={formik.values.officeHours || ''}
            onChange={formik.handleChange}
            placeholder="Segunda a Sexta: 08h00 às 12h00 e das 13h30 às 17h30&#10;Sábado: 08h00 às 12h00"
            className="min-h-[140px] leading-relaxed"
          />
          <p className="text-[11px] text-zinc-400 mt-1.5">
            Dica: Pressione Enter para organizar cada dia ou turno em uma linha separada.
          </p>
        </div>
      </div>

      {/* 3. Endereço Físico da Secretaria */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <MapPin className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Endereço da Secretaria Paroquial
            </h2>
            <p className="text-xs text-zinc-500">
              Localização da sede paroquial onde os fiéis são acolhidos presencialmente
            </p>
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
            Endereço Completo
          </label>
          <InputRoot
            error={formik.errors.address}
            touched={formik.touched.address}
          >
            <InputControl
              name="address"
              value={formik.values.address || ''}
              onChange={formik.handleChange}
              placeholder="Ex: Praça Cândido Mota, 35 - Centro, Caraguatatuba - SP"
            />
          </InputRoot>
        </div>
      </div>

      {/* 4. Redes Sociais Oficiais */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
          <Sparkles className="w-5 h-5 text-[#B8872E]" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-base">
              Redes Sociais e Mensageiros
            </h2>
            <p className="text-xs text-zinc-500">
              Links oficiais para o site e rodapé conectarem os fiéis às mídias da paróquia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>Instagram</span>
            </label>
            <InputRoot
              error={formik.errors.instagramUrl}
              touched={formik.touched.instagramUrl}
            >
              <InputControl
                name="instagramUrl"
                value={formik.values.instagramUrl || ''}
                onChange={formik.handleChange}
                placeholder="https://instagram.com/paroquiasaojosecaragua"
              />
            </InputRoot>
          </div>

          <div>
            <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
              <Youtube className="w-3.5 h-3.5 text-red-600" />
              <span>YouTube</span>
            </label>
            <InputRoot
              error={formik.errors.youtubeUrl}
              touched={formik.touched.youtubeUrl}
            >
              <InputControl
                name="youtubeUrl"
                value={formik.values.youtubeUrl || ''}
                onChange={formik.handleChange}
                placeholder="https://youtube.com/@paroquiasaojosecaragua"
              />
            </InputRoot>
          </div>

          <div>
            <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
              <Facebook className="w-3.5 h-3.5 text-blue-600" />
              <span>Facebook</span>
            </label>
            <InputRoot
              error={formik.errors.facebookUrl}
              touched={formik.touched.facebookUrl}
            >
              <InputControl
                name="facebookUrl"
                value={formik.values.facebookUrl || ''}
                onChange={formik.handleChange}
                placeholder="https://facebook.com/paroquiasaojosecaragua"
              />
            </InputRoot>
          </div>

          <div>
            <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Link Direto WhatsApp (wa.me)</span>
            </label>
            <InputRoot
              error={formik.errors.whatsappUrl}
              touched={formik.touched.whatsappUrl}
            >
              <InputControl
                name="whatsappUrl"
                value={formik.values.whatsappUrl || ''}
                onChange={formik.handleChange}
                placeholder="https://wa.me/5512999990000"
              />
            </InputRoot>
          </div>
        </div>
      </div>
    </div>
  );
};
