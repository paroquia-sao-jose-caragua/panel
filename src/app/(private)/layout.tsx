'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import '../globals.css';
import { AppSidebar } from '@/components/common/sidebar';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { cn } from '@/lib/utils';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCollapsed } = useSidebarStore();

  return (
    <TooltipProvider>
      <div
        className={cn(
          'min-h-screen bg-zinc-50/75 lg:grid w-full min-w-0 overflow-x-clip transition-all duration-300 print:block print:bg-white print:min-h-0 print:p-0',
          isCollapsed
            ? 'lg:grid-cols-[5rem_minmax(0,1fr)]'
            : 'lg:grid-cols-[18rem_minmax(0,1fr)]'
        )}
      >
        <AppSidebar />
        <div className="flex flex-col min-w-0 w-full lg:col-start-2 print:col-start-1 print:w-full print:m-0 print:p-0">
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
}
