import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Community } from '@/entities/Community';
import type { MassSchedule } from '@/entities/MassSchedule';

type State = {
  community: Community | null;
  massSchedules: MassSchedule[];
};

type Action = {
  setCommunity: (community: Community) => void;
  setMassSchedules: (massSchedules: MassSchedule[]) => void;
};

const useCommunityStore = create<State & Action>()(
  persist(
    (set) => ({
      community: null,
      massSchedules: [],
      setCommunity: (community) => set({ community }),
      setMassSchedules: (massSchedules) => set({ massSchedules }),
    }),
    {
      name: 'community-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        community: state.community,
        massSchedules: state.massSchedules,
      }),
    }
  )
);

export default useCommunityStore;
