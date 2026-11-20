import React from 'react';
import type { Metadata } from 'next';
import { MinhaAgendaLayoutWrapper } from '@/components/features/minha-agenda/layout-wrapper';

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
      <MinhaAgendaLayoutWrapper>{children}</MinhaAgendaLayoutWrapper>
    </div>
  );
}
