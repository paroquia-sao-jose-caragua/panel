'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ElementType, type ReactNode } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface NavItemProps {
  title: string;
  icon: ElementType;
  links: {
    title: string;
    href: string;
    badge?: ReactNode | number | string;
  }[];
  onLinkClick: () => void;
  collapsedHref?: string;
  badge?: ReactNode | number | string;
  exactMatch?: boolean;
}

export function NavItem({
  title,
  icon: Icon,
  links,
  onLinkClick,
  collapsedHref,
  badge,
  exactMatch,
}: NavItemProps) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();
  const [open, setOpen] = useState(false);

  const isLinkActive = (href: string, itemExact?: boolean) => {
    if (
      exactMatch ||
      itemExact ||
      href === '/' ||
      href === '/dados-institucionais' ||
      href === '/agenda-pastoral' ||
      href === '/atendimentos' ||
      href === '/programacao-e-eventos'
    ) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Single link nav item
  if (links.length === 1) {
    const isActive = isLinkActive(links[0].href, exactMatch);
    const itemBadge = badge ?? links[0].badge;

    const linkContent = (
      <Link
        href={links[0].href}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer relative',
          isActive
            ? 'bg-brand-700/40 text-brand-50 font-semibold shadow-2xs'
            : 'text-brand-100 hover:bg-brand-700/30 hover:text-brand-50',
          isCollapsed && 'lg:justify-center lg:px-2.5'
        )}
        onClick={onLinkClick}
      >
        <Icon
          className={cn(
            'h-5 w-5 shrink-0 transition-colors',
            isActive ? 'text-brand-300' : 'text-brand-300/80 group-hover:text-brand-300'
          )}
        />
        <span className={cn('text-sm truncate flex-1', isCollapsed && 'lg:hidden')}>
          {title}
        </span>

        {itemBadge !== undefined && itemBadge !== null && itemBadge !== '' && (
          <span
            className={cn(
              'ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors',
              isActive
                ? 'bg-white/90 text-brand-900'
                : 'bg-brand-300 text-brand-900 shadow-2xs',
              isCollapsed && 'lg:hidden'
            )}
          >
            {itemBadge}
          </span>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="hidden lg:flex items-center gap-2 bg-brand-900 text-brand-100 border border-brand-700 shadow-md"
          >
            <span>{title}</span>
            {itemBadge !== undefined && itemBadge !== null && itemBadge !== '' && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-brand-300 text-brand-900 rounded-full">
                {itemBadge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  }

  // Collapsible nav item with sublinks
  const isAnyChildActive = links.some((link) => isLinkActive(link.href));
  const targetHref = collapsedHref || links[0]?.href;

  if (isCollapsed) {
    return (
      <Collapsible.Root open={open || isAnyChildActive} onOpenChange={setOpen}>
        {/* Desktop Collapsed View: direct Link to targetHref with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={targetHref}
              className={cn(
                'group hidden lg:flex items-center justify-center rounded-xl px-2.5 py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer',
                isAnyChildActive
                  ? 'bg-brand-700/40 text-brand-50 font-semibold shadow-2xs'
                  : 'text-brand-100 hover:bg-brand-700/30 hover:text-brand-50'
              )}
              onClick={onLinkClick}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isAnyChildActive ? 'text-brand-300' : 'text-brand-300/80 group-hover:text-brand-300'
                )}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="hidden lg:flex bg-brand-900 text-brand-100 border border-brand-700 shadow-md"
          >
            {title}
          </TooltipContent>
        </Tooltip>

        {/* Mobile View: Collapsible Trigger */}
        <Collapsible.Trigger
          className={cn(
            'group lg:hidden w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer',
            isAnyChildActive
              ? 'bg-brand-700/40 text-brand-50 font-semibold shadow-2xs'
              : 'text-brand-100 hover:bg-brand-700/30 hover:text-brand-50'
          )}
        >
          <Icon
            className={cn(
              'h-5 w-5 shrink-0 transition-colors',
              isAnyChildActive ? 'text-brand-300' : 'text-brand-300/80 group-hover:text-brand-300'
            )}
          />
          <span className="text-sm truncate flex-1 text-left">{title}</span>
          <ChevronDown
            className={cn(
              'ml-auto h-4 w-4 shrink-0 transition-transform',
              isAnyChildActive ? 'text-brand-300' : 'text-brand-300/80 group-hover:text-brand-300',
              'group-data-[state=open]:rotate-180'
            )}
          />
        </Collapsible.Trigger>

        <Collapsible.Content>
          <nav className="pl-7.5 pr-3 mt-1 space-y-1 pb-2 lg:hidden">
            {links.map((link) => {
              const isChildActive = isLinkActive(link.href);
              return (
                <Link
                  key={`nav-item-${link.href}`}
                  href={link.href}
                  className={cn(
                    'block rounded-lg px-4 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                    isChildActive
                      ? 'bg-brand-700/40 text-brand-50 font-semibold'
                      : 'text-brand-200 hover:bg-brand-700/30 hover:text-brand-50'
                  )}
                  onClick={onLinkClick}
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  const triggerContent = (
    <Collapsible.Trigger
      className={cn(
        'group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer',
        isAnyChildActive
          ? 'bg-brand-700/40 text-brand-50 font-semibold shadow-2xs'
          : 'text-brand-100 hover:bg-brand-700/30 hover:text-brand-50'
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5 shrink-0 transition-colors',
          isAnyChildActive ? 'text-brand-300' : 'text-brand-300/80 group-hover:text-brand-300'
        )}
      />
      <span className="text-sm truncate flex-1 text-left">
        {title}
      </span>
      <ChevronDown
        className={cn(
          'ml-auto h-4 w-4 shrink-0 transition-transform',
          isAnyChildActive ? 'text-brand-300' : 'text-brand-300/80 group-hover:text-brand-300',
          'group-data-[state=open]:rotate-180'
        )}
      />
    </Collapsible.Trigger>
  );

  return (
    <Collapsible.Root open={open || isAnyChildActive} onOpenChange={setOpen}>
      {triggerContent}

      <Collapsible.Content>
        <nav className="pl-7.5 pr-3 mt-1 space-y-1 pb-2">
          {links.map((link) => {
            const isChildActive = isLinkActive(link.href);
            return (
              <Link
                key={`nav-item-${link.href}`}
                href={link.href}
                className={cn(
                  'block rounded-lg px-4 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                  isChildActive
                    ? 'bg-brand-700/40 text-brand-50 font-semibold'
                    : 'text-brand-200 hover:bg-brand-700/30 hover:text-brand-50'
                )}
                onClick={onLinkClick}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
