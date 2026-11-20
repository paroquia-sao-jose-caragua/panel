'use client';

import { use } from 'react';
import { AppointmentEditView } from '@/components/features/appointments/appointment-edit-view';
import { ROUTES } from '@/constants/routes';
import { Calendar } from 'lucide-react';

export default function AgendaEditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AppointmentEditView
      appointmentId={id}
      backHref={ROUTES.APPOINTMENTS.AGENDA}
      breadcrumbSection={{
        key: 'agenda',
        title: 'Agenda',
        href: ROUTES.APPOINTMENTS.AGENDA,
        icon: Calendar,
      }}
    />
  );
}
