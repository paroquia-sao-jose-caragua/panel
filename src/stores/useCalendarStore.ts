import { create } from 'zustand';
import type {
  CalendarSchedule,
  ExceptionSchedule,
} from '@/entities/CalendarSchedule';
import type { MassScheduleException } from '@/entities/MassScheduleException';

type State = {
  calendar: CalendarSchedule[];
};

type Action = {
  setCalendar: (calendar: CalendarSchedule[]) => void;
  moveScheduleToException: (exception: MassScheduleException) => void;
  moveExceptionToSchedule: (exception: MassScheduleException) => void;
  clearCalendar: () => void;
};

const useCalendarStore = create<State & Action>()((set) => ({
  calendar: [],

  setCalendar: (calendar) => set({ calendar }),

  moveScheduleToException: (exception) => {
    set((state) => ({
      calendar: state.calendar.map((day) => {
        if (day.date !== exception.exceptionDate) {
          return day;
        }

        const scheduleIndex = day.schedules.active.findIndex(
          (schedule) =>
            schedule.type === 'mass' &&
            schedule.massScheduleId === exception.scheduleId
        );

        if (scheduleIndex === -1) {
          return day;
        }

        const schedule = day.schedules.active[scheduleIndex];
        const updatedActive = day.schedules.active.filter(
          (_, idx) => idx !== scheduleIndex
        );
        const updatedExceptions = [
          ...day.schedules.exceptions,
          {
            ...schedule,
            exception,
          } as ExceptionSchedule,
        ].sort((a, b) => a.startTime.localeCompare(b.startTime));

        return {
          ...day,
          schedules: {
            active: updatedActive,
            exceptions: updatedExceptions,
          },
        };
      }),
    }));
  },

  moveExceptionToSchedule: (exception) => {
    set((state) => ({
      calendar: state.calendar.map((day) => {
        if (day.date !== exception.exceptionDate) {
          return day;
        }

        const exceptionIndex = day.schedules.exceptions.findIndex(
          (ex) =>
            ex.startTime === exception.startTime &&
            'exception' in ex &&
            ex.exception.id === exception.id
        );

        if (exceptionIndex === -1) {
          return day;
        }

        const exceptionSchedule = day.schedules.exceptions[exceptionIndex];
        const updatedExceptions = day.schedules.exceptions.filter(
          (_, idx) => idx !== exceptionIndex
        );

        const newActiveSchedule = (
          exceptionSchedule.type === 'mass'
            ? {
                massScheduleId: exceptionSchedule.massScheduleId,
                type: 'mass' as const,
                title: exceptionSchedule.title,
                massType: exceptionSchedule.massType,
                orientations: exceptionSchedule.orientations,
                isPrecept: exceptionSchedule.isPrecept,
                startTime: exceptionSchedule.startTime,
                endTime: exceptionSchedule.endTime,
                cancellationReason: exceptionSchedule.cancellationReason,
                community: exceptionSchedule.community,
              }
            : {
                type: 'event' as const,
                title: exceptionSchedule.title,
                eventType: exceptionSchedule.eventType,
                customLocation: exceptionSchedule.customLocation,
                orientations: exceptionSchedule.orientations,
                startTime: exceptionSchedule.startTime,
                endTime: exceptionSchedule.endTime,
                cancellationReason: exceptionSchedule.cancellationReason,
                community: exceptionSchedule.community,
              }
        ) as typeof exceptionSchedule;

        const updatedActive: CalendarSchedule['schedules']['active'] = [
          ...day.schedules.active,
          newActiveSchedule,
        ].sort((a, b) => a.startTime.localeCompare(b.startTime));

        return {
          ...day,
          schedules: {
            active: updatedActive,
            exceptions: updatedExceptions,
          },
        };
      }),
    }));
  },

  clearCalendar: () => set({ calendar: [] }),
}));

export default useCalendarStore;
