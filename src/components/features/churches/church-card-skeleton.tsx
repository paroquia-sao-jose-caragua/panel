import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

export const ChurchCardSkeleton = () => {
  return (
    <div className="w-full rounded-lg shadow-lg bg-white flex flex-col sm:flex-row sm:items-center xl:items-start justify-start xl:aspect-square xl:flex-col hover:ring-brand-300 cursor-pointer outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 overflow-hidden relative">
      <Skeleton className="h-24 sm:h-28 w-32 sm:w-28 object-cover shrink-0 rounded ml-4 mt-4 sm:m-0 sm:rounded-none xl:w-full xl:h-full" />
      <div className="flex-1 px-4 pt-2.5 pb-4 xl:absolute xl:bottom-0 xl:left-0 xl:right-0 xl:bg-white">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          <Skeleton className="w-[60%] h-7 mb-2 max-w-45" />
        </h2>
        <div className="flex items-start gap-2">
          <MapPin className="text-zinc-400 w-5" />
          <div className="flex-1">
            <Skeleton className="w-11/12 h-4 mb-2" />
            <Skeleton className="w-10/12 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
