'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { UserNav } from './user-nav';
import { useBreadcrumbStore } from '@/stores/useBreadcrumbStore';
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

export function AppHeader() {
  const pathname = usePathname();
  const { links: customLinks, setLinks } = useBreadcrumbStore();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Clear stale custom links when navigating to a new route
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setLinks([]);
  }

  // Use page's custom links if set, otherwise fallback to path-derived breadcrumbs
  const links =
    customLinks && customLinks.length > 0
      ? customLinks
      : getBreadcrumbsForPath(pathname);

  return (
    <header className="hidden lg:flex sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-0 lg:border-b border-zinc-200/80 h-14 sm:h-16 items-center justify-between shadow-2xs">
      <div className="max-w-325 flex items-center justify-between w-full px-4 lg:px-8 mx-auto">
        {/* Left: Desktop Header Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2 min-w-0">
          {links && links.length > 0 ? (
            <Breadcrumb className="mb-0">
              <BreadcrumbList className="mb-0">
                {links.map(({ key, href, title, icon }, index) => (
                  <div key={`header-breadcrumb-${key}`} className="flex items-center gap-1.5">
                    {index > 0 && <BreadcrumbSeparator />}
                    {index === 0 && icon && (
                      <BreadcrumbItem>
                        <BreadcrumbIcon icon={icon} className="w-4 text-zinc-500" />
                      </BreadcrumbItem>
                    )}
                    <BreadcrumbItem>
                      {index === links.length - 1 ? (
                        <BreadcrumbPage className="font-semibold text-zinc-900">{title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href} className="text-zinc-500 hover:text-zinc-900">{title}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
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



