import { TooltipProvider } from '@/components/ui/tooltip';
import '../globals.css';
import { AppSidebar } from '@/components/common/sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50/75 lg:grid-cols-app lg:grid w-full min-w-0 overflow-x-clip">
      <AppSidebar />
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );

}
