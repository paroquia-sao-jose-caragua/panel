import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, type ElementType } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';

export interface NavItemProps {
  title: string;
  icon: ElementType;
  links: {
    title: string;
    href: string;
  }[];
  onLinkClick: () => void;
}

export function NavItem({
  title,
  icon: Icon,
  links,
  onLinkClick,
}: NavItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="group w-full group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-brand-700/30 focus-visible:ring-2 focus-visible:ring-brand-400 outline-none transition-colors">
        <Icon className="h-5 w-5 text-brand-300" />
        <span className="font-medium text-brand-100 group-hover:text-brand-50">
          {title}
        </span>
        <ChevronDown className="ml-auto h-5 w-5 text-brand-300 group-hover:text-brand-300 group-data-[state=open]:rotate-180 transition-transform" />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <nav className="pl-7.5 pr-3 mt-1 space-y-1 pb-2">
          {links.map((link) => (
            <Link
              key={`nav-item-${link.href}`}
              href={link.href}
              className="block rounded-lg px-4 py-2 text-sm text-brand-200 hover:bg-brand-700/30 hover:text-brand-50 transition-colors focus-visible:ring-2 focus-visible:ring-brand-400 outline-none"
              onClick={onLinkClick}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
