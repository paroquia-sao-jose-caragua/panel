'use client';

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  Sparkles,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { useParishContact } from '@/api/parish-contact/use-parish-contact';

const validationSchema = Yup.object().shape({
  phone: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  whatsapp: Yup.string().max(50, 'Máximo de 50 caracteres').nullable(),
  email: Yup.string().email('E-mail inválido').nullable(),
  address: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  officeHours: Yup.string().nullable(),
  instagramUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  youtubeUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  facebookUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  whatsappUrl: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
});

export default function SecretariatPage() {
  const { contact, isPending, isUpdating, updateContact } = useParishContact();

  const formik = useFormik({
    initialValues: {
      phone: contact?.phone || '',
      whatsapp: contact?.whatsapp || '',
      email: contact?.email || '',
      address: contact?.address || '',
      officeHours: contact?.officeHours || '',
      instagramUrl: contact?.instagramUrl || '',
      youtubeUrl: contact?.youtubeUrl || '',
      facebookUrl: contact?.facebookUrl || '',
      whatsappUrl: contact?.whatsappUrl || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateContact({
        phone: values.phone || null,
        whatsapp: values.whatsapp || null,
        email: values.email || null,
        address: values.address || null,
        officeHours: values.officeHours || null,
        instagramUrl: values.instagramUrl || null,
        youtubeUrl: values.youtubeUrl || null,
        facebookUrl: values.facebookUrl || null,
        whatsappUrl: values.whatsappUrl || null,
      });
    },
  });

  return (
    <div className="w-full lg:col-start-2 min-h-screen flex flex-col bg-zinc-50/40">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="mx-auto w-full max-w-4xl px-4 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-[#fef8ed] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <TypographyH1>Contato e Secretaria</TypographyH1>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                Gerencie os canais de atendimento, horários e redes sociais da paróquia
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={isUpdating || isPending}
            className="bg-[#18351E] hover:bg-[#23472b] text-white gap-2 shrink-0 min-w-36 h-10 shadow-xs cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Spinner className="w-4 h-4" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl px-4 py-8 mx-auto lg:px-8 flex-1">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner className="w-8 h-8 text-[#B8872E]" />
            <span className="text-sm text-zinc-500 font-medium">Carregando informações da secretaria...</span>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
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
                  <InputRoot error={formik.errors.phone} touched={formik.touched.phone}>
                    <InputControl
                      name="phone"
                      value={formik.values.phone || ''}
                      onChange={formik.handleChange}
                    />
                  </InputRoot>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
                    WhatsApp de Atendimento
                  </label>
                  <InputRoot error={formik.errors.whatsapp} touched={formik.touched.whatsapp}>
                    <InputControl
                      name="whatsapp"
                      value={formik.values.whatsapp || ''}
                      onChange={formik.handleChange}
                    />
                  </InputRoot>
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1.5 text-xs font-semibold text-zinc-700">
                    E-mail Oficial da Secretaria
                  </label>
                  <InputRoot error={formik.errors.email} touched={formik.touched.email}>
                    <InputControl
                      name="email"
                      type="email"
                      value={formik.values.email || ''}
                      onChange={formik.handleChange}
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
                  className="min-h-[140px] text-sm leading-relaxed"
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
                <InputRoot error={formik.errors.address} touched={formik.touched.address}>
                  <InputControl
                    name="address"
                    value={formik.values.address || ''}
                    onChange={formik.handleChange}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram</span>
                  </label>
                  <InputRoot error={formik.errors.instagramUrl} touched={formik.touched.instagramUrl}>
                    <InputControl
                      name="instagramUrl"
                      value={formik.values.instagramUrl || ''}
                      onChange={formik.handleChange}
                    />
                  </InputRoot>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
                    <Youtube className="w-3.5 h-3.5 text-red-600" />
                    <span>YouTube</span>
                  </label>
                  <InputRoot error={formik.errors.youtubeUrl} touched={formik.touched.youtubeUrl}>
                    <InputControl
                      name="youtubeUrl"
                      value={formik.values.youtubeUrl || ''}
                      onChange={formik.handleChange}
                    />
                  </InputRoot>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook</span>
                  </label>
                  <InputRoot error={formik.errors.facebookUrl} touched={formik.touched.facebookUrl}>
                    <InputControl
                      name="facebookUrl"
                      value={formik.values.facebookUrl || ''}
                      onChange={formik.handleChange}
                    />
                  </InputRoot>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-700">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Direto WhatsApp</span>
                  </label>
                  <InputRoot error={formik.errors.whatsappUrl} touched={formik.touched.whatsappUrl}>
                    <InputControl
                      name="whatsappUrl"
                      value={formik.values.whatsappUrl || ''}
                      onChange={formik.handleChange}
                    />
                  </InputRoot>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end pt-4 pb-12 border-t border-zinc-200">
              <Button
                type="submit"
                size="lg"
                disabled={isUpdating || isPending}
                className="bg-[#18351E] hover:bg-[#23472b] text-white min-w-44 h-11 text-sm shadow-md cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
