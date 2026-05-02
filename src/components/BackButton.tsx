'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = 'Voltar' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors mb-3"
    >
      <ArrowLeft className="h-4 w-4 stroke-2" />
      <span>{label}</span>
    </Link>
  );
}
