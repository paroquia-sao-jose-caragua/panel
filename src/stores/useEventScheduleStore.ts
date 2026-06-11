import { create } from 'zustand';
import type { EventSchedule } from '@/entities/EventSchedule';

type State = {
  eventSchedule: EventSchedule | null;
};

type Action = {
  setEventSchedule: (eventSchedule: EventSchedule) => void;
};

const useEventScheduleStore = create<State & Action>()((set) => ({
  eventSchedule: null,
  setEventSchedule: (eventSchedule) => set({ eventSchedule }),
}));

export default useEventScheduleStore;
