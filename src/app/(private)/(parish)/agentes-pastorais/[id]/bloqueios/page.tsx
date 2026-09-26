'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { CalendarOff, PlusCircle, Trash2, Calendar } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import {
  usePastoralAgents,
  useAgentBlockedDates,
} from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

export default function AgentBlockedDatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { agents } = usePastoralAgents();
  const agent = agents.find((a) => a.id === id);

  const {
    blockedDates,
    isPending,
    addBlockedDate,
    isAddingBlockedDate,
    removeBlockedDate,
    isRemovingBlockedDate,
  } = useAgentBlockedDates(id);

  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    await addBlockedDate({
      blockedDate: date,
      reason: reason.trim() || 'Compromisso pastoral / Imprevisto',
    });
    setDate('');
    setReason('');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white mt-24 md:mt-20.25 lg:mt-0">
        <div className="mx-auto w-full max-w-220 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.PASTORAL_AGENTS.HOME} />

          <div className="flex flex-row items-center gap-4 mt-2">
            <div>
              <TypographyH1>Bloqueio de Datas</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {agent?.name
                  ? `${agent.title ? `${agent.title} ` : ''}${agent.name} — ${agent.actingRole}`
                  : 'Gerenciamento de datas indisponíveis'}
              </span>
            </div>
          </div>
        </div>

        <Separator />
      </header>

      <main className="mx-auto w-full max-w-220 px-4 lg:px-8 py-8 space-y-6">
        {/* Formulário para Novo Bloqueio */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>Bloquear Nova Data</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Impeça que novos agendamentos sejam marcados nesta data (férias, retiros, viagens ou imprevistos).
            </p>
          </div>

          <form onSubmit={handleAdd} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Data a Ser Bloqueada *
                </label>
                <Input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Motivo / Observação (opcional)
                </label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Retiro espiritual do clero, Férias"
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" isLoading={isAddingBlockedDate}>
                <CalendarOff className="w-4 h-4 mr-2" />
                Bloquear Data
              </Button>
            </div>
          </form>
        </div>

        {/* Lista de Datas Bloqueadas */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-700" />
              <span>Datas Atualmente Bloqueadas ({blockedDates.length})</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Dias em que o sistema bloqueia automaticamente qualquer solicitação de agendamento para este agente.
            </p>
          </div>

          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : blockedDates.length === 0 ? (
            <div className="text-xs text-zinc-500 italic p-6 text-center border border-dashed border-zinc-200 rounded-xl">
              Nenhuma data bloqueada para este agente. O atendimento segue a grade semanal regular.
            </div>
          ) : (
            <div className="space-y-2">
              {blockedDates.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                      <CalendarOff className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-zinc-900 block">
                        {formatDate(block.blockedDate)}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {block.reason || 'Sem motivo especificado'}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-zinc-400 hover:text-rose-600 hover:bg-rose-50 gap-1"
                    onClick={() => setDeletingBlockId(block.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-zinc-100 flex justify-start">
            <Link href={ROUTES.PASTORAL_AGENTS.HOME}>
              <Button variant="outline">Voltar para Agentes</Button>
            </Link>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={!!deletingBlockId}
          onOpenChange={(open) => !open && setDeletingBlockId(null)}
          title="Desbloquear Data"
          itemName="este bloqueio"
          description="Tem certeza que deseja desbloquear esta data? O agente voltará a ficar disponível para atendimentos conforme sua grade regular."
          isPending={isRemovingBlockedDate}
          onConfirm={async () => {
            if (deletingBlockId) {
              await removeBlockedDate(deletingBlockId);
              setDeletingBlockId(null);
            }
          }}
        />
      </main>
    </div>
  );
}
