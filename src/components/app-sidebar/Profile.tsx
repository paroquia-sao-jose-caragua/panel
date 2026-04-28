"use client";

import useAuthStore from "@/stores/useAuthStore";
import { LogoutButton } from "../LogoutButton";

export function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="grid-cols-profile grid items-center gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-brand-100 font-bold text-xl border-brand-300 border-2">
        {user.name[0]}
      </div>

      <div className="flex flex-col truncate">
        <span className="text-sm font-semibold text-brand-100">
          {user.name}
        </span>
        <span className="truncate text-sm text-brand-300">{user.email}</span>
      </div>
      <LogoutButton />
    </div>
  );
}
