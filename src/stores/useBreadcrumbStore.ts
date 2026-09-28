import { create } from 'zustand';
import type { ElementType, ReactNode } from 'react';

export interface BreadcrumbLinkItem {
  key: string;
  icon?: ElementType | string;
  href: string;
  title: ReactNode;
}

interface BreadcrumbState {
  links: BreadcrumbLinkItem[];
  setLinks: (links: BreadcrumbLinkItem[]) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  links: [],
  setLinks: (links) => set({ links }),
}));
