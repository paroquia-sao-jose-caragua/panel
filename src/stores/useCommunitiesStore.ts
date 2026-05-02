import { create } from 'zustand';
import type { Community } from '@/entities/Community';

type State = {
  communities: Community[];
};

type Action = {
  setCommunities: (communities: Community[]) => void;
};

const useCommunitiesStore = create<State & Action>()((set) => ({
  communities: [],
  setCommunities: (communities) => set({ communities }),
}));

export default useCommunitiesStore;
