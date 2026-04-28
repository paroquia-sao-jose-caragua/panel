import { create } from 'zustand';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type Community = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  type: 'parish_church' | 'chapel';
  address: string;
  coverId: string;
  coverUrl: string;
};

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
