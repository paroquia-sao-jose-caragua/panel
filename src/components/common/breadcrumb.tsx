'use client';

import type { ElementType } from 'react';
import {
  Church,
  Settings,
  Users,
  Smartphone,
  Calendar,
  CalendarCheck,
  Bell,
  Building,
  ClipboardList,
  UserCheck,
  Layers,
  Home,
  Shield,
  Lock,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BackButton } from './back-button';
import type { BreadcrumbLinkItem } from '@/components/common/header';

const ICON_MAP: Record<string, LucideIcon> = {
  church: Church,
  settings: Settings,
  users: Users,
  smartphone: Smartphone,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  bell: Bell,
  building: Building,
  'clipboard-list': ClipboardList,
  'user-check': UserCheck,
  layers: Layers,
  home: Home,
  shield: Shield,
  lock: Lock,
  plus: Plus,
};

interface BreadcrumbIconProps {
  icon?: ElementType | string;
  className?: string;
}

export function BreadcrumbIcon({ icon, className }: BreadcrumbIconProps) {
  if (!icon) return null;

  if (typeof icon === 'string') {
    const Component = ICON_MAP[icon.toLowerCase()] || Church;
    return <Component className={className} />;
  }

  const IconComponent = icon;
  return <IconComponent className={className} />;
}

export interface AppBreadcrumbProps {
  links: BreadcrumbLinkItem[];
  showBackButton?: boolean;
}

export const AppBreadcrumb = ({ links, showBackButton = true }: AppBreadcrumbProps) => {
  const previousLink = links.length > 1 ? links[links.length - 2] : null;

  return (
    <div className="space-y-2">
      {/* Mobile Breadcrumb (visible on < lg screens) */}
      <Breadcrumb className="mb-0 lg:hidden">
        <BreadcrumbList className="mb-2">
          {links.map(({ key, href, title, icon }, index) => (
            <div key={`breadcrumb-mobile-${key}`} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              {index === 0 && icon && (
                <BreadcrumbItem>
                  <BreadcrumbIcon icon={icon} className="w-4" />
                </BreadcrumbItem>
              )}
              <BreadcrumbItem>
                {index === links.length - 1 ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button (rendered in page body below header line) */}
      {showBackButton && previousLink?.href && (
        <BackButton href={previousLink.href} />
      )}
    </div>
  );
};

