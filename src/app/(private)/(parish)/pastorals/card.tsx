/* eslint-disable @next/next/no-img-element */

import { MapPin } from 'lucide-react';
import Link from 'next/link';

export interface PastoralCardProps {
  pastoral: {
    name: string;
    coverUrl: string;
  };
}

export const PastoralCard = ({ pastoral }: PastoralCardProps) => {
  return (
    <div className="w-full rounded-lg shadow-lg bg-white flex flex-col sm:flex-row sm:items-center xl:items-start justify-start xl:flex-col hover:ring-brand-300 cursor-pointer outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 overflow-hidden relative hover:shadow-lg hover:-translate-y-1 transition-transform">
      <img
        src={pastoral.coverUrl}
        alt=""
        className="h-24 sm:h-28 w-32 sm:w-28 object-cover shrink-0 rounded ml-4 mt-4 sm:m-0 sm:rounded-none xl:w-full xl:h-56"
      />

      <div className="flex-1 px-4 pt-2.5 pb-4 xl:absolute xl:bottom-0 xl:left-0 xl:right-0 xl:bg-white">
        <h2 className="text-lg font-semibold text-zinc-900">
          {pastoral.name}
        </h2>
      </div>
    </div>
  );
};
