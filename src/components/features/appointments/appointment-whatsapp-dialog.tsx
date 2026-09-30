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

interface AppointmentWhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
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

export function AppointmentWhatsAppDialog({
  open,
  onOpenChange,
  appointment,
}: AppointmentWhatsAppDialogProps) {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  useEffect(() => {
    if (appointment && open) {
      setMessage(buildWhatsAppConfirmationMessage(appointment, siteBaseUrl));
      setCopied(false);
    }
  }, [appointment, open, siteBaseUrl]);

  if (!appointment) return null;

  const cleanBaseUrl = (siteBaseUrl || '').replace(/\/$/, '');
  const trackingUrl = `${cleanBaseUrl}/agendamentos/acompanhar?token=${appointment.accessToken}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    let cleanPhone = (appointment.requesterPhone || '').replace(/\D/g, '');
    if (cleanPhone.length <= 11) {
      cleanPhone = `55${cleanPhone}`;
    }
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  const [year, month, day] = (appointment.appointmentDate || '').split('-');
  const formattedDate =
    year && month && day ? `${day}/${month}/${year}` : appointment.appointmentDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full p-6">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900">
                Agendamento Aprovado!
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Deseja enviar a mensagem de confirmação para o WhatsApp do fiel?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Fiel / Atendimento summary card */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-zinc-800">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{appointment.requesterName}</span>
            </span>
            <span className="text-zinc-600 font-mono text-[11px]">
              {appointment.requesterPhone}
            </span>
          </div>

          <div className="flex items-center gap-3 text-zinc-600 flex-wrap pt-1 border-t border-zinc-200/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>
                {appointment.startTime} às {appointment.endTime}
              </span>
            </span>
            <span className="font-medium text-brand-700">
              {appointment.service?.title || 'Atendimento'}
            </span>
          </div>
        </div>

        {/* Message editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Mensagem a ser enviada
            </label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
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
            rows={9}
            className="text-xs leading-relaxed font-sans bg-white border-zinc-300 resize-none focus:border-emerald-500 focus:ring-emerald-200"
          />

          <div className="p-2 bg-emerald-50/70 border border-emerald-200/60 rounded-lg flex items-center justify-between text-[11px] text-emerald-900">
            <span className="truncate pr-2">
              <strong>Link incluído:</strong> {trackingUrl}
            </span>
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
            >
              <span>Testar</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar pelo WhatsApp</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
