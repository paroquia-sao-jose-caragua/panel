import { Plus } from 'lucide-react';
import Link from 'next/link';

interface AddCardProps {
  title: string;
  subtitle: string;
  href: string;
}

export const AddCardNavigation = ({ title, subtitle, href }: AddCardProps) => {
  return (
    <Link href={href}>
      <div className="group py-6 px-6 shadow-sm xl:aspect-square rounded-xl bg-white flex flex-col items-center justify-center gap-6 cursor-pointer outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 overflow-hidden relative transform-transition border-dashed border-2 border-zinc-200">
        <div className="group-hover:bg-zinc-100 relative w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center">
          <Plus className="text-zinc-400 w-8 h-8" strokeWidth={2} />
        </div>
        <div>
          <p className="text-zinc-900 text-center text-lg font-semibold">
            {title}
          </p>
          <p className="text-zinc-600 text-center text-sm mt-2">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
};
