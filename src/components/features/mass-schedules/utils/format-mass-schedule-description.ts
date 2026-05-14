import type { MassSchedule } from '@/entities/MassSchedule';
import type useTranslator from '@/hooks/use-translator';

export type MassScheduleType = 'ordinary' | 'devotional' | 'annual';

interface FormatDescriptionParams {
  massSchedule: MassSchedule;
  type: MassScheduleType;
  t: ReturnType<typeof useTranslator>['t'];
}

export function formatMassScheduleDescription({
  massSchedule,
  type,
  t,
}: FormatDescriptionParams): string {
  switch (type) {
    case 'annual':
      return `Dia ${massSchedule.dayOfMonth} de ${massSchedule.monthOfYear ? t(`month-${massSchedule.monthOfYear}`).toLowerCase() : ''}`;

    case 'devotional':
      if (massSchedule.dayOfMonth) {
        return `Dia ${massSchedule.dayOfMonth} de cada mês`;
      }
      if (massSchedule.weekOfMonth) {
        return `${massSchedule?.dayOfWeek ? t(`week-day-${massSchedule.dayOfWeek}`) : ''} na ${massSchedule.weekOfMonth === 5 ? 'última' : `${massSchedule.weekOfMonth}ª`} semana do mês`;
      }
      if (
        typeof massSchedule.weekOfMonth !== 'number' &&
        typeof massSchedule.dayOfWeek === 'number'
      ) {
        return `${[0, 6].includes(massSchedule.dayOfWeek) ? 'Todos os ' : 'Todas as'} ${t(`week-day-${massSchedule.dayOfWeek}`).toLowerCase()}s do mês`;
      }
      return '';

    case 'ordinary':
      if (
        massSchedule.recurrenceType === 'weekly' &&
        massSchedule.dayOfWeek !== undefined
      ) {
        return t(`week-day-${massSchedule.dayOfWeek}`);
      }
      return '';

    default:
      return '';
  }
}
