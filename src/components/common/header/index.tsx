'use client';

import React, { type ElementType, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserNav } from './user-nav';
import { BreadcrumbIcon } from '@/components/common/breadcrumb';
import { getBreadcrumbsForPath } from '@/utils/get-breadcrumbs-for-path';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export interface BreadcrumbLinkItem {
  key: string;
  icon?: ElementType | string;
  href?: string;
  title: ReactNode;
}

export interface AppHeaderProps {
  links?: BreadcrumbLinkItem[];
  className?: string;
}

export function AppHeader({ links: propLinks, className }: AppHeaderProps = {}) {
  const pathname = usePathname();

  // Use page's custom links if provided, otherwise fallback to path-derived breadcrumbs
  const links =
    propLinks && propLinks.length > 0
      ? propLinks
      : getBreadcrumbsForPath(pathname);

  return (
    <header
      className={cn(
        'relative z-10 flex w-full items-center mt-16 md:mt-20 py-3 bg-transparent border-b-0 shadow-none',
        'lg:sticky lg:top-0 lg:z-30 lg:mt-0 lg:py-0 lg:h-16 lg:bg-white/95 lg:backdrop-blur-md lg:border-b lg:border-zinc-200/80 lg:shadow-2xs',
        className
      )}
    >
      <div className="max-w-325 flex items-center justify-between w-full px-4 lg:px-8 mx-auto">
        {/* Left: Breadcrumbs (Visible on both mobile and desktop) */}
        <div className="flex items-center gap-2 min-w-0">
          {links && links.length > 0 ? (
            <Breadcrumb className="mb-0">
              <BreadcrumbList className="mb-0">
                {links.map(({ key, href, title, icon }, index) => {
                  const isLast = index === links.length - 1;
                  return (
                    <div
                      key={`header-breadcrumb-${key}`}
                      className="flex items-center gap-1.5"
                    >
                      {index > 0 && <BreadcrumbSeparator />}
                      {index === 0 && icon && (
                        <BreadcrumbItem>
                          <BreadcrumbIcon
                            icon={icon}
                            className="w-4 text-zinc-500"
                          />
                        </BreadcrumbItem>
                      )}
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-semibold text-zinc-900">
                            {title}
                          </BreadcrumbPage>
                        ) : href ? (
                          <BreadcrumbLink
                            asChild
                            className="text-zinc-500 hover:text-zinc-900"
                          >
                            <Link href={href}>{title}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <span className="text-zinc-500">{title}</span>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Painel Administrativo
            </span>
          )}
        </div>

        {/* Right: User Profile Popover (Desktop only) */}
        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <UserNav />
        </div>
      </div>
    </header>
  );
}



