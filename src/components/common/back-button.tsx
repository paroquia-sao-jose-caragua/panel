'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = 'Voltar', className }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn(
        'gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors mb-3 -ml-2.5 h-8',
        className
      )}
    >
      <Link href={href}>
        <ArrowLeft className="h-4 w-4 stroke-2" />
        <span>{label}</span>
      </Link>
    </Button>
  );
}
