import { TooltipProvider } from '@/components/ui/tooltip';
import '../globals.css';
import { AppSidebar } from '@/components/common/sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" min-h-screen bg-zinc-100/75 lg:grid-cols-app lg:grid">
      <AppSidebar />
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
