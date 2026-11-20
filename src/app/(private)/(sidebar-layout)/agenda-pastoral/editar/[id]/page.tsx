'use client';

import { use } from 'react';
import { AppointmentEditView } from '@/components/features/appointments/appointment-edit-view';
import { ROUTES } from '@/constants/routes';

export default function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AppointmentEditView
      appointmentId={id}
      backHref={ROUTES.APPOINTMENTS.HOME}
    />
  );
}
