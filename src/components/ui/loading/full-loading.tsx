import { Spinner } from './spinner';

export const FullLoading = () => (
  <div className="absolute h-full w-full top-0 right-0 flex flex-col items-center justify-center gap-8 bg-brand-0">
    <Spinner />
    <span className="text-lg font-medium text-brand-800">Carregando...</span>
  </div>
);
