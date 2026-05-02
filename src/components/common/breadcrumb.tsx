import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { ElementType, ReactNode } from 'react';
import { BackButton } from './back-button';

interface AppBreadcrumbProps {
  links: {
    key: string;
    icon?: ElementType;
    href: string;
    title: ReactNode;
  }[];
}

export const AppBreadcrumb = ({ links }: AppBreadcrumbProps) => {
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList className="mb-3">
        {links.map(({ key, href, title, icon: Icon }, index) => (
          <div key={`breadcrumb-${key}`} className="flex items-center gap-1.5">
            {index > 0 && <BreadcrumbSeparator />}
            {index === 0 && Icon && (
              <BreadcrumbItem>
                <Icon className="w-4" />
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
      {links.length > 1 && <BackButton href={links[links.length - 2].href} />}
    </Breadcrumb>
  );
};
