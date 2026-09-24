'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Heart,
  Phone,
  Clock,
  MapPin,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  QrCode,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Pencil,
  Edit,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useParishContact } from '@/api/parish-contact/use-parish-contact';
import { useDonations } from '@/api/donations/use-donations';
import { generatePixPayload } from '@/utils/pix';

export default function SecretariatOverviewPage() {
  const { contact, isPending: isContactPending } = useParishContact();
  const { donations, isPending: isDonationsPending } = useDonations();
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [copiedPixPayload, setCopiedPixPayload] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const isPending = isContactPending || isDonationsPending;

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3001';

  const pixKey = donations?.pixKey || '';
  const pixKeyType = donations?.pixKeyType || 'phone';
  const pixRawKey =
    pixKeyType === 'phone' || pixKeyType === 'cnpj'
      ? pixKey.replace(/\D/g, '')
      : pixKey.trim();
  const pixReceiverName = donations?.pixReceiverName || 'Paróquia São José';
  const pixCity = donations?.pixReceiverCity || 'Caraguatatuba';

  const pixPayload = pixRawKey
    ? generatePixPayload({
        key: pixRawKey,
        name: pixReceiverName,
        city: pixCity,
        txid: '***',
      })
    : '';

  const handleCopyPixKey = () => {
    if (!donations?.pixKey) return;
    navigator.clipboard.writeText(donations.pixKey);
    setCopiedPixKey(true);
    setTimeout(() => setCopiedPixKey(false), 2000);
  };

  const handleCopyPixPayload = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPixPayload(true);
    setTimeout(() => setCopiedPixPayload(false), 2000);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getPixTypeLabel = (type?: string | null) => {
    switch (type) {
      case 'cnpj':
        return 'CNPJ';
      case 'email':
        return 'E-mail';
      case 'random':
        return 'Chave Aleatória (EVP)';
      case 'phone':
      default:
        return 'Telefone / Celular';
    }
  };

  const socialNetworks = [
    {
      id: 'instagram',
      name: 'Instagram',
      url: contact?.instagramUrl,
      icon: Instagram,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: contact?.youtubeUrl,
      icon: Youtube,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: contact?.facebookUrl,
      icon: Facebook,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp (Link Direto)',
      url:
        contact?.whatsappUrl ||
        (contact?.whatsapp
          ? `https://wa.me/55${contact.whatsapp.replace(/\D/g, '')}`
          : null),
      icon: MessageCircle,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  if (isPending) {
    return (
      <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-8">
        <div>
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-325 w-full px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      {/* Top Breadcrumb: Página raiz sem botão voltar e apenas o título do menu */}
      <AppBreadcrumb
        links={[
          {
            key: 'secretariat',
            href: '/secretaria',
            title: 'Secretaria & Contribuição',
            icon: Building2,
          },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <TypographyH1>Secretaria & Contribuição</TypographyH1>

        {/* Public Site Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="outline" size="sm" className="gap-2 text-xs h-9">
            <a
              href={`${siteBaseUrl}/contato-e-secretaria`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Secretaria no site</span>
            </a>
          </Button>

          <Button asChild size="sm" className="gap-2 text-xs h-9">
            <a
              href={`${siteBaseUrl}/quero-contribuir`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Doações no site</span>
            </a>
          </Button>
        </div>
      </div>

      <Describe className="mb-8">
        Painel unificado com todas as informações de atendimento da secretaria paroquial,
        canais de contato, horários de funcionamento, dados bancários de doação e gestão do dízimo.
      </Describe>

      <div className="space-y-12">
        {/* ========================================================= */}
        {/* SEÇÃO 1: ATENDIMENTO & SECRETARIA PAROQUIAL               */}
        {/* ========================================================= */}
        <section>
          {/* Subtítulo de Seção no layout: Ícone alinhado somente ao subtítulo com a mesma cor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-900">
                <Building2 className="w-5 h-5 text-zinc-900 shrink-0" />
                <h2
                  className="text-xl sm:text-2xl font-semibold text-zinc-900"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Atendimento & Secretaria Paroquial
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Canais de atendimento ao público, horários de expediente e redes sociais
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0 self-start sm:self-center">
              <Link href="/secretaria/editar">
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar Atendimento</span>
              </Link>
            </Button>
          </div>

          {/* Cards diretos no layout da página */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Card 1.1: Canais de Contato Direto */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <Phone className="w-4.5 h-4.5 text-[#B8872E]" />
                  <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                    Canais de Contato Direto
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-zinc-500 text-xs block mb-0.5">Telefone Fixo:</span>
                    <span className="font-medium text-zinc-800">
                      {contact?.phone || 'Não informado'}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-xs block mb-0.5">WhatsApp de Atendimento:</span>
                    {contact?.whatsapp ? (
                      <span className="font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                        {contact.whatsapp}
                      </span>
                    ) : (
                      <span className="text-zinc-400">Não informado</span>
                    )}
                  </div>

                  <div>
                    <span className="text-zinc-500 text-xs block mb-0.5">E-mail Oficial:</span>
                    <span className="font-medium text-zinc-800 break-all">
                      {contact?.email || 'Não informado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 1.2: Horários de Atendimento */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <Clock className="w-4.5 h-4.5 text-[#B8872E]" />
                  <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                    Horário de Funcionamento
                  </h3>
                </div>

                {contact?.officeHours ? (
                  <div className="space-y-2 text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                    {contact.officeHours.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Nenhum horário cadastrado. Clique em &quot;Editar Atendimento&quot; para configurar.
                  </p>
                )}
              </div>
            </div>

            {/* Card 1.3: Endereço Físico */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <MapPin className="w-4.5 h-4.5 text-[#B8872E]" />
                  <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                    Endereço da Secretaria
                  </h3>
                </div>

                <div className="bg-zinc-50/70 border border-zinc-200/70 rounded-xl p-4">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1 font-semibold">
                    Local de acolhimento presencial
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                    {contact?.address || 'Endereço ainda não cadastrado.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 1.4: Redes Sociais com links, ícone de acesso e ícone de cópia */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-[#B8872E]" />
                    <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                      Redes Sociais e Mensageiros
                    </h3>
                  </div>

                  <Button asChild variant="outline" size="sm" className="gap-1.5 h-7.5 px-2.5 text-xs">
                    <Link href="/secretaria/editar">
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </Link>
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {socialNetworks.map((net) => (
                    <div
                      key={net.id}
                      className="bg-zinc-50/70 border border-zinc-200/70 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${net.bgColor}`}
                        >
                          <net.icon className={`w-4 h-4 ${net.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-zinc-800 block">
                            {net.name}
                          </span>
                          {net.url ? (
                            <span
                              className="text-[11px] text-zinc-500 font-mono truncate block"
                              title={net.url}
                            >
                              {net.url}
                            </span>
                          ) : (
                            <span className="text-[11px] text-zinc-400 italic block">
                              Não configurado
                            </span>
                          )}
                        </div>
                      </div>

                      {net.url ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 rounded-lg"
                            title={`Acessar ${net.name}`}
                          >
                            <a
                              href={net.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-5 h-5" />
                              <span className="sr-only">Acessar {net.name}</span>
                            </a>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(net.url!, net.id)}
                            className="h-9 w-9 p-0 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 rounded-lg"
                            title="Copiar link"
                          >
                            {copiedLink === net.id ? (
                              <Check className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                            <span className="sr-only">Copiar link</span>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SEÇÃO 2: QUERO CONTRIBUIR & DÍZIMO                        */}
        {/* ========================================================= */}
        <section>
          {/* Subtítulo de Seção no layout: Ícone alinhado somente ao subtítulo com a mesma cor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-900">
                <Heart className="w-5 h-5 text-zinc-900 shrink-0" />
                <h2
                  className="text-xl sm:text-2xl font-semibold text-zinc-900"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Quero Contribuir & Dízimo
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Chave PIX, contas bancárias para transferência, envio de comprovantes e obras
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0 self-start sm:self-center">
              <Link href="/secretaria/doacoes">
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar Doações</span>
              </Link>
            </Button>
          </div>

          {/* Cards diretos no layout da página */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Card 2.1: PIX Oficial & QR Code com Pix Copia e Cola */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4.5 h-4.5 text-[#B8872E]" />
                    <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                      Chave PIX & QR Code
                    </h3>
                  </div>

                  {donations?.pixKeyType && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fef8ed] text-[#B8872E] border border-[#D6A64A]/30">
                      {getPixTypeLabel(donations.pixKeyType)}
                    </span>
                  )}
                </div>

                {donations?.pixKey ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                      {/* Visual QR Code */}
                      <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-white border border-zinc-200/80 rounded-2xl shadow-2xs">
                        <QRCodeSVG
                          value={pixPayload}
                          size={120}
                          level="M"
                          bgColor="#ffffff"
                          fgColor="#18181b"
                          className="w-28 h-28 sm:w-30 sm:h-30"
                        />
                        <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase mt-1.5">
                          QR Code Pix
                        </span>
                      </div>

                      {/* Pix Key and Details */}
                      <div className="flex-1 min-w-0 w-full space-y-3">
                        <div>
                          <span className="text-zinc-500 text-xs block mb-1 font-medium">
                            Chave PIX ({getPixTypeLabel(donations.pixKeyType)}):
                          </span>
                          <div className="flex items-center justify-between gap-2 bg-zinc-50 border border-zinc-200/80 px-3 py-2 rounded-xl">
                            <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-800 break-all">
                              {donations.pixKey}
                            </span>
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              onClick={handleCopyPixKey}
                              className="gap-1.5 shrink-0 h-7.5 px-2.5 text-xs font-medium"
                            >
                              {copiedPixKey ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600 font-medium">Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
                          <div>
                            <span className="text-zinc-400 block text-[11px] mb-0.5">Favorecido:</span>
                            <span className="font-medium text-zinc-800 truncate block">
                              {donations.pixReceiverName || 'Não informado'}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[11px] mb-0.5">Cidade:</span>
                            <span className="font-medium text-zinc-800 truncate block">
                              {donations.pixReceiverCity || 'Caraguatatuba'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pix Copia e Cola Payload Block */}
                    <div className="pt-3 border-t border-zinc-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-xs font-medium">
                          Código Pix Copia e Cola:
                        </span>
                        <span className="text-[10px] text-zinc-400">Padrão EMV Banco Central</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 bg-zinc-50 border border-zinc-200/80 px-3 py-2 rounded-xl">
                        <span
                          className="font-mono text-[11px] text-zinc-600 truncate flex-1 select-all"
                          title={pixPayload}
                        >
                          {pixPayload}
                        </span>
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={handleCopyPixPayload}
                          className="gap-1.5 shrink-0 h-7.5 px-2.5 text-xs text-zinc-700 font-medium hover:text-zinc-900"
                        >
                          {copiedPixPayload ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar Código</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Nenhuma chave PIX cadastrada. Clique em &quot;Editar Doações&quot; para adicionar.
                  </p>
                )}
              </div>
            </div>

            {/* Card 2.2: Dados Bancários */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <Building2 className="w-4.5 h-4.5 text-[#B8872E]" />
                  <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                    Transferência Bancária (TED / DOC)
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <span className="text-zinc-500">Banco:</span>
                    <span className="font-semibold text-zinc-800">{donations?.bankName || 'Não informado'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-zinc-100">
                    <div>
                      <span className="text-zinc-500 block text-xs mb-0.5">Agência:</span>
                      <span className="font-mono font-medium text-zinc-800">{donations?.bankAgency || '—'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs mb-0.5">Conta ({donations?.bankAccountType || 'Corrente'}):</span>
                      <span className="font-mono font-medium text-zinc-800">{donations?.bankAccount || '—'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-xs mb-0.5">Favorecido / CNPJ:</span>
                    <span className="font-medium text-zinc-800 block">{donations?.bankBeneficiary || 'Mitra Diocesana'}</span>
                    <span className="font-mono text-zinc-500 text-xs block">{donations?.bankCnpj || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2.3: Envio de Comprovantes */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <MessageCircle className="w-4.5 h-4.5 text-[#B8872E]" />
                  <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                    Canais para Envio de Comprovante
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-zinc-500 text-xs block mb-0.5">WhatsApp para Comprovantes:</span>
                    {donations?.receiptWhatsapp ? (
                      <span className="font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                        {donations.receiptWhatsapp}
                      </span>
                    ) : (
                      <span className="text-zinc-400">Não informado</span>
                    )}
                  </div>

                  <div>
                    <span className="text-zinc-500 text-xs block mb-0.5">E-mail para Comprovantes:</span>
                    <span className="font-medium text-zinc-800 break-all">
                      {donations?.receiptEmail || 'Não informado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2.4: Textos & Obras Sociais */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-[#B8872E]" />
                    <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">
                      Textos & Centro Pastoral
                    </h3>
                  </div>

                  <Button asChild variant="outline" size="sm" className="gap-1.5 h-7.5 px-2.5 text-xs">
                    <Link href="/secretaria/doacoes">
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar texto</span>
                    </Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                      Título da Página
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800">
                      {donations?.title || 'Quero Contribuir'}
                    </p>
                  </div>

                  {donations?.description && (
                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Mensagem Pastoral
                      </span>
                      <p className="text-xs text-zinc-600 line-clamp-3 font-serif leading-relaxed">
                        {donations.description}
                      </p>
                    </div>
                  )}

                  {donations?.pastoralCenterTitle && (
                    <div className="pt-2 border-t border-zinc-100">
                      <span className="text-[11px] font-bold text-[#B8872E] uppercase tracking-wider block mb-0.5">
                        {donations.pastoralCenterTitle}
                      </span>
                      {donations.pastoralCenterDescription && (
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          {donations.pastoralCenterDescription}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
