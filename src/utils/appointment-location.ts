import type { Appointment } from '@/entities/appointment';
import type { Community } from '@/entities/Community';

export interface AppointmentLocationInfo {
  label: string;
  address: string | null;
  isHomeVisit: boolean;
  formatted: string;
}

export function getAppointmentLocation(
  appointment: Appointment,
  communities: Community[] = []
): AppointmentLocationInfo {
  const isHomeVisit = Boolean(
    appointment.service?.requiresAddress || appointment.patientAddress
  );

  if (isHomeVisit) {
    const address = appointment.patientAddress?.trim() || null;
    const label = 'Visita Domiciliar';
    return {
      label,
      address,
      isHomeVisit: true,
      formatted: address ? `${label} — ${address}` : label,
    };
  }

  const matriz = communities.find((c) => c.type === 'parish_church');
  const matchedCommunity = appointment.community?.id
    ? communities.find((c) => c.id === appointment.community?.id)
    : undefined;

  const label =
    appointment.community?.name ||
    matriz?.name ||
    'Igreja Matriz São José';

  const address =
    appointment.community?.address?.trim() ||
    matchedCommunity?.address?.trim() ||
    matriz?.address?.trim() ||
    null;

  return {
    label,
    address,
    isHomeVisit: false,
    formatted: address ? `${label} — ${address}` : label,
  };
}
