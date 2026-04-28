/* eslint-disable @next/next/no-img-element */

import { MapPin } from 'lucide-react';
import Link from 'next/link';

export interface ChurchCardProps {
  community: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    type: 'parish_church' | 'chapel';
    address: string;
    coverId: string;
    coverUrl: string;
  };
}

export const ChurchCard = ({ community }: ChurchCardProps) => {
  return (
    <Link href={`/churches/${community.slug}`}>
      <div className="w-full rounded-lg shadow-sm bg-white flex flex-col sm:flex-row sm:items-center xl:items-start justify-start xl:aspect-square xl:flex-col hover:ring-brand-300 cursor-pointer outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 overflow-hidden relative hover:shadow-lg hover:-translate-y-1 transition-transform">
        {community.type === 'parish_church' && (
          <div className="ml-3 mt-3 sm:mt-0 sm:absolute sm:top-2 sm:right-2 sm:z-10">
            <span className="px-2.5 py-1.5 text-xs rounded-md w-fit-content bg-brand-700 text-white font-semibold">
              Igreja Matriz
            </span>
          </div>
        )}

        <img
          src={community.coverUrl}
          alt=""
          className="h-24 sm:h-28 w-32 sm:w-28 object-cover shrink-0 rounded ml-4 mt-4 sm:m-0 sm:rounded-none xl:w-full xl:h-full"
        />

        <div className="flex-1 px-4 pt-2.5 pb-4 xl:absolute xl:bottom-0 xl:left-0 xl:right-0 xl:bg-white">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">
            {community.name}
          </h2>
          <div className="flex items-start gap-2">
            <MapPin className="text-zinc-400 w-5" />
            <p className="text-sm text-zinc-600 flex-1 xl:line-clamp-2">
              {community.address}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
