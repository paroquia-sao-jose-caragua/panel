'use client';

import useAuthStore from '@/stores/useAuthStore';
import { LogoutButton } from './logout-button';

export function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl bg-brand-800/40 border border-brand-700/30 hover:bg-brand-800/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-brand-100 font-bold text-sm border-brand-300/40 border bg-brand-700/60 shrink-0 shadow-xs">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-brand-100 truncate">
            {user?.name}
          </span>
          <span className="truncate text-xs text-brand-300">{user?.email}</span>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
