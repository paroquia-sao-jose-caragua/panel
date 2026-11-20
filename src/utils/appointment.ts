import dayjs from 'dayjs';
import type { Appointment } from '@/entities/appointment';

/**
 * Checks whether an appointment/request is expired (its scheduled date/time has already passed).
 * An appointment is considered expired if:
 * 1. The appointment date is before today.
 * 2. The appointment date is today, but its end time (or start time if no end time) has already passed.
 */
export const isAppointmentExpired = (
  appointment: Pick<Appointment, 'appointmentDate'> &
    Partial<Pick<Appointment, 'startTime' | 'endTime'>>
): boolean => {
  if (!appointment?.appointmentDate) return false;

  const todayStr = dayjs().format('YYYY-MM-DD');

  // If the appointment date is strictly in the past (before today)
  if (appointment.appointmentDate < todayStr) {
    return true;
  }

  // If the appointment date is in the future (after today)
  if (appointment.appointmentDate > todayStr) {
    return false;
  }

  // If it's today, check the time
  const time = appointment.endTime || appointment.startTime;
  if (!time) {
    return false;
  }

  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const appointmentDateTime = dayjs(`${appointment.appointmentDate}T${normalizedTime}`);

  if (!appointmentDateTime.isValid()) {
    return false;
  }

  return appointmentDateTime.isBefore(dayjs());
};

/**
 * Checks whether an appointment/request is scheduled for the future.
 */
export const isFutureAppointment = (
  appointment: Pick<Appointment, 'appointmentDate'> &
    Partial<Pick<Appointment, 'startTime' | 'endTime'>>
): boolean => {
  return !isAppointmentExpired(appointment);
};
