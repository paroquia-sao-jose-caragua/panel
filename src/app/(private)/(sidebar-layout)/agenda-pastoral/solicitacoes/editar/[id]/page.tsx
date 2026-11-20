'use client';

import { use } from 'react';
import { AppointmentEditView } from '@/components/features/appointments/appointment-edit-view';
import { ROUTES } from '@/constants/routes';
import { FileText } from 'lucide-react';

export default function SolicitacoesEditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AppointmentEditView
      appointmentId={id}
      backHref={ROUTES.APPOINTMENTS.LIST}
      breadcrumbSection={{
        key: 'solicitacoes',
        title: 'Solicitações',
        href: ROUTES.APPOINTMENTS.LIST,
        icon: FileText,
      }}
    />
  );
}
