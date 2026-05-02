import '../globals.css';
import { AppSidebar } from '@/components/app/sidebar/AppSidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" min-h-screen bg-zinc-100 lg:grid-cols-app lg:grid">
      <AppSidebar />
      {children}
    </div>
  );
}
