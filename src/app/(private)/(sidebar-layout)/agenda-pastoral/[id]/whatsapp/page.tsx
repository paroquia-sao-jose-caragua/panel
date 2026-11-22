'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CalendarCheck,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  ExternalLink,
  CheckCircle2,
  XCircle,
  BellRing,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { AppHeader } from '@/components/common/header';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppointment } from '@/api/appointments/use-appointments';
import { useCommunities } from '@/api/communities/use-communities';
import { getAppointmentLocation } from '@/utils/appointment-location';
import {
  buildWhatsAppConfirmationMessage,
  buildWhatsAppCancellationMessage,
  buildWhatsAppReminderMessage,
  type WhatsAppTemplateType,
} from '@/components/features/appointments/appointment-whatsapp-dialog';
import { ROUTES } from '@/constants/routes';

export default function AppointmentWhatsAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template') as WhatsAppTemplateType | null;

  const { appointment, isPending } = useAppointment(id);
  const { communities } = useCommunities();

  const [template, setTemplate] = useState<WhatsAppTemplateType>(
    initialTemplateParam || 'confirmation'
  );
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  useEffect(() => {
    if (!appointment) return;
    if (appointment.status === 'cancelled') {
      setTemplate('cancellation');
    } else if (
      appointment.status === 'completed' &&
      initialTemplateParam === 'cancellation'
    ) {
      setTemplate('confirmation');
    } else if (initialTemplateParam) {
      setTemplate(initialTemplateParam);
    }
  }, [appointment, initialTemplateParam]);

  useEffect(() => {
    if (!appointment) return;
    const locationInfo = getAppointmentLocation(appointment, communities);
    if (template === 'confirmation') {
      setMessage(
        buildWhatsAppConfirmationMessage(
          appointment,
          siteBaseUrl,
          locationInfo.formatted
        )
      );
    } else if (template === 'cancellation') {
      setMessage(buildWhatsAppCancellationMessage(appointment, siteBaseUrl));
    } else {
      setMessage(
        buildWhatsAppReminderMessage(
          appointment,
          siteBaseUrl,
          locationInfo.formatted
        )
      );
    }
    setCopied(false);
  }, [appointment, communities, template, siteBaseUrl]);

  const backHref = ROUTES.APPOINTMENTS.DETAILS(id);

  if (isPending) {
    return (
      <>
        <AppHeader />
        <main className="max-w-220 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </main>
      </>
    );
  }

  if (!appointment) {
    return (
      <>
        <AppHeader />
        <main className="max-w-220 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
          <BackButton href={ROUTES.APPOINTMENTS.HOME} />
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto" />
            <h2 className="text-lg font-bold text-zinc-900">
              Agendamento não encontrado
            </h2>
            <Button asChild variant="outline">
              <Link href={ROUTES.APPOINTMENTS.HOME}>Voltar à Agenda Pastoral</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  let cleanPhone = (appointment.requesterPhone || '').replace(/\D/g, '');
  if (cleanPhone.length <= 11) {
    cleanPhone = `55${cleanPhone}`;
  }
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}`;

  const [year, month, day] = (appointment.appointmentDate || '').split('-');
  const formattedDate =
    year && month && day ? `${day}/${month}/${year}` : appointment.appointmentDate;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full lg:col-start-2">
      <AppHeader
        links={[
          {
            key: 'agenda-pastoral',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agenda Pastoral',
            icon: CalendarCheck,
          },
          {
            key: 'detalhes',
            href: backHref,
            title: 'Detalhes',
          },
          {
            key: 'whatsapp',
            href: ROUTES.APPOINTMENTS.WHATSAPP(id),
            title: 'Notificar via WhatsApp',
          },
        ]}
      />

      <main className="max-w-220 w-full px-4 pt-4 pb-16 lg:px-8 lg:pt-8 mx-auto space-y-6">
        <div className="space-y-2">
          <BackButton href={backHref} />
          <div>
            <TypographyH1 size="form">Notificar Fiel via WhatsApp</TypographyH1>
            <p className="text-sm text-zinc-500">
              Escolha o modelo de mensagem, revise o texto e envie diretamente no WhatsApp de{' '}
              <strong className="text-zinc-800">{appointment.requesterName}</strong>.
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-2xs space-y-2 text-sm">
          <div className="flex items-center justify-between font-semibold text-zinc-800 gap-2">
            <span className="flex items-center gap-1.5 truncate">
              <User className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="truncate">{appointment.requesterName}</span>
            </span>
            <span className="text-zinc-600 font-mono text-xs shrink-0">
              {appointment.requesterPhone}
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600 flex-wrap pt-2 border-t border-zinc-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                {appointment.startTime} às {appointment.endTime}
              </span>
            </span>
            <span className="font-medium text-brand-700">
              {appointment.service?.title || appointment.title || 'Agendamento'}
            </span>
          </div>
        </div>

        {/* Template Selector & Message Editor */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100/90 rounded-full border border-zinc-200 w-full">
              <Button
                type="button"
                size="sm"
                variant={template === 'confirmation' ? 'outline' : 'ghost'}
                onClick={() => setTemplate('confirmation')}
                className={`flex-1 min-w-0 ${
                  template === 'confirmation'
                    ? 'bg-white text-emerald-800 border-emerald-200 hover:bg-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Confirmação</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={template === 'cancellation' ? 'outline' : 'ghost'}
                onClick={() => setTemplate('cancellation')}
                className={`flex-1 min-w-0 ${
                  template === 'cancellation'
                    ? 'bg-white text-rose-800 border-rose-200 hover:bg-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">Cancelamento</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={template === 'reminder' ? 'outline' : 'ghost'}
                onClick={() => setTemplate('reminder')}
                className={`flex-1 min-w-0 ${
                  template === 'reminder'
                    ? 'bg-white text-blue-800 border-blue-200 hover:bg-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <BellRing className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Lembrete</span>
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-600">
                Mensagem Pronta (editável)
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyMessage}
                className="text-zinc-600 hover:text-zinc-900 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar texto</span>
                  </>
                )}
              </Button>
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="text-sm font-sans leading-relaxed text-zinc-800 bg-white border-zinc-300 resize-y"
            />
          </div>

          <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
              className="text-zinc-500 hover:text-zinc-800"
            >
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir chat vazio sem texto</span>
              </a>
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button asChild variant="outline">
                <Link href={backHref}>Voltar</Link>
              </Button>
              <Button
                type="button"
                onClick={handleSendWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar no WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
