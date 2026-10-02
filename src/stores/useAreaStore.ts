import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PanelArea = 'agenda' | 'events' | 'parish';

interface AreaState {
  currentArea: PanelArea;
  setArea: (area: PanelArea) => void;
}

export const useAreaStore = create<AreaState>()(
  persist(
    (set) => ({
      currentArea: 'parish',
      setArea: (currentArea) => set({ currentArea }),
    }),
    {
      name: 'paroquia-panel-area',
    }
  )
);
