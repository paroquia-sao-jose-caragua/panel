import React from 'react';
import type { Metadata } from 'next';
import { MinhaAgendaBottomNav } from '@/components/features/minha-agenda/bottom-nav';

export const metadata: Metadata = {
  title: 'Minha Agenda - Pastoral São José',
  description: 'Agenda pessoal e atendimentos pastorais do agente.',
};

export default function MinhaAgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center selection:bg-brand-500 selection:text-brand-900">
      <div className="w-full max-w-lg min-h-screen bg-zinc-50 flex flex-col relative pb-20 shadow-xs border-x border-zinc-200/60">
        <main className="flex-1 flex flex-col">{children}</main>
        <MinhaAgendaBottomNav />
      </div>
    </div>
  );
}
