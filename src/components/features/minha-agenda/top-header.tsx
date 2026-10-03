'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import { ROUTES } from '@/constants/routes';

interface MinhaAgendaHeaderProps {
  isHome?: boolean;
  title?: string;
  backHref?: string;
  hideBackButton?: boolean;
  rightAction?: React.ReactNode;
}

export function MinhaAgendaHeader({
  isHome = false,
  title,
  backHref,
  hideBackButton = false,
  rightAction,
}: MinhaAgendaHeaderProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const userInitials = React.useMemo(() => {
    if (!user?.name) return 'AP';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user?.name]);

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.MY_AGENDA.HOME);
    }
  };

  if (isHome) {
    return (
      <header className="sticky top-0 z-30 bg-brand-900 text-white shadow-sm border-b border-brand-800">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3.5">
          {/* Logo Brand */}
          <img
            src="/logo-mark-dark.png"
            alt="Paróquia São José"
            className="transition-all duration-200 object-contain h-10 sm:h-12"
          />

          {/* User Profile Avatar / Link */}
          <Link
            href={ROUTES.MY_AGENDA.PROFILE}
            aria-label="Meu Perfil"
            className="w-9 h-9 rounded-full bg-brand-800 border border-brand-500/50 flex items-center justify-center text-xs font-bold text-brand-200 hover:border-brand-300 transition-colors shadow-xs active:scale-95"
          >
            {userInitials}
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-brand-900 text-white shadow-sm border-b border-brand-800">
      <div className="max-w-lg mx-auto flex items-center justify-between px-3 py-3 min-h-14">
        {!hideBackButton ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar"
            className="p-1.5 -ml-1 text-white hover:text-brand-300 rounded-full hover:bg-brand-800 transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-8" />
        )}

        <h1 className="text-base font-semibold text-white truncate max-w-[70%] text-center">
          {title}
        </h1>

        <div className="flex items-center justify-end min-w-8">
          {rightAction || <div className="w-8" />}
        </div>
      </div>
    </header>
  );
}

