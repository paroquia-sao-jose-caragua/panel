'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  CalendarRange,
  Church,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useNavigate } from '@/hooks/use-navigate';
import useAuthStore from '@/stores/useAuthStore';
import { useAreaStore, type PanelArea } from '@/stores/useAreaStore';
import { ROUTES } from '@/constants/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function AreaSelector() {
  const pathname = usePathname();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentArea, setArea } = useAreaStore();

  const isPastoralAgent = user?.role === 'pastoral_agent';

  // Derive current effective area from pathname
  const effectiveArea: PanelArea = React.useMemo(() => {
    if (
      isPastoralAgent ||
      pathname.startsWith('/agenda-pastoral') ||
      pathname.startsWith('/atendimentos')
    ) {
      return 'agenda';
    }
    if (
      pathname.startsWith('/programacao-e-eventos') ||
      pathname.startsWith('/programacao-paroquial') ||
      pathname.startsWith('/avisos')
    ) {
      return 'events';
    }
    if (pathname.startsWith('/configuracoes')) {
      return currentArea || 'parish';
    }
    return 'parish';
  }, [pathname, isPastoralAgent, currentArea]);

  // Keep store in sync
  React.useEffect(() => {
    if (effectiveArea !== currentArea) {
      setArea(effectiveArea);
    }
  }, [effectiveArea, currentArea, setArea]);

  const handleSelectArea = (area: PanelArea) => {
    setArea(area);
    if (area === 'agenda') {
      navigate.push(ROUTES.APPOINTMENTS.HOME);
    } else if (area === 'events') {
      navigate.push(ROUTES.CALENDAR.HOME);
    } else {
      navigate.push(ROUTES.HOME);
    }
  };

  if (isPastoralAgent) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/80 border border-zinc-200/80 text-zinc-900 font-semibold text-sm">
        <CalendarDays className="w-4 h-4 text-emerald-700" />
        <span>Agenda Pastoral</span>
      </div>
    );
  }

  const getAreaLabel = () => {
    switch (effectiveArea) {
      case 'events':
        return 'Programação & Eventos';
      case 'agenda':
        return 'Agenda Pastoral';
      case 'parish':
      default:
        return 'Dados da Paróquia';
    }
  };

  const getAreaIcon = () => {
    switch (effectiveArea) {
      case 'events':
        return <CalendarRange className="w-4 h-4 text-[#B8872E] shrink-0" />;
      case 'agenda':
        return <CalendarDays className="w-4 h-4 text-emerald-700 shrink-0" />;
      case 'parish':
      default:
        return <Church className="w-4 h-4 text-brand-700 shrink-0" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer border border-transparent hover:border-zinc-200/80 text-zinc-900 font-semibold text-sm group"
          aria-label="Selecionar módulo de gerenciamento"
        >
          {getAreaIcon()}

          <span className="truncate">{getAreaLabel()}</span>

          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-80 p-2 rounded-2xl bg-white border border-zinc-200 shadow-xl space-y-1 z-50"
      >
        <DropdownMenuLabel className="px-3 pt-2 pb-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          Módulo
        </DropdownMenuLabel>

        {/* Option 1: Programação & Eventos */}
        <DropdownMenuItem
          onClick={() => handleSelectArea('events')}
          className={cn(
            'flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer',
            effectiveArea === 'events'
              ? 'bg-amber-50/70 text-amber-950 hover:bg-amber-50'
              : 'hover:bg-zinc-100 text-zinc-700'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
              effectiveArea === 'events'
                ? 'bg-[#B8872E] text-white'
                : 'bg-zinc-100 text-zinc-600'
            )}
          >
            <CalendarRange className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold leading-tight">
                Programação & Eventos
              </span>
              {effectiveArea === 'events' && (
                <Check className="w-4 h-4 text-[#B8872E]" />
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
              Calendário e comunicação
            </p>
          </div>
        </DropdownMenuItem>

        {/* Option 2: Agenda Pastoral */}
        <DropdownMenuItem
          onClick={() => handleSelectArea('agenda')}
          className={cn(
            'flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer',
            effectiveArea === 'agenda'
              ? 'bg-emerald-50/70 text-emerald-950 hover:bg-emerald-50'
              : 'hover:bg-zinc-100 text-zinc-700'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
              effectiveArea === 'agenda'
                ? 'bg-emerald-700 text-white'
                : 'bg-zinc-100 text-zinc-600'
            )}
          >
            <CalendarDays className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold leading-tight">
                Agenda Pastoral
              </span>
              {effectiveArea === 'agenda' && (
                <Check className="w-4 h-4 text-emerald-700" />
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
              Atendimentos e agentes
            </p>
          </div>
        </DropdownMenuItem>

        {/* Option 3: Dados da Paróquia */}
        <DropdownMenuItem
          onClick={() => handleSelectArea('parish')}
          className={cn(
            'flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer',
            effectiveArea === 'parish'
              ? 'bg-brand-50/70 text-brand-950 hover:bg-brand-50'
              : 'hover:bg-zinc-100 text-zinc-700'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
              effectiveArea === 'parish'
                ? 'bg-brand-800 text-white'
                : 'bg-zinc-100 text-zinc-600'
            )}
          >
            <Church className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold leading-tight">
                Dados da Paróquia
              </span>
              {effectiveArea === 'parish' && (
                <Check className="w-4 h-4 text-brand-800" />
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
              Informações institucionais
            </p>
          </div>
        </DropdownMenuItem>

        {/* Option 4: Comunicação / Pascom (Futuro) */}
        <div
          className="flex items-start gap-3 p-2.5 rounded-xl opacity-60 cursor-not-allowed select-none"
          title="Módulo de blog e publicações da Pascom (em breve)"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-zinc-100 text-zinc-500">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold leading-tight text-zinc-600">
                Comunicação / Pascom
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-zinc-200/80 text-zinc-600">
                Em breve
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
              Blog e publicações
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
