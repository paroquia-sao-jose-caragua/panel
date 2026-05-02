import { AlertTriangle } from "lucide-react";

export const DevNoticeCard = () => (
  <div className="py-6 px-6 shadow-sm rounded-xl bg-white flex flex-col items-center justify-center gap-4 border border-brand-100">
    <div className="flex items-center justify-center w-28 h-28 bg-brand-0 rounded-full">
      <AlertTriangle className="text-brand-700 w-12 h-12" />
    </div>
    <p className="text-brand-700 text-center font-semibold text-lg">
      Página em desenvolvimento
    </p>
    <p className="text-brand-600 text-center text-md">
      Em breve você poderá acessar todas as funcionalidades desta página.
    </p>
  </div>
);
