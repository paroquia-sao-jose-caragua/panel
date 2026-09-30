'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  ExternalLink,
  CheckCircle2,
  XCircle,
  BellRing,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Appointment } from '@/entities/appointment';

export type WhatsAppTemplateType = 'confirmation' | 'cancellation' | 'reminder';

interface AppointmentWhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  initialTemplate?: WhatsAppTemplateType;
  cancellationReason?: string;
}

export function buildWhatsAppConfirmationMessage(
  appointment: Appointment,
  siteBaseUrl: string
): string {
  const cleanBaseUrl = (siteBaseUrl || '').replace(/\/$/, '');
  const trackingUrl = `${cleanBaseUrl}/agendamentos/acompanhar?token=${appointment.accessToken}`;

  const [year, month, day] = (appointment.appointmentDate || '').split('-');
  const formattedDate =
    year && month && day ? `${day}/${month}/${year}` : appointment.appointmentDate;

  const agentTitle = appointment.agent?.title ? `${appointment.agent.title} ` : '';
  const agentName = appointment.agent?.name || 'Agente Pastoral';
  const serviceTitle = appointment.service?.title || 'Atendimento Pastoral';

  return `Olá, ${appointment.requesterName}! Graça e paz.

Confirmamos que a sua solicitação de agendamento na Paróquia São José foi *APROVADA* com sucesso!

*Detalhes do Atendimento:*
🙏 *Atendimento:* ${serviceTitle}
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${appointment.startTime} às ${appointment.endTime}
👤 *Responsável:* ${agentTitle}${agentName}

Você pode acompanhar todos os detalhes da sua solicitação acessando o link abaixo:
🔗 ${trackingUrl}

*Aviso importante:* Caso você não possa comparecer e precise cancelar ou remarcar o atendimento, pedimos a gentileza de realizar o cancelamento com a máxima antecedência possível pelo próprio link acima ou comunicando a secretaria paroquial. Assim, poderemos disponibilizar o horário para atender outro irmão da comunidade.

Deus abençoe!
_Paróquia São José de Caraguatatuba_`;
}

export function buildWhatsAppCancellationMessage(
  appointment: Appointment,
  siteBaseUrl: string,
  cancellationReason?: string
): string {
  const cleanBaseUrl = (siteBaseUrl || '').replace(/\/$/, '');
  const trackingUrl = `${cleanBaseUrl}/agendamentos/acompanhar?token=${appointment.accessToken}`;
  const newBookingUrl = `${cleanBaseUrl}/agendamentos`;

  const [year, month, day] = (appointment.appointmentDate || '').split('-');
  const formattedDate =
    year && month && day ? `${day}/${month}/${year}` : appointment.appointmentDate;

  const agentTitle = appointment.agent?.title ? `${appointment.agent.title} ` : '';
  const agentName = appointment.agent?.name || 'Agente Pastoral';
  const serviceTitle = appointment.service?.title || 'Atendimento Pastoral';

  const reasonText =
    cancellationReason?.trim() ||
    appointment.cancellationReason?.trim() ||
    'Houve um imprevisto na agenda pastoral';

  return `Olá, ${appointment.requesterName}! Graça e paz.

Entramos em contato da secretaria da Paróquia São José para comunicar que o seu atendimento agendado precisou ser *CANCELADO*.

*Motivo:* ${reasonText}

*Detalhes do Atendimento:*
🙏 *Atendimento:* ${serviceTitle}
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${appointment.startTime} às ${appointment.endTime}
👤 *Responsável:* ${agentTitle}${agentName}

Pedimos sinceras desculpas pelo transtorno e contamos com sua compreensão.

Caso deseje agendar uma nova data e horário, você pode fazer uma nova solicitação diretamente pelo nosso site:
🔗 ${newBookingUrl}

Você também pode consultar a situação da sua solicitação através do link:
🔗 ${trackingUrl}

Se preferir, pode responder diretamente a esta mensagem para que nossa secretaria ajude a encontrar um novo horário conveniente.

Que Deus te abençoe!
_Paróquia São José de Caraguatatuba_`;
}

export function buildWhatsAppReminderMessage(
  appointment: Appointment,
  siteBaseUrl: string
): string {
  const cleanBaseUrl = (siteBaseUrl || '').replace(/\/$/, '');
  const trackingUrl = `${cleanBaseUrl}/agendamentos/acompanhar?token=${appointment.accessToken}`;

  const [year, month, day] = (appointment.appointmentDate || '').split('-');
  const formattedDate =
    year && month && day ? `${day}/${month}/${year}` : appointment.appointmentDate;

  const agentTitle = appointment.agent?.title ? `${appointment.agent.title} ` : '';
  const agentName = appointment.agent?.name || 'Agente Pastoral';
  const serviceTitle = appointment.service?.title || 'Atendimento Pastoral';

  return `Olá, ${appointment.requesterName}! Graça e paz.

Lembramos que você tem um atendimento agendado na Paróquia São José:

*Detalhes do Atendimento:*
🙏 *Atendimento:* ${serviceTitle}
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${appointment.startTime} às ${appointment.endTime}
👤 *Responsável:* ${agentTitle}${agentName}

Você pode acompanhar todos os detalhes do seu agendamento no link:
🔗 ${trackingUrl}

*Aviso:* Caso tenha algum imprevisto e não possa comparecer, por favor, realize o cancelamento com antecedência pelo link acima para que possamos liberar o horário para outro fiel.

Esperamos por você! Deus te abençoe.
_Paróquia São José de Caraguatatuba_`;
}

export function AppointmentWhatsAppDialog({
  open,
  onOpenChange,
  appointment,
  initialTemplate = 'confirmation',
  cancellationReason,
}: AppointmentWhatsAppDialogProps) {
  const [template, setTemplate] = useState<WhatsAppTemplateType>(initialTemplate);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  // Synchronize initialTemplate when dialog opens
  useEffect(() => {
    if (open) {
      setTemplate(initialTemplate);
    }
  }, [open, initialTemplate]);

  // Generate message based on selected template
  useEffect(() => {
    if (appointment && open) {
      if (template === 'confirmation') {
        setMessage(buildWhatsAppConfirmationMessage(appointment, siteBaseUrl));
      } else if (template === 'cancellation') {
        setMessage(
          buildWhatsAppCancellationMessage(appointment, siteBaseUrl, cancellationReason)
        );
      } else if (template === 'reminder') {
        setMessage(buildWhatsAppReminderMessage(appointment, siteBaseUrl));
      }
      setCopied(false);
    }
  }, [appointment, open, template, siteBaseUrl, cancellationReason]);

  if (!appointment) return null;

  const cleanBaseUrl = (siteBaseUrl || '').replace(/\/$/, '');
  const trackingUrl = `${cleanBaseUrl}/agendamentos/acompanhar?token=${appointment.accessToken}`;

  let cleanPhone = (appointment.requesterPhone || '').replace(/\D/g, '');
  if (cleanPhone.length <= 11) {
    cleanPhone = `55${cleanPhone}`;
  }
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  const [year, month, day] = (appointment.appointmentDate || '').split('-');
  const formattedDate =
    year && month && day ? `${day}/${month}/${year}` : appointment.appointmentDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="p-0 space-y-2 text-left w-full min-w-0">
          <div className="flex items-center gap-3 w-full min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                template === 'cancellation'
                  ? 'bg-rose-100 text-rose-700'
                  : template === 'reminder'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-bold text-zinc-900 truncate">
                {template === 'cancellation'
                  ? 'Avisar Cancelamento ao Fiel'
                  : template === 'reminder'
                  ? 'Enviar Lembrete de Atendimento'
                  : 'Agendamento Aprovado! Notificar Fiel'}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 line-clamp-2">
                {template === 'cancellation'
                  ? 'Deseja avisar o fiel sobre o cancelamento pelo WhatsApp com motivo e opções de reagendamento?'
                  : template === 'reminder'
                  ? 'Envie um lembrete do horário e local para que o fiel se programe com antecedência.'
                  : 'Deseja enviar a confirmação oficial com o link de acompanhamento e cancelamento para o fiel?'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Template Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100/90 rounded-xl border border-zinc-200 w-full min-w-0">
          <button
            type="button"
            onClick={() => setTemplate('confirmation')}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              template === 'confirmation'
                ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Confirmação</span>
          </button>

          <button
            type="button"
            onClick={() => setTemplate('cancellation')}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              template === 'cancellation'
                ? 'bg-white text-rose-800 shadow-2xs border border-rose-200'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate">Cancelamento</span>
          </button>

          <button
            type="button"
            onClick={() => setTemplate('reminder')}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              template === 'reminder'
                ? 'bg-white text-blue-800 shadow-2xs border border-blue-200'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Lembrete</span>
          </button>
        </div>

        {/* Fiel / Atendimento summary card */}
        <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-1.5 text-xs w-full min-w-0">
          <div className="flex items-center justify-between font-semibold text-zinc-800 gap-2 min-w-0">
            <span className="flex items-center gap-1.5 truncate min-w-0">
              <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{appointment.requesterName}</span>
            </span>
            <span className="text-zinc-600 font-mono text-[11px] shrink-0">
              {appointment.requesterPhone}
            </span>
          </div>

          <div className="flex items-center gap-3 text-zinc-600 flex-wrap pt-1 border-t border-zinc-200/60 min-w-0">
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>
                {appointment.startTime} às {appointment.endTime}
              </span>
            </span>
            <span className="font-medium text-brand-700 truncate min-w-0">
              {appointment.service?.title || 'Atendimento'}
            </span>
          </div>
        </div>

        {/* Message editor */}
        <div className="space-y-1.5 w-full min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 truncate min-w-0">
              Mensagem Pronta (editável)
            </label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer shrink-0"
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
            </button>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            className="text-xs leading-relaxed font-sans bg-white border-zinc-300 resize-none focus:border-brand-500 w-full min-w-0"
          />

          <div className="p-2 bg-zinc-100/70 border border-zinc-200 rounded-lg flex items-center justify-between text-[11px] text-zinc-700 w-full min-w-0 gap-2">
            <span className="truncate min-w-0 flex-1">
              <strong>Link incluído:</strong> {trackingUrl}
            </span>
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-brand-700 font-semibold hover:underline"
            >
              <span>Testar link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <DialogFooter className="p-0 border-t-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 w-full min-w-0">
          {/* Direct WhatsApp link shortcut */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-emerald-700 hover:underline truncate min-w-0"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">Abrir WhatsApp Direto (sem mensagem pronta)</span>
          </a>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Agora Não
            </Button>
            <Button
              type="button"
              onClick={handleSendWhatsApp}
              className={`font-semibold cursor-pointer shadow-xs gap-1.5 text-white ${
                template === 'cancellation'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Enviar pelo WhatsApp</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
