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
      case 'agenda':
        return 'Agenda Pastoral';
      case 'events':
        return 'Programação & Eventos';
      case 'parish':
      default:
        return 'Dados da Paróquia';
    }
  };

  const getAreaIcon = () => {
    switch (effectiveArea) {
      case 'agenda':
        return <CalendarDays className="w-4 h-4 text-emerald-700 shrink-0" />;
      case 'events':
        return <CalendarRange className="w-4 h-4 text-[#B8872E] shrink-0" />;
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
          aria-label="Selecionar área de gerenciamento"
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
          Área de gerenciamento
        </DropdownMenuLabel>

        {/* Option 1: Agenda Pastoral */}
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
              Atendimentos, solicitações e disponibilidade
            </p>
          </div>
        </DropdownMenuItem>

        {/* Option 2: Programação & Eventos */}
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
              Calendário litúrgico, missas, festas e avisos
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
              Comunidades, capelas, clero e secretaria
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
