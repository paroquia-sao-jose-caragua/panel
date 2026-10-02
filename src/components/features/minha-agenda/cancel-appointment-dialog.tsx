'use client';

import React, { useState } from 'react';
import { CalendarX, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => Promise<void>;
  isLoading?: boolean;
}

export function CancelAppointmentDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState('');

  const handleCancel = async () => {
    await onConfirm(reason.trim() || undefined);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] sm:max-w-md rounded-3xl p-6 bg-white border border-zinc-200 shadow-2xl">
        <div className="flex flex-col items-center text-center pt-2">
          {/* Circular Icon Container */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 mb-4 shadow-2xs">
            <CalendarX className="w-7 h-7" />
          </div>

          <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight mb-2">
            Cancelar atendimento
          </DialogTitle>

          <DialogDescription className="text-sm text-zinc-600 leading-relaxed px-2">
            Tem certeza de que deseja cancelar este atendimento? Esta ação não
            pode ser desfeita.
          </DialogDescription>

          {/* Optional reason */}
          <div className="w-full mt-4 text-left">
            <label
              htmlFor="cancel-reason"
              className="text-xs font-semibold text-zinc-700 block mb-1"
            >
              Motivo do cancelamento (opcional)
            </label>
            <Textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Imprevisto paroquial, viagem ou motivo de saúde..."
              rows={2}
              className="text-sm rounded-xl resize-none"
            />
          </div>

          {/* Warning / Informative notice */}
          <div className="w-full mt-4 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3 text-left">
            <Info className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-700 leading-relaxed">
              O cancelamento será registrado no sistema e o horário ficará liberado
              para novos agendamentos na sua disponibilidade regular.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5 mt-6">
            <Button
              type="button"
              onClick={handleCancel}
              isLoading={isLoading}
              className="w-full h-12 text-sm font-semibold rounded-xl bg-brand-900 text-white hover:bg-brand-800 active:scale-[0.99]"
            >
              Sim, cancelar
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="w-full h-11 text-sm font-medium rounded-xl border-zinc-300 text-zinc-700 hover:bg-zinc-50 active:scale-[0.99]"
            >
              Voltar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
